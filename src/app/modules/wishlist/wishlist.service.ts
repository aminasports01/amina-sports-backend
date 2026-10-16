import { prisma } from '../../lib/prisma';

const createWishlist = async (userId: string, productId: string) => {
  const existing = await prisma.wishlist.findFirst({
    where: { userId, productId },
  });

  if (existing) {
    throw new Error('Product already in wishlist');
  }

  const result = await prisma.wishlist.create({
    data: {
      userId,
      productId,
    },
  });

  return result;
};

const getWishlistByUser = async (userId: string) => {
  const result = await prisma.wishlist.findMany({
    where: { userId },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
};

const deleteWishlistItem = async (id: string) => {
  const result = await prisma.wishlist.delete({
    where: { id },
  });

  return result;
};

export const WishlistService = {
  createWishlist,
  getWishlistByUser,
  deleteWishlistItem,
};
