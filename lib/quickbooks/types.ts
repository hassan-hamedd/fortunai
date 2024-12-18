export interface QuickBooksTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface QuickBooksAccount {
  Id: string;
  Name: string;
  AccountType: string;
  AccountSubType: string;
  CurrentBalance: number;
  Classification: string;
  Active: boolean;
}

export interface QuickBooksTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface QuickBooksCompany {
  id: string;
  companyName: string;
  companyId: string; // QBO realm ID
}
