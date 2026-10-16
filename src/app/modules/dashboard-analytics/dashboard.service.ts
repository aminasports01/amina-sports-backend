import { OrderStatus, Role } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { DashboardData, DashboardRevenueTrend } from './dashboard.interface';

const getDashboard = async (): Promise<DashboardData> => {
  try {
    const now = new Date();

    // ==============================
    // DATE RANGES
    // ==============================

    const last30Days = new Date(now);

    last30Days.setDate(last30Days.getDate() - 30);
    last30Days.setHours(0, 0, 0, 0);

    const last7Days = new Date(now);

    last7Days.setDate(last7Days.getDate() - 7);
    last7Days.setHours(0, 0, 0, 0);

    const last14Days = new Date(now);

    last14Days.setDate(last14Days.getDate() - 13);
    last14Days.setHours(0, 0, 0, 0);

    // ==============================
    // PARALLEL DATABASE QUERIES
    // ==============================

    const [
      salesAggregate,
      deliveredOrderCount,
      totalOrders,
      totalProducts,
      totalCustomers,
      last30DaysOrders,
      last7DaysOrders,
      recentOrders,
      statusCounts,
      deliveredOrdersForProducts,
      deliveredOrdersForRevenue,
    ] = await Promise.all([
      // ==============================
      // TOTAL SALES
      // DELIVERED ONLY
      // ==============================

      prisma.order.aggregate({
        where: {
          status: OrderStatus.DELIVERED,
        },
        _sum: {
          total: true,
        },
      }),

      // ==============================
      // DELIVERED ORDER COUNT
      // ==============================

      prisma.order.count({
        where: {
          status: OrderStatus.DELIVERED,
        },
      }),

      // ==============================
      // TOTAL ORDERS
      // ==============================

      prisma.order.count(),

      // ==============================
      // TOTAL PRODUCTS
      // ==============================

      prisma.product.count(),

      // ==============================
      // TOTAL CUSTOMERS
      // ==============================

      prisma.user.count({
        where: {
          role: Role.CUSTOMER,
        },
      }),

      // ==============================
      // LAST 30 DAYS ORDERS
      // ==============================

      prisma.order.count({
        where: {
          createdAt: {
            gte: last30Days,
            lte: now,
          },
        },
      }),

      // ==============================
      // LAST 7 DAYS ORDERS
      // ==============================

      prisma.order.count({
        where: {
          createdAt: {
            gte: last7Days,
            lte: now,
          },
        },
      }),

      // ==============================
      // RECENT ORDERS
      // ==============================

      prisma.order.findMany({
        take: 5,

        orderBy: {
          createdAt: 'desc',
        },

        select: {
          id: true,
          name: true,
          phone: true,
          total: true,
          status: true,
          createdAt: true,

          _count: {
            select: {
              items: true,
            },
          },
        },
      }),

      // ==============================
      // ORDERS BY STATUS
      // ==============================

      prisma.order.groupBy({
        by: ['status'],

        _count: {
          _all: true,
        },
      }),

      // ==============================
      // DELIVERED ORDERS
      // FOR TOP PRODUCTS
      // ==============================

      prisma.order.findMany({
        where: {
          status: OrderStatus.DELIVERED,
        },

        select: {
          items: {
            select: {
              productId: true,
              name: true,
              price: true,
              quantity: true,
            },
          },
        },
      }),

      // ==============================
      // LAST 14 DAYS DELIVERED ORDERS
      // FOR REVENUE TREND
      // ==============================

      prisma.order.findMany({
        where: {
          status: OrderStatus.DELIVERED,

          createdAt: {
            gte: last14Days,
            lte: now,
          },
        },

        select: {
          total: true,
          createdAt: true,
        },

        orderBy: {
          createdAt: 'asc',
        },
      }),
    ]);

    // ==============================
    // SUMMARY
    // ==============================

    const totalSales = salesAggregate._sum.total ?? 0;

    const averageOrderValue =
      deliveredOrderCount > 0 ? totalSales / deliveredOrderCount : 0;

    // ==============================
    // ORDERS BY STATUS
    // ==============================

    const statusMap: Record<string, number> = {
      PENDING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
      PARTIAL: 0,
    };

    statusCounts.forEach(item => {
      statusMap[item.status] = item._count._all;
    });

    const ordersByStatus = [
      {
        status: 'PENDING',
        count: statusMap.PENDING,
      },
      {
        status: 'SHIPPED',
        count: statusMap.SHIPPED,
      },
      {
        status: 'DELIVERED',
        count: statusMap.DELIVERED,
      },
      {
        status: 'CANCELLED',
        count: statusMap.CANCELLED,
      },
      {
        status: 'PARTIAL',
        count: statusMap.PARTIAL,
      },
    ];

    // ==============================
    // TOP PRODUCTS BY REVENUE
    // ==============================

    const productMap = new Map<
      string,
      {
        productName: string;
        quantity: number;
        revenue: number;
      }
    >();

    deliveredOrdersForProducts.forEach(order => {
      order.items.forEach(item => {
        const existing = productMap.get(item.productId);

        const itemRevenue = item.price * item.quantity;

        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += itemRevenue;
        } else {
          productMap.set(item.productId, {
            productName: item.name,
            quantity: item.quantity,
            revenue: itemRevenue,
          });
        }
      });
    });

    const topProductEntries = Array.from(productMap.entries())
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5);

    // Get current product thumbnails
    const productIds = topProductEntries.map(([productId]) => productId);

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },

      select: {
        id: true,
        thumbnail: true,
      },
    });

    const thumbnailMap = new Map(
      products.map(product => [product.id, product.thumbnail]),
    );

    const topProducts = topProductEntries.map(([productId, product]) => ({
      productId,
      productName: product.productName,
      thumbnail: thumbnailMap.get(productId) ?? '',
      quantity: product.quantity,
      revenue: product.revenue,
    }));

    // ==============================
    // REVENUE TREND
    // LAST 14 DAYS
    // DELIVERED ORDERS ONLY
    // ==============================

    const revenueMap = new Map<
      string,
      {
        revenue: number;
        orders: number;
      }
    >();

    deliveredOrdersForRevenue.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];

      const existing = revenueMap.get(date);

      if (existing) {
        existing.revenue += order.total;
        existing.orders += 1;
      } else {
        revenueMap.set(date, {
          revenue: order.total,
          orders: 1,
        });
      }
    });

    // Create all 14 days, including days with zero revenue
    const revenueTrend: DashboardRevenueTrend[] = [];

    for (let i = 0; i < 14; i++) {
      const date = new Date(last14Days);

      date.setDate(last14Days.getDate() + i);

      const dateString = date.toISOString().split('T')[0];

      const data = revenueMap.get(dateString);

      revenueTrend.push({
        date: dateString,
        revenue: data?.revenue ?? 0,
        orders: data?.orders ?? 0,
      });
    }

    // ==============================
    // RECENT ORDERS
    // ==============================

    const formattedRecentOrders = recentOrders.map(order => ({
      id: order.id,
      name: order.name,
      phone: order.phone,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      itemsCount: order._count.items,
    }));

    // ==============================
    // FINAL RESPONSE
    // ==============================

    return {
      summary: {
        totalSales,
        totalOrders,
        totalProducts,
        totalCustomers,
        averageOrderValue,
        last30DaysOrders,
        last7DaysOrders,
      },

      recentOrders: formattedRecentOrders,

      ordersByStatus,

      topProducts,

      revenueTrend,
    };
  } catch (error) {
    console.error('Dashboard analytics error:', error);

    throw new Error('Failed to fetch dashboard analytics');
  }
};

export const DashboardService = {
  getDashboard,
};
