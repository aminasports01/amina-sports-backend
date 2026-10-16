import { prisma } from '../../../lib/prisma';
import {
  InvestorPaymentPayload,
  InvestorPaymentQuery,
} from './investor-payment.interface';

const createInvestorPayment = async (payload: InvestorPaymentPayload) => {
  try {
    const result = await prisma.investorPayment.create({
      data: {
        date: new Date(payload.date),

        description: payload.description,

        amount: payload.amount,

        status: payload.status ?? 'PAID',

        investorName: payload.investorName,

        investedAmount: payload.investedAmount,

        receivedAmount: payload.receivedAmount,

        paymentBy: payload.paymentBy,

        referenceBy: payload.referenceBy,

        platform: payload.platform,

        investmentStatus: payload.investmentStatus ?? 'RUNNING',

        monthsPaid: payload.monthsPaid ?? 0,

        buyProducts: payload.buyProducts || null,
      },
    });

    return result;
  } catch (error) {
    console.error('CREATE INVESTOR PAYMENT ERROR:', error);

    throw new Error('Failed to create investor payment');
  }
};

const getAllInvestorPayments = async (query: InvestorPaymentQuery) => {
  try {
    const {
      search,
      status,
      investmentStatus,
      investorName,
      platform,
      page = '1',
      limit = '10',
    } = query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const currentLimit = Math.max(Number(limit) || 10, 1);

    const skip = (currentPage - 1) * currentLimit;

    const where: any = {};

    // Search
    if (search) {
      where.OR = [
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          investorName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          paymentBy: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          referenceBy: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          platform: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Status
    if (status) {
      where.status = status;
    }

    // Investment Status
    if (investmentStatus) {
      where.investmentStatus = investmentStatus;
    }

    // Investor
    if (investorName) {
      where.investorName = {
        contains: investorName,
        mode: 'insensitive',
      };
    }

    // Platform
    if (platform) {
      where.platform = {
        contains: platform,
        mode: 'insensitive',
      };
    }

    const [data, total] = await Promise.all([
      prisma.investorPayment.findMany({
        where,

        orderBy: {
          date: 'desc',
        },

        skip,

        take: currentLimit,
      }),

      prisma.investorPayment.count({
        where,
      }),
    ]);

    // Summary
    const [
      totalPayments,
      paid,
      unpaid,
      amountSummary,
      investedSummary,
      receivedSummary,
      monthsSummary,
    ] = await Promise.all([
      prisma.investorPayment.count(),

      prisma.investorPayment.count({
        where: {
          status: 'PAID',
        },
      }),

      prisma.investorPayment.count({
        where: {
          status: 'UNPAID',
        },
      }),

      prisma.investorPayment.aggregate({
        _sum: {
          amount: true,
        },
      }),

      prisma.investorPayment.aggregate({
        _sum: {
          investedAmount: true,
        },
      }),

      prisma.investorPayment.aggregate({
        _sum: {
          receivedAmount: true,
        },
      }),

      prisma.investorPayment.aggregate({
        _sum: {
          monthsPaid: true,
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
        totalPayments,

        paid,

        unpaid,

        totalAmount: Number(amountSummary._sum.amount ?? 0),

        totalInvestedAmount: Number(investedSummary._sum.investedAmount ?? 0),

        totalReceivedAmount: Number(receivedSummary._sum.receivedAmount ?? 0),

        totalMonthsPaid: Number(monthsSummary._sum.monthsPaid ?? 0),
      },
    };
  } catch (error) {
    console.error('GET INVESTOR PAYMENTS ERROR:', error);

    throw new Error('Failed to fetch investor payments');
  }
};

const getSingleInvestorPayment = async (id: string) => {
  try {
    const result = await prisma.investorPayment.findUnique({
      where: {
        id,
      },
    });

    return result;
  } catch (error) {
    console.error('GET SINGLE INVESTOR PAYMENT ERROR:', error);

    throw new Error('Failed to fetch investor payment');
  }
};

const updateInvestorPayment = async (
  id: string,
  payload: Partial<InvestorPaymentPayload>,
) => {
  try {
    const data: any = {
      ...payload,
    };

    if (payload.date) {
      data.date = new Date(payload.date);
    }

    const result = await prisma.investorPayment.update({
      where: {
        id,
      },

      data,
    });

    return result;
  } catch (error) {
    console.error('UPDATE INVESTOR PAYMENT ERROR:', error);

    throw new Error('Failed to update investor payment');
  }
};

const deleteInvestorPayment = async (id: string) => {
  try {
    const result = await prisma.investorPayment.delete({
      where: {
        id,
      },
    });

    return result;
  } catch (error) {
    console.error('DELETE INVESTOR PAYMENT ERROR:', error);

    throw new Error('Failed to delete investor payment');
  }
};

export const investorPaymentService = {
  createInvestorPayment,
  getAllInvestorPayments,
  getSingleInvestorPayment,
  updateInvestorPayment,
  deleteInvestorPayment,
};
