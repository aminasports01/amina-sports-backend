export type SteadfastWithdrawalStatus = 'PAID' | 'UNPAID';

export type SteadfastWithdrawalClearanceStatus = 'COMPLETED' | 'PENDING';

export interface ISteadfastWithdrawal {
  date: string | Date;
  description: string;
  amount: number;
  status: SteadfastWithdrawalStatus;
  withdrawBy: string;
  paymentMethod: string;
  clearanceStatus: SteadfastWithdrawalClearanceStatus;
}

export interface SteadfastWithdrawalQuery {
  search?: string;
  status?: SteadfastWithdrawalStatus;
  clearanceStatus?: SteadfastWithdrawalClearanceStatus;
  withdrawBy?: string;
  page?: number;
  limit?: number;
}
