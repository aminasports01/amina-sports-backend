import { Request, Response } from 'express';

import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';

import { shipmentService } from './shipment.service';

const createShipment = catchAsync(async (req: Request, res: Response) => {
  const result = await shipmentService.createShipment(req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: 'Shipment created successfully',
    data: result,
  });
});

const getAllShipments = catchAsync(async (req: Request, res: Response) => {
  const result = await shipmentService.getAllShipments({
    search: req.query.search as string | undefined,

    status: req.query.status as 'PAID' | 'UNPAID' | undefined,

    billingStatus: req.query.billingStatus as 'PAID' | 'UNPAID' | undefined,

    shippingStatus: req.query.shippingStatus as
      | 'PROCESSING'
      | 'COMPLETED'
      | undefined,

    investorName: req.query.investorName as string | undefined,

    shippingCompany: req.query.shippingCompany as string | undefined,

    page: req.query.page as string | undefined,

    limit: req.query.limit as string | undefined,
  });

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Shipments retrieved successfully',
    data: result,
  });
});

const getSingleShipment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await shipmentService.getSingleShipment(id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Shipment retrieved successfully',
    data: result,
  });
});

const updateShipment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await shipmentService.updateShipment(id as string, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Shipment updated successfully',
    data: result,
  });
});

const deleteShipment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await shipmentService.deleteShipment(id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Shipment deleted successfully',
    data: result,
  });
});

export const shipmentController = {
  createShipment,
  getAllShipments,
  getSingleShipment,
  updateShipment,
  deleteShipment,
};
