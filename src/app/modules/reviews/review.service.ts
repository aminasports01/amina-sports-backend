import { prisma } from '../../lib/prisma';
import { IReview, ReviewQuery } from './review.interface';

const createReview = async (payload: IReview) => {
  try {
    const result = await prisma.review.create({
      data: {
        productId: payload.productId,
        userId: payload.userId,
        userName: payload.userName,
        userAvatar: payload.userAvatar,
        rating: payload.rating,
        comment: payload.comment,
        likeCount: payload.likeCount ?? 0,
        isPublished: payload.isPublished ?? true,
      },
    });

    // Update product rating & review count
    const reviews = await prisma.review.findMany({
      where: {
        productId: payload.productId,
        isPublished: true,
      },
      select: {
        rating: true,
      },
    });

    const reviewCount = reviews.length;

    const rating =
      reviewCount > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
        : 0;

    await prisma.product.update({
      where: {
        id: payload.productId,
      },
      data: {
        rating,
        reviewCount,
      },
    });

    return result;
  } catch (error) {
    console.error('CREATE REVIEW ERROR:', error);

    throw new Error('Failed to create review');
  }
};

const getProductReviews = async (productId: string, query: ReviewQuery) => {
  try {
    const { page = '1', limit = '10', rating, isPublished } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const filters: any = {
      productId,
    };

    if (rating) {
      filters.rating = Number(rating);
    }

    if (isPublished !== undefined) {
      filters.isPublished = isPublished === 'true';
    }

    const [data, total] = await Promise.all([
      prisma.review.findMany({
        where: filters,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limitNumber,
      }),

      prisma.review.count({
        where: filters,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  } catch (error) {
    console.error('GET PRODUCT REVIEWS ERROR:', error);

    throw new Error('Failed to fetch reviews');
  }
};

const getSingleReview = async (id: string) => {
  try {
    const result = await prisma.review.findUnique({
      where: {
        id,
      },
    });

    return result;
  } catch (error) {
    throw new Error('Failed to fetch review');
  }
};

const updateReview = async (id: string, payload: Partial<IReview>) => {
  try {
    const result = await prisma.review.update({
      where: {
        id,
      },
      data: payload,
    });

    // Recalculate product rating
    const reviews = await prisma.review.findMany({
      where: {
        productId: result.productId,
        isPublished: true,
      },
      select: {
        rating: true,
      },
    });

    const reviewCount = reviews.length;

    const rating =
      reviewCount > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
        : 0;

    await prisma.product.update({
      where: {
        id: result.productId,
      },
      data: {
        rating,
        reviewCount,
      },
    });

    return result;
  } catch (error) {
    console.error('UPDATE REVIEW ERROR:', error);

    throw new Error('Failed to update review');
  }
};

const deleteReview = async (id: string) => {
  try {
    const review = await prisma.review.findUnique({
      where: {
        id,
      },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    const result = await prisma.review.delete({
      where: {
        id,
      },
    });

    // Recalculate product rating
    const reviews = await prisma.review.findMany({
      where: {
        productId: review.productId,
        isPublished: true,
      },
      select: {
        rating: true,
      },
    });

    const reviewCount = reviews.length;

    const rating =
      reviewCount > 0
        ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviewCount
        : 0;

    await prisma.product.update({
      where: {
        id: review.productId,
      },
      data: {
        rating,
        reviewCount,
      },
    });

    return result;
  } catch (error) {
    console.error('DELETE REVIEW ERROR:', error);

    throw new Error('Failed to delete review');
  }
};

export const ReviewService = {
  createReview,
  getProductReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
