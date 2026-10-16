export interface DashboardSummary {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  averageOrderValue: number;
  last30DaysOrders: number;
  last7DaysOrders: number;
}

export interface DashboardRecentOrder {
  id: string;
  name: string;
  phone: string;
  total: number;
  status: string;
  createdAt: Date;
  itemsCount: number;
}

export interface DashboardOrderStatus {
  status: string;
  count: number;
}

export interface DashboardTopProduct {
  productId: string;
  productName: string;
  thumbnail: string;
  quantity: number;
  revenue: number;
}

export interface DashboardRevenueTrend {
  date: string;
  revenue: number;
  orders: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  recentOrders: DashboardRecentOrder[];
  ordersByStatus: DashboardOrderStatus[];
  topProducts: DashboardTopProduct[];
  revenueTrend: DashboardRevenueTrend[];
}
