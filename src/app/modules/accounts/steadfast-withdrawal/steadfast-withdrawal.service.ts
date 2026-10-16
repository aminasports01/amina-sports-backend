import { prisma } from '../../../lib/prisma';
import {
  ISteadfastWithdrawal,
  SteadfastWithdrawalQuery,
} from './steadfast-withdrawal.interface';

const createWithdrawal = async (payload: ISteadfastWithdrawal) => {
  try {
    const result = await prisma.steadfastWithdrawal.create({
      data: {
        date: new Date(payload.date),
        description: payload.description,
        amount: payload.amount,
        status: payload.status,
        withdrawBy: payload.withdrawBy,
        paymentMethod: payload.paymentMethod,
        clearanceStatus: payload.clearanceStatus,
      },
    });

    return result;
  } catch (error) {
    console.error('CREATE STEADFAST WITHDRAWAL ERROR:', error);

    throw new Error('Failed to create Steadfast withdrawal');
  }
};

const getAllWithdrawals = async (query: SteadfastWithdrawalQuery) => {
  try {
    const {
      search,
      status,
      clearanceStatus,
      withdrawBy,
      page = 1,
      limit = 10,
    } = query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const currentLimit = Math.max(Number(limit) || 10, 1);

    const skip = (currentPage - 1) * currentLimit;

    const where: any = {};

    if (search) {
      where.OR = [
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          paymentMethod: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          withdrawBy: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (clearanceStatus) {
      where.clearanceStatus = clearanceStatus;
    }

    if (withdrawBy) {
      where.withdrawBy = {
        contains: withdrawBy,
        mode: 'insensitive',
      };
    }

    const [data, total, paid, unpaid, totalAmount] = await Promise.all([
      // Paginated data
      prisma.steadfastWithdrawal.findMany({
        where,
        orderBy: {
          date: 'desc',
        },
        skip,
        take: currentLimit,
      }),

      // Total entries
      prisma.steadfastWithdrawal.count({
        where,
      }),

      // Paid entries
      prisma.steadfastWithdrawal.count({
        where: {
          ...where,
          status: 'PAID',
        },
      }),

      // Unpaid entries
      prisma.steadfastWithdrawal.count({
        where: {
          ...where,
          status: 'UNPAID',
        },
      }),

      // Total amount
      prisma.steadfastWithdrawal.aggregate({
        where,
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
        totalWithdrawals: total,
        paid,
        unpaid,
        totalAmount: totalAmount._sum.amount ?? 0,
      },
    };
  } catch (error) {
    console.error('GET STEADFAST WITHDRAWALS ERROR:', error);

    throw new Error('Failed to fetch Steadfast withdrawals');
  }
};

const getSingleWithdrawal = async (id: string) => {
  try {
    const result = await prisma.steadfastWithdrawal.findUnique({
      where: { id },
    });

    if (!result) {
      throw new Error('Steadfast withdrawal not found');
    }

    return result;
  } catch (error) {
    console.error('GET SINGLE STEADFAST WITHDRAWAL ERROR:', error);

    throw new Error('Failed to fetch Steadfast withdrawal');
  }
};

const updateWithdrawal = async (
  id: string,
  payload: Partial<ISteadfastWithdrawal>,
) => {
  try {
    const data: any = {
      ...payload,
    };

    if (payload.date) {
      data.date = new Date(payload.date);
    }

    const result = await prisma.steadfastWithdrawal.update({
      where: { id },
      data,
    });

    return result;
  } catch (error) {
    console.error('UPDATE STEADFAST WITHDRAWAL ERROR:', error);

    throw new Error('Failed to update Steadfast withdrawal');
  }
};

const deleteWithdrawal = async (id: string) => {
  try {
    const result = await prisma.steadfastWithdrawal.delete({
      where: { id },
    });

    return result;
  } catch (error) {
    console.error('DELETE STEADFAST WITHDRAWAL ERROR:', error);

    throw new Error('Failed to delete Steadfast withdrawal');
  }
};

export const SteadfastWithdrawalService = {
  createWithdrawal,
  getAllWithdrawals,
  getSingleWithdrawal,
  updateWithdrawal,
  deleteWithdrawal,
};
