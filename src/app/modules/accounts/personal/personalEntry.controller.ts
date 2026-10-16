import { Request, Response } from 'express';

import personalEntryService, {
  PersonalEntryService,
} from './personalEntry.service';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';

const createPersonalEntry = catchAsync(async (req: Request, res: Response) => {
  const result = await PersonalEntryService.createPersonalEntry(req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: 'Personal entry created successfully',
    data: result,
  });
});

const getAllPersonalEntries = catchAsync(
  async (req: Request, res: Response) => {
    const result = await personalEntryService.getAllPersonalEntries({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    });

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Personal entries retrieved successfully',
      data: result,
    });
  },
);

const getSinglePersonalEntry = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await PersonalEntryService.getSinglePersonalEntry(
      id as string,
    );

    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: 'Personal entry retrieved successfully',
      data: result,
    });
  },
);

const updatePersonalEntry = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await PersonalEntryService.updatePersonalEntry(
    id as string,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Personal entry updated successfully',
    data: result,
  });
});

const deletePersonalEntry = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  await PersonalEntryService.deletePersonalEntry(id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Personal entry deleted successfully',
    data: null,
  });
});

export const PersonalEntryController = {
  createPersonalEntry,
  getAllPersonalEntries,
  getSinglePersonalEntry,
  updatePersonalEntry,
  deletePersonalEntry,
};
