import { prisma } from '../../../lib/prisma';

import { MonthlyCostPayload, MonthlyCostQuery } from './monthly-cost.interface';

const createMonthlyCost = async (payload: MonthlyCostPayload) => {
  try {
    const result = await prisma.fixedMonthlyCost.create({
      data: {
        date: new Date(payload.date),
        description: payload.description,
        amount: payload.amount,
        status: payload.status ?? 'UNPAID',
      },
    });

    return result;
  } catch (error) {
    console.error('CREATE FIXED MONTHLY COST ERROR:', error);

    throw new Error('Failed to create fixed monthly cost');
  }
};

const getAllMonthlyCosts = async (query: MonthlyCostQuery) => {
  try {
    const { search, status, page = '1', limit = '10' } = query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const currentLimit = Math.max(Number(limit) || 10, 1);

    const skip = (currentPage - 1) * currentLimit;

    const where: any = {};

    // Search
    if (search) {
      where.description = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Status
    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      prisma.fixedMonthlyCost.findMany({
        where,
        orderBy: {
          date: 'desc',
        },
        skip,
        take: currentLimit,
      }),

      prisma.fixedMonthlyCost.count({
        where,
      }),
    ]);

    // Summary
    const [totalCosts, paid, unpaid, amountSummary] = await Promise.all([
      prisma.fixedMonthlyCost.count(),

      prisma.fixedMonthlyCost.count({
        where: {
          status: 'PAID',
        },
      }),

      prisma.fixedMonthlyCost.count({
        where: {
          status: 'UNPAID',
        },
      }),

      prisma.fixedMonthlyCost.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / currentLimit);

    return {
      data,

      meta: {
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },

      summary: {
        totalCosts,
        paid,
        unpaid,
        totalAmount: Number(amountSummary._sum.amount ?? 0),
      },
    };
  } catch (error) {
    console.error('GET FIXED MONTHLY COSTS ERROR:', error);

    throw new Error('Failed to fetch fixed monthly costs');
  }
};

const getSingleMonthlyCost = async (id: string) => {
  try {
    const result = await prisma.fixedMonthlyCost.findUnique({
      where: {
        id,
      },
    });

    return result;
  } catch (error) {
    console.error('GET SINGLE FIXED MONTHLY COST ERROR:', error);

    throw new Error('Failed to fetch fixed monthly cost');
  }
};

const updateMonthlyCost = async (
  id: string,
  payload: Partial<MonthlyCostPayload>,
) => {
  try {
    const data: any = {
      ...payload,
    };

    if (payload.date) {
      data.date = new Date(payload.date);
    }

    const result = await prisma.fixedMonthlyCost.update({
      where: {
        id,
      },
      data,
    });

    return result;
  } catch (error) {
    console.error('UPDATE FIXED MONTHLY COST ERROR:', error);

    throw new Error('Failed to update fixed monthly cost');
  }
};

const deleteMonthlyCost = async (id: string) => {
  try {
    const result = await prisma.fixedMonthlyCost.delete({
      where: {
        id,
      },
    });

    return result;
  } catch (error) {
    console.error('DELETE FIXED MONTHLY COST ERROR:', error);

    throw new Error('Failed to delete fixed monthly cost');
  }
};

export const monthlyCostService = {
  createMonthlyCost,
  getAllMonthlyCosts,
  getSingleMonthlyCost,
  updateMonthlyCost,
  deleteMonthlyCost,
};
