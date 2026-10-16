import { Request, Response } from 'express';

import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';

import { analyticsService } from './analytics.service';

const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await analyticsService.getAllAnalytics({
    year: req.query.year as string | undefined,

    month: req.query.month as string | undefined,
  });

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Analytics retrieved successfully',
    data: result,
  });
});

export const analyticsController = {
  getAnalytics,
};
