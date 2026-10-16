import { Request, Response } from 'express';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { investorPaymentService } from './investor-payment.service';

const createInvestorPayment = catchAsync(
  async (req: Request, res: Response) => {
    const result = await investorPaymentService.createInvestorPayment(req.body);

    sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: 'Investor payment created successfully',
      data: result,
    });
  },
);

const getAllInvestorPayments = catchAsync(
  async (req: Request, res: Response) => {
    const result = await investorPaymentService.getAllInvestorPayments({
      search: req.query.search as string | undefined,

      status: req.query.status as 'PAID' | 'UNPAID' | undefined,

      investmentStatus: req.query.investmentStatus as
        | 'RUNNING'
        | 'COMPLETED'
        | undefined,

      investorName: req.query.investorName as string | undefined,

      platform: req.query.platform as string | undefined,

      page: req.query.page as string | undefined,

      limit: req.query.limit as string | undefined,
    });

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Investor payments retrieved successfully',
      data: result,
    });
  },
);

const getSingleInvestorPayment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await investorPaymentService.getSingleInvestorPayment(
      id as string,
    );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Investor payment retrieved successfully',
      data: result,
    });
  },
);

const updateInvestorPayment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await investorPaymentService.updateInvestorPayment(
      id as string,
      req.body,
    );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Investor payment updated successfully',
      data: result,
    });
  },
);

const deleteInvestorPayment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await investorPaymentService.deleteInvestorPayment(
      id as string,
    );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Investor payment deleted successfully',
      data: result,
    });
  },
);

export const investorPaymentController = {
  createInvestorPayment,
  getAllInvestorPayments,
  getSingleInvestorPayment,
  updateInvestorPayment,
  deleteInvestorPayment,
};
