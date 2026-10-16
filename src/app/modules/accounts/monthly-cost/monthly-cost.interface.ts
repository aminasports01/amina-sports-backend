export interface MonthlyCostPayload {
  date: string;
  description: string;
  amount: number;
  status?: 'PAID' | 'UNPAID';
}

export interface MonthlyCostQuery {
  search?: string;
  status?: 'PAID' | 'UNPAID';
  page?: string;
  limit?: string;
}
