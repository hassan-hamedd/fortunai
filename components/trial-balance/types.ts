export interface TrialBalance {
  id: string;
  clientId: string;
  startDate: Date;
  endDate: Date;
  accounts: Account[];
}

export interface Account {
  id: string;
  trialBalanceId: string;
  code: string;
  name: string;
  debit: number;
  credit: number;
  adjustedDebit: number;
  adjustedCredit: number;
  taxCategoryId: string | null;
  // Note: Relationships are optional since they might not always be loaded
  transactions?: Transaction[];
  taxCategory?: TaxCategory;
  order: number;
}

// You might also want these related interfaces:
export interface Transaction {
  id: string;
  accountId: string;
  date: Date;
  description: string;
  debit: number;
  credit: number;
  createdAt: Date;
}

export interface TaxCategory {
  id: string;
  name: string;
  clientId: string;
}
