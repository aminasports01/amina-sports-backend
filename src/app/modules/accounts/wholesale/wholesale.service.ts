import { prisma } from '../../../lib/prisma';

import { WholesalePayload, WholesaleQuery } from './wholesale.interface';

const createWholesale = async (payload: WholesalePayload) => {
  try {
    const result = await prisma.wholesale.create({
      data: {
        date: new Date(payload.date),

        description: payload.description,

        amount: payload.amount,

        status: payload.status ?? 'UNPAID',

        productName: payload.productName,

        quantity: payload.quantity,

        priceRmb: payload.priceRmb,

        priceTaka: payload.priceTaka,

        weight: payload.weight,

        costPerKg: payload.costPerKg,

        shipping: payload.shipping,

        courierChina: payload.courierChina,

        note: payload.note,

        onePairPrice: payload.onePairPrice,

        salePrice: payload.salePrice,

        loss: payload.loss ?? 0,

        profit: payload.profit ?? 0,
      },
    });

    return result;
  } catch (error) {
    console.error('CREATE WHOLESALE ERROR:', error);

    throw new Error('Failed to create wholesale');
  }
};

const getAllWholesales = async (query: WholesaleQuery) => {
  try {
    const {
      search,
      status,
      productName,
      courierChina,
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
          productName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          courierChina: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          note: {
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

    // Product
    if (productName) {
      where.productName = {
        contains: productName,
        mode: 'insensitive',
      };
    }

    // Courier / China
    if (courierChina) {
      where.courierChina = {
        contains: courierChina,
        mode: 'insensitive',
      };
    }

    const [data, total] = await Promise.all([
      prisma.wholesale.findMany({
        where,

        orderBy: {
          date: 'desc',
        },

        skip,

        take: currentLimit,
      }),

      prisma.wholesale.count({
        where,
      }),
    ]);

    // Summary
    const [
      totalWholesales,
      paid,
      unpaid,
      amountSummary,
      shippingSummary,
      quantitySummary,
      weightSummary,
      profitSummary,
      lossSummary,
    ] = await Promise.all([
      prisma.wholesale.count(),

      prisma.wholesale.count({
        where: {
          status: 'PAID',
        },
      }),

      prisma.wholesale.count({
        where: {
          status: 'UNPAID',
        },
      }),

      prisma.wholesale.aggregate({
        _sum: {
          amount: true,
        },
      }),

      prisma.wholesale.aggregate({
        _sum: {
          shipping: true,
        },
      }),

      prisma.wholesale.aggregate({
        _sum: {
          quantity: true,
        },
      }),

      prisma.wholesale.aggregate({
        _sum: {
          weight: true,
        },
      }),

      prisma.wholesale.aggregate({
        _sum: {
          profit: true,
        },
      }),

      prisma.wholesale.aggregate({
        _sum: {
          loss: true,
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
        totalWholesales,

        paid,

        unpaid,

        totalAmount: Number(amountSummary._sum.amount ?? 0),

        totalShipping: Number(shippingSummary._sum.shipping ?? 0),

        totalQuantity: quantitySummary._sum.quantity ?? 0,

        totalWeight: Number(weightSummary._sum.weight ?? 0),

        totalProfit: Number(profitSummary._sum.profit ?? 0),

        totalLoss: Number(lossSummary._sum.loss ?? 0),
      },
    };
  } catch (error) {
    console.error('GET WHOLESALES ERROR:', error);

    throw new Error('Failed to fetch wholesales');
  }
};

const getSingleWholesale = async (id: string) => {
  try {
    const result = await prisma.wholesale.findUnique({
      where: {
        id,
      },
    });

    return result;
  } catch (error) {
    console.error('GET SINGLE WHOLESALE ERROR:', error);

    throw new Error('Failed to fetch wholesale');
  }
};

const updateWholesale = async (
  id: string,
  payload: Partial<WholesalePayload>,
) => {
  try {
    const data: any = {
      ...payload,
    };

    if (payload.date) {
      data.date = new Date(payload.date);
    }

    const result = await prisma.wholesale.update({
      where: {
        id,
      },

      data,
    });

    return result;
  } catch (error) {
    console.error('UPDATE WHOLESALE ERROR:', error);

    throw new Error('Failed to update wholesale');
  }
};

const deleteWholesale = async (id: string) => {
  try {
    const result = await prisma.wholesale.delete({
      where: {
        id,
      },
    });

    return result;
  } catch (error) {
    console.error('DELETE WHOLESALE ERROR:', error);

    throw new Error('Failed to delete wholesale');
  }
};

export const wholesaleService = {
  createWholesale,
  getAllWholesales,
  getSingleWholesale,
  updateWholesale,
  deleteWholesale,
};
