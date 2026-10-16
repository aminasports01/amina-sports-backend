export type ShipmentStatus = 'PAID' | 'UNPAID';

export type ShippingStatus = 'PROCESSING' | 'COMPLETED';

export interface ShipmentPayload {
  date: string;
  description?: string;

  amount: number;
  status: ShipmentStatus;

  productName: string;
  quantity: number;

  shippingCompany: string;
  weight: number;
  perKgRate: number;
  shippingCharge: number;

  billingStatus: ShipmentStatus;
  shippingStatus: ShippingStatus;

  receivingDate?: string;

  investorName?: string;
}

export interface ShipmentQuery {
  search?: string;
  status?: ShipmentStatus;
  billingStatus?: ShipmentStatus;
  shippingStatus?: ShippingStatus;
  investorName?: string;
  shippingCompany?: string;

  page?: string;
  limit?: string;
}
