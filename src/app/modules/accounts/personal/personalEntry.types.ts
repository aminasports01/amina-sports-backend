export type CreatePersonalEntryPayload = {
  date: string;
  description: string;
  amount: number;

  status: 'PAID' | 'UNPAID' | 'RECEIVED';

  type: 'COST' | 'RECEIVED';

  quantity?: number;
  priceRmb?: number;
  shippingCharge?: number;

  paidReceivedBy?: string;
  platform?: string;

  clearanceStatus?: 'COMPLETED' | 'PENDING';
};
