import { Request, Response } from 'express';

import { WishlistService } from './wishlist.service';
import { sendResponse } from '../../shared/sendResponse';
import { catchAsync } from '../../shared/catchAsync';

/**
 * CREATE Wishlist
 */
const createWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { productId } = req.body;

  const result = await WishlistService.createWishlist(userId, productId);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: 'Added to wishlist',
    data: result,
  });
});

/**
 * GET Wishlist BY USER (TOKEN)
 */
const getWishlistByUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const result = await WishlistService.getWishlistByUser(userId);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Wishlist fetched successfully',
    data: result,
  });
});

/**
 * DELETE Wishlist ITEM
 */
const deleteWishlistItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await WishlistService.deleteWishlistItem(id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Removed from wishlist',
    data: result,
  });
});

export const WishlistController = {
  createWishlist,
  getWishlistByUser,
  deleteWishlistItem,
};
