import { useState, useEffect } from "react";
import { useToast } from "./use-toast";

export function useTrialBalance(clientId: string) {
  const { toast } = useToast();

  const [trialBalance, setTrialBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrialBalance() {
      try {
        const response = await fetch(`/api/clients/${clientId}/trial-balance`);
        if (!response.ok) throw new Error("Failed to fetch trial balance");
        const data = await response.json();
        setTrialBalance(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    if (clientId) {
      fetchTrialBalance();
    }
  }, [clientId]);

  const createAccount = async (newAccount: any) => {
    try {
      const response = await fetch(
        `/api/clients/${clientId}/trial-balance/accounts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newAccount,
            trialBalanceId: trialBalance.id,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create account");

      const createdAccount = await response.json();
      setTrialBalance((prev) => ({
        ...prev,
        accounts: [...prev.accounts, createdAccount],
      }));
      toast({
        title: "Success",
        description: "Account created successfully!",
      });

      return createdAccount;
    } catch (err) {
      toast({
        title: "Error",
        description: "Error creating account: " + (err as Error).message,
        variant: "destructive",
      });
      setError(err);
      throw err;
    }
  };

  const updateAccount = async (accountId: string, data: any) => {
    try {
      const response = await fetch(
        `/api/clients/${clientId}/trial-balance/accounts`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: accountId, ...data }),
        }
      );

      if (!response.ok) throw new Error("Failed to update account");

      const updatedAccount = await response.json();
      setTrialBalance((prev) => ({
        ...prev,
        accounts: prev.accounts.map((acc) =>
          acc.id === accountId ? updatedAccount : acc
        ),
      }));

      return updatedAccount;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const addJournalEntry = async (data: any) => {
    try {
      const response = await fetch(
        `/api/clients/${clientId}/trial-balance/journal-entries`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Failed to add journal entry");

      // Refresh trial balance data after journal entry
      const refreshResponse = await fetch(
        `/api/clients/${clientId}/trial-balance`
      );
      const updatedData = await refreshResponse.json();
      setTrialBalance(updatedData);

      return updatedData;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    trialBalance,
    loading,
    error,
    createAccount, // Expose the createAccount function
    updateAccount,
    addJournalEntry,
  };
}
