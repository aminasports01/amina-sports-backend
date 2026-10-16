import { prisma } from '../../lib/prisma';
import { AnalyticsQuery } from './analytics.interface';
import { OrderStatus } from '../../../generated/prisma/enums';

const createDateRange = (year: number, month?: number) => {
  if (month) {
    return {
      gte: new Date(year, month - 1, 1),
      lt: new Date(year, month, 1),
    };
  }

  return {
    gte: new Date(year, 0, 1),
    lt: new Date(year + 1, 0, 1),
  };
};

const getAllAnalytics = async (query: AnalyticsQuery) => {
  try {
    // DATE FILTER

    const currentDate = new Date();

    const year =
      query.year && Number(query.year)
        ? Number(query.year)
        : currentDate.getFullYear();

    const parsedMonth =
      query.month && Number(query.month) ? Number(query.month) : undefined;

    const month =
      parsedMonth && parsedMonth >= 1 && parsedMonth <= 12
        ? parsedMonth
        : undefined;

    const dateRange = createDateRange(year, month);

    // GET ORDERS

    const orders = await prisma.order.findMany({
      where: {
        createdAt: dateRange,
      },

      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                thumbnail: true,
                price: true,
              },
            },
          },
        },

        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    // ORDER STATUS GROUPING

    const deliveredOrders = orders.filter(
      order => order.status === OrderStatus.DELIVERED,
    );

    const pendingOrders = orders.filter(
      order => order.status === OrderStatus.PENDING,
    );

    const shippedOrders = orders.filter(
      order => order.status === OrderStatus.SHIPPED,
    );

    const cancelledOrders = orders.filter(
      order => order.status === OrderStatus.CANCELLED,
    );

    const partialOrders = orders.filter(
      order => order.status === OrderStatus.PARTIAL,
    );

    // SUMMARY

    const totalOrders = orders.length;

    const deliveredOrderCount = deliveredOrders.length;

    const totalSales = deliveredOrders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );

    const averageOrderValue =
      deliveredOrderCount > 0 ? totalSales / deliveredOrderCount : 0;

    // TOTAL SHIPPING REVENUE
    // Delivered orders only

    const totalShippingRevenue = deliveredOrders.reduce(
      (sum, order) => sum + Number(order.shippingFee),
      0,
    );

    // REVENUE TREND
    // Delivered orders only

    const revenueMap = new Map<
      string,
      {
        revenue: number;
        orders: number;
      }
    >();

    deliveredOrders.forEach(order => {
      const date = new Date(order.createdAt);

      const dateKey = date.toISOString().split('T')[0];

      const existing = revenueMap.get(dateKey);

      if (existing) {
        existing.revenue += Number(order.total);
        existing.orders += 1;
      } else {
        revenueMap.set(dateKey, {
          revenue: Number(order.total),
          orders: 1,
        });
      }
    });

    const revenueTrend = Array.from(revenueMap.entries())
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, data]) => ({
        date,
        revenue: Number(data.revenue.toFixed(2)),
        orders: data.orders,
      }));

    // ORDERS BY STATUS

    const statusMap = new Map<string, number>();

    orders.forEach(order => {
      const status = String(order.status);

      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });

    const ordersByStatus = Object.values(OrderStatus).map(status => ({
      status,
      count: statusMap.get(status) || 0,
    }));

    // BEST SELLING PRODUCTS
    // Delivered orders only

    const productMap = new Map<
      string,
      {
        productId: string;
        productName: string;
        thumbnail: string | null;
        quantity: number;
        revenue: number;
      }
    >();

    deliveredOrders.forEach(order => {
      order.items.forEach(item => {
        const itemRevenue = Number(item.price) * Number(item.quantity);

        const existing = productMap.get(item.productId);

        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += itemRevenue;
        } else {
          productMap.set(item.productId, {
            productId: item.productId,
            productName: item.name,
            thumbnail: item.product?.thumbnail ?? null,
            quantity: item.quantity,
            revenue: itemRevenue,
          });
        }
      });
    });

    const bestSellingProducts = Array.from(productMap.values())
      .sort((a, b) => {
        if (b.quantity !== a.quantity) {
          return b.quantity - a.quantity;
        }

        return b.revenue - a.revenue;
      })
      .slice(0, 10)
      .map(item => ({
        ...item,
        revenue: Number(item.revenue.toFixed(2)),
      }));

    // TOP DISTRICTS
    // Delivered orders only

    const districtMap = new Map<
      string,
      {
        district: string;
        orders: number;
        revenue: number;
      }
    >();

    deliveredOrders.forEach(order => {
      const district = order.district?.trim() || 'Unknown';

      const existing = districtMap.get(district);

      if (existing) {
        existing.orders += 1;
        existing.revenue += Number(order.total);
      } else {
        districtMap.set(district, {
          district,
          orders: 1,
          revenue: Number(order.total),
        });
      }
    });

    const topDistricts = Array.from(districtMap.values())
      .sort((a, b) => {
        if (b.revenue !== a.revenue) {
          return b.revenue - a.revenue;
        }

        return b.orders - a.orders;
      })
      .slice(0, 10)
      .map(item => ({
        ...item,
        revenue: Number(item.revenue.toFixed(2)),
      }));

    // DHAKA VS OUTSIDE DHAKA

    const insideDhakaOrders = deliveredOrders.filter(
      order => order.isInsideDhaka,
    );

    const outsideDhakaOrders = deliveredOrders.filter(
      order => !order.isInsideDhaka,
    );

    const insideDhakaRevenue = insideDhakaOrders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );

    const outsideDhakaRevenue = outsideDhakaOrders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );

    // ORDER ITEMS / PRODUCTS SOLD

    const totalProductsSold = deliveredOrders.reduce((sum, order) => {
      return (
        sum +
        order.items.reduce(
          (itemSum, item) => itemSum + Number(item.quantity),
          0,
        )
      );
    }, 0);

    // TOP CUSTOMERS

    const customerMap = new Map<
      string,
      {
        userId: string;
        name: string;
        phone: string | null;
        orders: number;
        revenue: number;
      }
    >();

    deliveredOrders.forEach(order => {
      const existing = customerMap.get(order.userId);

      if (existing) {
        existing.orders += 1;
        existing.revenue += Number(order.total);
      } else {
        customerMap.set(order.userId, {
          userId: order.userId,
          name: order.name,
          phone: order.phone,
          orders: 1,
          revenue: Number(order.total),
        });
      }
    });

    const topCustomers = Array.from(customerMap.values())
      .sort((a, b) => {
        if (b.revenue !== a.revenue) {
          return b.revenue - a.revenue;
        }

        return b.orders - a.orders;
      })
      .slice(0, 10)
      .map(item => ({
        ...item,
        revenue: Number(item.revenue.toFixed(2)),
      }));

    // RETURN RESPONSE

    return {
      filter: {
        year,
        month: month ?? null,
      },

      summary: {
        totalOrders,

        deliveredOrders: deliveredOrderCount,

        pendingOrders: pendingOrders.length,

        shippedOrders: shippedOrders.length,

        cancelledOrders: cancelledOrders.length,

        partialOrders: partialOrders.length,

        totalSales: Number(totalSales.toFixed(2)),

        totalShippingRevenue: Number(totalShippingRevenue.toFixed(2)),

        averageOrderValue: Number(averageOrderValue.toFixed(2)),

        totalProductsSold,

        insideDhakaOrders: insideDhakaOrders.length,

        outsideDhakaOrders: outsideDhakaOrders.length,

        insideDhakaRevenue: Number(insideDhakaRevenue.toFixed(2)),

        outsideDhakaRevenue: Number(outsideDhakaRevenue.toFixed(2)),
      },

      revenueTrend,

      ordersByStatus,

      bestSellingProducts,

      topDistricts,

      topCustomers,
    };
  } catch (error) {
    console.error('GET ANALYTICS ERROR:', error);

    throw new Error('Failed to fetch analytics');
  }
};

export const analyticsService = {
  getAllAnalytics,
};
