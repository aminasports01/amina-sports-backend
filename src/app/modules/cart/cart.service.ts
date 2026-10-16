import { prisma } from '../../lib/prisma';

const addToCart = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  const existingCart = await prisma.cart.findFirst({
    where: { userId, productId },
  });

  if (existingCart) {
    return await prisma.cart.update({
      where: { id: existingCart.id },
      data: {
        quantity: existingCart.quantity + quantity,
      },
    });
  }

  return await prisma.cart.create({
    data: {
      userId,
      productId,
      quantity,
    },
  });
};

const getMyCart = async (userId: string) => {
  return await prisma.cart.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });
};

const updateCartItem = async (cartId: string, quantity: number) => {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  return await prisma.cart.update({
    where: { id: cartId },
    data: { quantity },
  });
};

const deleteCartItem = async (cartId: string) => {
  return await prisma.cart.delete({
    where: { id: cartId },
  });
};

const clearCart = async (userId: string) => {
  return await prisma.cart.deleteMany({
    where: { userId },
  });
};

export const CartService = {
  addToCart,
  getMyCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
};
