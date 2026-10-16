import { Request, Response } from 'express';

import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { monthlyCostService } from './monthly-cost.service';

const createMonthlyCost = catchAsync(async (req: Request, res: Response) => {
  const result = await monthlyCostService.createMonthlyCost(req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: ' monthly cost created successfully',
    data: result,
  });
});

const getAllMonthlyCosts = catchAsync(async (req: Request, res: Response) => {
  const result = await monthlyCostService.getAllMonthlyCosts({
    search: req.query.search as string | undefined,

    status: req.query.status as 'PAID' | 'UNPAID' | undefined,

    page: req.query.page as string | undefined,

    limit: req.query.limit as string | undefined,
  });

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: ' monthly costs retrieved successfully',
    data: result,
  });
});

const getSingleMonthlyCost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await monthlyCostService.getSingleMonthlyCost(id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: ' monthly cost retrieved successfully',
    data: result,
  });
});

const updateMonthlyCost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await monthlyCostService.updateMonthlyCost(
    id as string,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: ' monthly cost updated successfully',
    data: result,
  });
});

const deleteMonthlyCost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await monthlyCostService.deleteMonthlyCost(id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: ' monthly cost deleted successfully',
    data: result,
  });
});

export const MonthlyCostController = {
  createMonthlyCost,
  getAllMonthlyCosts,
  getSingleMonthlyCost,
  updateMonthlyCost,
  deleteMonthlyCost,
};
