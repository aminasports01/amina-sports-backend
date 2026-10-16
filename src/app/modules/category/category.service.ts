import { prisma } from '../../lib/prisma';

const createCategory = async (data: {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      slug: data.slug,
    },
  });

  if (existingCategory) {
    throw new Error('Category with this slug already exists');
  }

  const category = await prisma.category.create({
    data,
  });

  return category;
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return categories;
};

const getSingleCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      products: true,
    },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};

const updateCategory = async (
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    image?: string;
    isActive?: boolean;
  },
) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!existingCategory) {
    throw new Error('Category not found');
  }

  if (data.slug) {
    const slugExists = await prisma.category.findFirst({
      where: {
        slug: data.slug,
        NOT: {
          id,
        },
      },
    });

    if (slugExists) {
      throw new Error('Category with this slug already exists');
    }
  }

  const category = await prisma.category.update({
    where: {
      id,
    },
    data,
  });

  return category;
};

const deleteCategory = async (id: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      products: true,
    },
  });

  if (!existingCategory) {
    throw new Error('Category not found');
  }

  if (existingCategory.products.length > 0) {
    throw new Error(
      'Cannot delete category because products are assigned to it',
    );
  }

  const category = await prisma.category.delete({
    where: {
      id,
    },
  });

  return category;
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
