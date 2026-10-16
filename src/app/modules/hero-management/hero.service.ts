import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

const createHero = async (payload: Prisma.HeroCreateInput) => {
  const result = await prisma.hero.create({
    data: payload,
  });

  return result;
};

const getAllHeroes = async (isShowing?: string) => {
  const where: Prisma.HeroWhereInput = {};

  /*
    JSON field-এর nested value দিয়ে Prisma filter
  */

  if (isShowing === 'true') {
    where.OR = [
      {
        offer: {
          path: ['isShowing'],
          equals: true,
        },
      },
      {
        banner: {
          path: ['isShowing'],
          equals: true,
        },
      },
    ];
  }

  if (isShowing === 'false') {
    where.AND = [
      {
        offer: {
          path: ['isShowing'],
          equals: false,
        },
      },
      {
        banner: {
          path: ['isShowing'],
          equals: false,
        },
      },
    ];
  }

  const result = await prisma.hero.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
};

const getHeroById = async (id: string) => {
  const result = await prisma.hero.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const updateHero = async (id: string, payload: Prisma.HeroUpdateInput) => {
  const result = await prisma.hero.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteHero = async (id: string) => {
  const result = await prisma.hero.delete({
    where: {
      id,
    },
  });

  return result;
};

export const HeroService = {
  createHero,
  getAllHeroes,
  getHeroById,
  updateHero,
  deleteHero,
};
