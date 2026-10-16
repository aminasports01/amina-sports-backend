import { Request, Response } from 'express';
import { catchAsync } from '../../../shared/catchAsync';
import { SteadfastWithdrawalService } from './steadfast-withdrawal.service';
import { sendResponse } from '../../../shared/sendResponse';

const createWithdrawal = catchAsync(async (req: Request, res: Response) => {
  const result = await SteadfastWithdrawalService.createWithdrawal(req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: 'Steadfast withdrawal created successfully',
    data: result,
  });
});

const getAllWithdrawals = catchAsync(async (req: Request, res: Response) => {
  const result = await SteadfastWithdrawalService.getAllWithdrawals({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search as string,
    status: req.query.status as 'PAID' | 'UNPAID' | undefined,
    clearanceStatus: req.query.clearanceStatus as
      | 'COMPLETED'
      | 'PENDING'
      | undefined,
    withdrawBy: req.query.withdrawBy as string,
  });

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Steadfast withdrawals retrieved successfully',
    data: result,
  });
});

const getSingleWithdrawal = catchAsync(async (req: Request, res: Response) => {
  const result = await SteadfastWithdrawalService.getSingleWithdrawal(
    req.params.id as string,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Steadfast withdrawal retrieved successfully',
    data: result,
  });
});

const updateWithdrawal = catchAsync(async (req: Request, res: Response) => {
  const result = await SteadfastWithdrawalService.updateWithdrawal(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Steadfast withdrawal updated successfully',
    data: result,
  });
});

const deleteWithdrawal = catchAsync(async (req: Request, res: Response) => {
  const result = await SteadfastWithdrawalService.deleteWithdrawal(
    req.params.id as string,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Steadfast withdrawal deleted successfully',
    data: result,
  });
});

export const SteadfastWithdrawalController = {
  createWithdrawal,
  getAllWithdrawals,
  getSingleWithdrawal,
  updateWithdrawal,
  deleteWithdrawal,
};
