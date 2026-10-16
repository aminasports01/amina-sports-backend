import { Request, Response } from 'express';

import { ReviewService } from './review.service';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReview(req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const getProductReviews = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;

  const result = await ReviewService.getProductReviews(
    productId as string,
    req.query,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Reviews fetched successfully',
    data: result,
  });
});

const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getSingleReview(req.params.id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Review fetched successfully',
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.updateReview(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.deleteReview(req.params.id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getProductReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
