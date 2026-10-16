import { Request, Response } from 'express';

import { HeroService } from './hero.service';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';

const createHero = catchAsync(async (req: Request, res: Response) => {
  const result = await HeroService.createHero(req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: 'Hero created successfully',
    data: result,
  });
});

const getAllHeroes = catchAsync(async (req: Request, res: Response) => {
  const { isShowing } = req.query;

  const result = await HeroService.getAllHeroes(
    isShowing as string | undefined,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Heroes fetched successfully',
    data: result,
  });
});

const getHeroById = catchAsync(async (req: Request, res: Response) => {
  const result = await HeroService.getHeroById(req.params.id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Hero fetched successfully',
    data: result,
  });
});

const updateHero = catchAsync(async (req: Request, res: Response) => {
  const result = await HeroService.updateHero(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Hero updated successfully',
    data: result,
  });
});

const deleteHero = catchAsync(async (req: Request, res: Response) => {
  const result = await HeroService.deleteHero(req.params.id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: 'Hero deleted successfully',
    data: result,
  });
});

export const HeroController = {
  createHero,
  getAllHeroes,
  getHeroById,
  updateHero,
  deleteHero,
};
