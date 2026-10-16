export interface AnalyticsQuery {
  year?: string;
  month?: string;
}

export interface RevenueTrendItem {
  date: string;
  revenue: number;
}

export interface OrdersByStatusItem {
  status: string;
  count: number;
}

export interface BestSellingProductItem {
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
}

export interface TopDistrictItem {
  district: string;
  orders: number;
  revenue: number;
}

export interface AnalyticsSummary {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  deliveredOrders: number;
}

export interface AnalyticsResponse {
  filter: {
    year: number;
    month: number | null;
  };

  summary: AnalyticsSummary;

  revenueTrend: RevenueTrendItem[];

  ordersByStatus: OrdersByStatusItem[];

  bestSellingProducts: BestSellingProductItem[];

  topDistricts: TopDistrictItem[];
}
