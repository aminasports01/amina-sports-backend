import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { IProduct, ProductQuery } from './product.interface';

// CREATE PRODUCT

const createProduct = async (payload: IProduct) => {
  try {
    const { category, colorVariants, dimensions, ...rest } = payload;

    const result = await prisma.product.create({
      data: {
        ...rest,

        // Prisma Json field
        dimensions: dimensions
          ? {
              length: dimensions.length,
              width: dimensions.width,
              height: dimensions.height,
            }
          : undefined,

        category: {
          connect: {
            id: category,
          },
        },

        colorVariants: colorVariants?.length
          ? {
              create: colorVariants.map(color => ({
                color: color.color,
                image: color.image,

                sizes: {
                  create: color.sizes.map(size => ({
                    size: size.size,
                    price: size.price,
                    specialPrice: size.specialPrice,
                    stock: size.stock ?? 0,
                    sku: size.sku,
                  })),
                },
              })),
            }
          : undefined,
      },

      include: {
        category: true,
        reviews: true,

        colorVariants: {
          include: {
            sizes: true,
          },
        },
      },
    });

    return result;
  } catch (error) {
    console.error('CREATE PRODUCT ERROR:', error);

    throw new Error('Failed to create product');
  }
};

// GET ALL PRODUCTS

const getAllProducts = async (query: ProductQuery) => {
  try {
    const {
      search,
      categoryId,
      brand,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = '1',
      limit = '12',
      isFeatured,
      isPublished,
    } = query;

    // PAGINATION

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.max(Number(limit) || 12, 1);

    const skip = (pageNumber - 1) * limitNumber;

    const filters: any = {};

    // SEARCH

    if (search) {
      filters.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          brand: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // CATEGORY

    if (categoryId) {
      filters.categoryId = categoryId;
    }

    // BRAND

    if (brand) {
      filters.brand = {
        equals: brand,
        mode: 'insensitive',
      };
    }

    // FEATURED

    if (isFeatured !== undefined) {
      filters.isFeatured = isFeatured === 'true';
    }

    // PUBLISHED

    if (isPublished !== undefined) {
      filters.isPublished = isPublished === 'true';
    }

    // PRICE RANGE

    if (minPrice || maxPrice) {
      filters.price = {
        gte: minPrice ? Number(minPrice) : undefined,
        lte: maxPrice ? Number(maxPrice) : undefined,
      };
    }

    // SORT

    const allowedSortFields = [
      'createdAt',
      'updatedAt',
      'name',
      'price',
      'stock',
      'rating',
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    const orderBy = {
      [safeSortBy]: sortOrder === 'asc' ? 'asc' : 'desc',
    };

    // FETCH PRODUCTS

    const result = await prisma.product.findMany({
      where: filters,

      orderBy,

      skip,

      take: limitNumber,

      include: {
        category: true,

        colorVariants: {
          include: {
            sizes: true,
          },
        },
      },
    });

    // TOTAL

    const total = await prisma.product.count({
      where: filters,
    });

    // PAGINATION META

    const totalPages = Math.ceil(total / limitNumber);

    return {
      data: result,

      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages,

        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    };
  } catch (error) {
    console.error('GET ALL PRODUCTS ERROR:', error);

    throw new Error('Failed to fetch products');
  }
};

// GET SINGLE PRODUCT

const getSingleProduct = async (slug: string) => {
  try {
    // First find the product
    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      return null;
    }

    // Increment view count atomically
    const result = await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
      include: {
        category: true,
        reviews: true,

        colorVariants: {
          include: {
            sizes: true,
          },
        },
      },
    });

    return result;
  } catch (error) {
    console.error('GET SINGLE PRODUCT ERROR:', error);

    throw new Error('Failed to fetch product');
  }
};

// UPDATE PRODUCT

const updateProduct = async (id: string, payload: Partial<IProduct>) => {
  try {
    const { category, colorVariants, dimensions, ...rest } = payload;

    const result = await prisma.$transaction(async tx => {
      // UPDATE BASIC PRODUCT DATA

      await tx.product.update({
        where: {
          id,
        },

        data: {
          ...rest,

          ...(dimensions !== undefined
            ? {
                dimensions: dimensions
                  ? ({
                      ...(dimensions.length !== undefined && {
                        length: dimensions.length,
                      }),
                      ...(dimensions.width !== undefined && {
                        width: dimensions.width,
                      }),
                      ...(dimensions.height !== undefined && {
                        height: dimensions.height,
                      }),
                    } as Prisma.InputJsonValue)
                  : Prisma.DbNull,
              }
            : {}),

          ...(category
            ? {
                category: {
                  connect: {
                    id: category,
                  },
                },
              }
            : {}),
        },
      });

      // UPDATE COLOR VARIANTS

      if (colorVariants !== undefined) {
        // Remove old variants.
        // ProductColorVariant -> ProductSizeVariant
        // has onDelete: Cascade.
        await tx.productColorVariant.deleteMany({
          where: {
            productId: id,
          },
        });

        // Create new variants
        if (colorVariants.length > 0) {
          await tx.productColorVariant.createMany({
            data: colorVariants.map(color => ({
              productId: id,
              color: color.color,
              image: color.image,
            })),
          });

          // Fetch created colors
          const createdColors = await tx.productColorVariant.findMany({
            where: {
              productId: id,
            },

            orderBy: {
              createdAt: 'asc',
            },
          });

          // Create sizes
          for (let i = 0; i < colorVariants.length; i++) {
            const colorInput = colorVariants[i];

            const createdColor = createdColors[i];

            if (!createdColor) continue;

            if (!colorInput.sizes?.length) continue;

            await tx.productSizeVariant.createMany({
              data: colorInput.sizes.map(size => ({
                colorVariantId: createdColor.id,
                size: size.size,
                price: size.price,
                specialPrice: size.specialPrice,
                stock: size.stock ?? 0,
                sku: size.sku,
              })),
            });
          }
        }
      }

      // RETURN UPDATED PRODUCT

      return tx.product.findUnique({
        where: {
          id,
        },

        include: {
          category: true,

          colorVariants: {
            include: {
              sizes: true,
            },
          },
        },
      });
    });

    return result;
  } catch (error) {
    console.error('UPDATE PRODUCT ERROR:', error);

    throw new Error('Failed to update product');
  }
};

// DELETE PRODUCT

const deleteProduct = async (id: string) => {
  try {
    const result = await prisma.product.delete({
      where: {
        id,
      },
    });

    return result;
  } catch (error) {
    console.error('DELETE PRODUCT ERROR:', error);

    throw new Error('Failed to delete product');
  }
};

// EXPORT

export const ProductService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
