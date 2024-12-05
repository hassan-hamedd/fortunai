interface FetchAccountsOptions {
  clientId: string;
  trialBalanceId?: string;
}

export async function fetchAccounts({ clientId, trialBalanceId }: FetchAccountsOptions) {
  try {
    const queryParams = new URLSearchParams();
    if (clientId) queryParams.append('clientId', clientId);
    if (trialBalanceId) queryParams.append('trialBalanceId', trialBalanceId);

    const response = await fetch(`/api/accounts?${queryParams.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch accounts');
    }

    const data = await response.json();
    return {
      accounts: data.accounts,
      periods: {
        current: {
          startDate: data.trialBalance.startDate,
          endDate: data.trialBalance.endDate,
        },
      },
      journalEntries: data.journalEntries || [],
    };
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
}
