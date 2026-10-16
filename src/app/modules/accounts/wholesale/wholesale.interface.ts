export type WholesaleStatus = 'PAID' | 'UNPAID';

export interface WholesalePayload {
  date: string;
  description?: string;

  amount: number;
  status?: WholesaleStatus;

  productName: string;
  quantity: number;

  priceRmb: number;
  priceTaka: number;

  weight: number;
  costPerKg: number;

  shipping: number;
  courierChina?: string;

  note?: string;

  onePairPrice: number;
  salePrice: number;

  loss?: number;
  profit?: number;
}

export interface WholesaleQuery {
  search?: string;
  status?: WholesaleStatus;
  productName?: string;
  courierChina?: string;

  page?: string;
  limit?: string;
}
