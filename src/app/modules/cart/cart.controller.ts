import { Request, Response } from 'express';
import { CartService } from './cart.service';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;

  const result = await CartService.addToCart(
    userId as string,
    productId,
    quantity,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Added to cart',
    data: result,
  });
});

const getMyCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await CartService.getMyCart(userId as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Cart fetched successfully',
    data: result,
  });
});

const updateCartItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const result = await CartService.updateCartItem(id as string, quantity);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Cart updated successfully',
    data: result,
  });
});

const deleteCartItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CartService.deleteCartItem(id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Cart item deleted',
    data: result,
  });
});

const clearCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const result = await CartService.clearCart(userId as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Cart cleared',
    data: result,
  });
});

export const CartController = {
  addToCart,
  getMyCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
};
