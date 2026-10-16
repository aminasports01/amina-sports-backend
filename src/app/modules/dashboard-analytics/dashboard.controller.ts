import { Request, Response } from 'express';

import { DashboardService } from './dashboard.service';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';

const getDashboard = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getDashboard();

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Dashboard analytics retrieved successfully',
    data: result,
  });
});

export const DashboardController = {
  getDashboard,
};
