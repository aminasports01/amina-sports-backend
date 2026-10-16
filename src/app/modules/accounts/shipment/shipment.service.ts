import { prisma } from '../../../lib/prisma';

import { ShipmentPayload, ShipmentQuery } from './shipment.interface';

const createShipment = async (payload: ShipmentPayload) => {
  try {
    const result = await prisma.shipment.create({
      data: {
        date: new Date(payload.date),

        description: payload.description,

        amount: payload.amount,

        status: payload.status,

        productName: payload.productName,

        quantity: payload.quantity,

        shippingCompany: payload.shippingCompany,

        weight: payload.weight,

        perKgRate: payload.perKgRate,

        shippingCharge: payload.shippingCharge,

        billingStatus: payload.billingStatus,

        shippingStatus: payload.shippingStatus,

        receivingDate: payload.receivingDate
          ? new Date(payload.receivingDate)
          : null,

        investorName: payload.investorName,
      },
    });

    return result;
  } catch (error) {
    console.error('CREATE SHIPMENT ERROR:', error);

    throw new Error('Failed to create shipment');
  }
};

const getAllShipments = async (query: ShipmentQuery) => {
  try {
    const {
      search,
      status,
      billingStatus,
      shippingStatus,
      investorName,
      shippingCompany,
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
          shippingCompany: {
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
      ];
    }

    // Status
    if (status) {
      where.status = status;
    }

    // Billing Status
    if (billingStatus) {
      where.billingStatus = billingStatus;
    }

    // Shipping Status
    if (shippingStatus) {
      where.shippingStatus = shippingStatus;
    }

    // Investor
    if (investorName) {
      where.investorName = {
        contains: investorName,
        mode: 'insensitive',
      };
    }

    // Shipping Company
    if (shippingCompany) {
      where.shippingCompany = {
        contains: shippingCompany,
        mode: 'insensitive',
      };
    }

    const [data, total] = await Promise.all([
      prisma.shipment.findMany({
        where,

        orderBy: {
          date: 'desc',
        },

        skip,

        take: currentLimit,
      }),

      prisma.shipment.count({
        where,
      }),
    ]);

    // ==============================
    // SUMMARY
    // ==============================

    const [
      totalShipments,
      paid,
      unpaid,
      processing,
      completed,
      amountSummary,
      shippingChargeSummary,
      totalQuantity,
      weightSummary,
    ] = await Promise.all([
      prisma.shipment.count(),

      prisma.shipment.count({
        where: {
          billingStatus: 'PAID',
        },
      }),

      prisma.shipment.count({
        where: {
          billingStatus: 'UNPAID',
        },
      }),

      prisma.shipment.count({
        where: {
          shippingStatus: 'PROCESSING',
        },
      }),

      prisma.shipment.count({
        where: {
          shippingStatus: 'COMPLETED',
        },
      }),

      prisma.shipment.aggregate({
        _sum: {
          amount: true,
        },
      }),

      prisma.shipment.aggregate({
        _sum: {
          shippingCharge: true,
        },
      }),

      prisma.shipment.aggregate({
        _sum: {
          quantity: true,
        },
      }),

      prisma.shipment.aggregate({
        _sum: {
          weight: true,
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
        totalShipments,

        paid,

        unpaid,

        processing,

        completed,

        totalAmount: Number(amountSummary._sum.amount ?? 0),

        totalShippingCharge: Number(
          shippingChargeSummary._sum.shippingCharge ?? 0,
        ),

        totalQuantity: totalQuantity._sum.quantity ?? 0,

        totalWeight: Number(weightSummary._sum.weight ?? 0),
      },
    };
  } catch (error) {
    console.error('GET SHIPMENTS ERROR:', error);

    throw new Error('Failed to fetch shipments');
  }
};

const getSingleShipment = async (id: string) => {
  try {
    const result = await prisma.shipment.findUnique({
      where: {
        id,
      },
    });

    return result;
  } catch (error) {
    console.error('GET SINGLE SHIPMENT ERROR:', error);

    throw new Error('Failed to fetch shipment');
  }
};

const updateShipment = async (
  id: string,
  payload: Partial<ShipmentPayload>,
) => {
  try {
    const data: any = {
      ...payload,
    };

    if (payload.date) {
      data.date = new Date(payload.date);
    }

    if (payload.receivingDate) {
      data.receivingDate = new Date(payload.receivingDate);
    }

    const result = await prisma.shipment.update({
      where: {
        id,
      },

      data,
    });

    return result;
  } catch (error) {
    console.error('UPDATE SHIPMENT ERROR:', error);

    throw new Error('Failed to update shipment');
  }
};

const deleteShipment = async (id: string) => {
  try {
    const result = await prisma.shipment.delete({
      where: {
        id,
      },
    });

    return result;
  } catch (error) {
    console.error('DELETE SHIPMENT ERROR:', error);

    throw new Error('Failed to delete shipment');
  }
};

export const shipmentService = {
  createShipment,
  getAllShipments,
  getSingleShipment,
  updateShipment,
  deleteShipment,
};
