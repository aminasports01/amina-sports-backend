import { prisma } from '../../../lib/prisma';
import { CreatePersonalEntryPayload } from './personalEntry.types';

const createPersonalEntry = async (payload: CreatePersonalEntryPayload) => {
  const {
    date,
    description,
    amount,
    status,
    type,
    quantity,
    priceRmb,
    shippingCharge,
    paidReceivedBy,
    platform,
    clearanceStatus,
  } = payload;

  const result = await prisma.personalEntry.create({
    data: {
      date: new Date(date),
      description,
      amount,

      status,
      type,

      quantity,
      priceRmb,
      shippingCharge,

      paidReceivedBy,
      platform,

      clearanceStatus: clearanceStatus ?? 'PENDING',

      accountType: 'PERSONAL',
    },
  });

  return result;
};

interface GetAllPersonalEntriesParams {
  page?: number;
  limit?: number;
}

const getAllPersonalEntries = async (
  params: GetAllPersonalEntriesParams = {},
) => {
  const page = Math.max(Number(params.page) || 1, 1);
  const limit = Math.max(Number(params.limit) || 10, 1);

  const skip = (page - 1) * limit;

  // TOTAL + DATA + STATUS SUMMARY

  const [entries, total, statusSummary] = await Promise.all([
    // Paginated entries
    prisma.personalEntry.findMany({
      skip,
      take: limit,

      orderBy: {
        date: 'desc',
      },
    }),

    // Total entries
    prisma.personalEntry.count(),

    // Status wise count
    prisma.personalEntry.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    }),
  ]);

  // STATUS SUMMARY

  const summary = {
    totalEntries: total,
    paid: 0,
    unpaid: 0,
    received: 0,
  };

  statusSummary.forEach(item => {
    switch (item.status) {
      case 'PAID':
        summary.paid = item._count._all;
        break;

      case 'UNPAID':
        summary.unpaid = item._count._all;
        break;

      case 'RECEIVED':
        summary.received = item._count._all;
        break;
    }
  });

  // META

  const totalPages = Math.ceil(total / limit);

  const meta = {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  return {
    data: entries,
    meta,
    summary,
  };
};

export default {
  getAllPersonalEntries,
};

const getSinglePersonalEntry = async (id: string) => {
  const result = await prisma.personalEntry.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const updatePersonalEntry = async (
  id: string,
  payload: Partial<CreatePersonalEntryPayload>,
) => {
  const data: Record<string, unknown> = {
    ...payload,
  };

  if (payload.date) {
    data.date = new Date(payload.date);
  }

  const result = await prisma.personalEntry.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

const deletePersonalEntry = async (id: string) => {
  const result = await prisma.personalEntry.delete({
    where: {
      id,
    },
  });

  return result;
};

export const PersonalEntryService = {
  createPersonalEntry,
  getAllPersonalEntries,
  getSinglePersonalEntry,
  updatePersonalEntry,
  deletePersonalEntry,
};
