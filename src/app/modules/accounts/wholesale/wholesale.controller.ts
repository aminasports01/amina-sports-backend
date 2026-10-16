import { Request, Response } from 'express';

import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';

import { wholesaleService } from './wholesale.service';

const createWholesale = catchAsync(async (req: Request, res: Response) => {
  const result = await wholesaleService.createWholesale(req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: 'Wholesale created successfully',
    data: result,
  });
});

const getAllWholesales = catchAsync(async (req: Request, res: Response) => {
  const result = await wholesaleService.getAllWholesales({
    search: req.query.search as string | undefined,

    status: req.query.status as 'PAID' | 'UNPAID' | undefined,

    productName: req.query.productName as string | undefined,

    courierChina: req.query.courierChina as string | undefined,

    page: req.query.page as string | undefined,

    limit: req.query.limit as string | undefined,
  });

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Wholesales retrieved successfully',
    data: result,
  });
});

const getSingleWholesale = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await wholesaleService.getSingleWholesale(id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Wholesale retrieved successfully',
    data: result,
  });
});

const updateWholesale = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await wholesaleService.updateWholesale(id as string, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Wholesale updated successfully',
    data: result,
  });
});

const deleteWholesale = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await wholesaleService.deleteWholesale(id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Wholesale deleted successfully',
    data: result,
  });
});

export const wholesaleController = {
  createWholesale,
  getAllWholesales,
  getSingleWholesale,
  updateWholesale,
  deleteWholesale,
};
