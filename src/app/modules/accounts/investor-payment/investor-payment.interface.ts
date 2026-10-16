export type InvestorPaymentStatus = 'PAID' | 'UNPAID';

export type InvestmentStatus = 'RUNNING' | 'COMPLETED';

export interface InvestorPaymentPayload {
  date: string;
  description: string;

  amount: number;

  status?: InvestorPaymentStatus;

  investorName: string;

  investedAmount: number;
  receivedAmount: number;

  paymentBy: string;
  referenceBy: string;
  platform: string;

  investmentStatus?: InvestmentStatus;

  monthsPaid?: number;

  buyProducts?: string;
}

export interface InvestorPaymentQuery {
  search?: string;
  status?: InvestorPaymentStatus;
  investmentStatus?: InvestmentStatus;
  investorName?: string;
  platform?: string;
  page?: string;
  limit?: string;
}

export interface InvestorPaymentSummary {
  totalPayments: number;
  paid: number;
  unpaid: number;
  totalAmount: number;
  totalInvestedAmount: number;
  totalReceivedAmount: number;
  totalMonthsPaid: number;
}

export interface InvestorPaymentMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
