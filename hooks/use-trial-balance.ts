import { useEffect, useRef } from "react";
import { useToast } from "./use-toast";
import { useTrialBalanceContext } from "@/contexts/trial-balance-context";

export function useTrialBalance(clientId: string | undefined) {
  const { toast } = useToast();
  const { trialBalance, setTrialBalance, categories, setCategories, setError } =
    useTrialBalanceContext();
  const categoriesRef = useRef(categories);
  const trialBalanceRef = useRef(trialBalance);

  useEffect(() => {
    categoriesRef.current = categories;
  }, [categories]);

  useEffect(() => {
    trialBalanceRef.current = trialBalance;
  }, [trialBalance]);

  const createAccount = async (newAccount: any) => {
    try {
      if (!newAccount.taxCategoryId) {
        let uncategorizedCategory = categoriesRef.current.find(
          (cat) => cat.name.toLowerCase() === "uncategorized"
        );

        if (!uncategorizedCategory) {
          const response = await fetch(
            `/api/clients/${clientId}/tax-categories`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: "Uncategorized" }),
            }
          );

          if (!response.ok) throw new Error("Failed to create tax category");

          uncategorizedCategory = await response.json();

          setCategories((prev) => {
            const updatedCategories = [...prev, uncategorizedCategory];
            categoriesRef.current = updatedCategories;
            return updatedCategories;
          });
        }

        newAccount.taxCategoryId = uncategorizedCategory.id;
      }
      // Calculate the order value for the new account
      const categoryAccounts = trialBalanceRef.current.accounts
        .filter((acc) => acc.taxCategoryId === newAccount.taxCategoryId)
        .sort((a, b) => a.order - b.order);

      // If there are existing accounts in the category, place it after the last one
      // Otherwise, start at 1024 to leave room at the beginning
      const lastAccount = categoryAccounts[categoryAccounts.length - 1];
      const newOrder = lastAccount ? lastAccount.order + 1024 : 1024;

      // Create the account with the order value
      const response = await fetch(
        `/api/clients/${clientId}/trial-balance/accounts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newAccount,
            trialBalanceId: trialBalanceRef.current.id,
            order: newOrder,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create account");

      const createdAccount = await response.json();
      setTrialBalance((prev) => ({
        ...prev,
        accounts: [...prev.accounts, createdAccount],
      }));
      // Update trial balance ref
      trialBalanceRef.current = {
        ...trialBalanceRef.current,
        accounts: [...trialBalanceRef.current.accounts, createdAccount],
      };

      toast({
        title: "Success",
        description: `Account ${newAccount.name} created successfully!`,
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

  const deleteCategory = async (categoryId: string) => {
    if (
      trialBalance?.accounts.some((acc) => acc.taxCategoryId === categoryId)
    ) {
      toast({
        title: "Error",
        description: "Cannot delete category with accounts",
        variant: "destructive",
      });
      return;
    }

    const response = await fetch(`/api/clients/${clientId}/tax-categories`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: categoryId }),
    });
    if (!response.ok) throw new Error("Failed to delete tax category");

    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));

    toast({
      title: "Success",
      description: "Tax category deleted successfully",
    });
  };

  const deleteAccount = async (accountId: string) => {
    const response = await fetch(
      `/api/clients/${clientId}/trial-balance/accounts`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: accountId }),
      }
    );
    if (!response.ok) throw new Error("Failed to delete account");

    setTrialBalance((prev) => ({
      ...prev,
      accounts: prev.accounts.filter((acc) => acc.id !== accountId),
    }));

    toast({
      title: "Success",
      description: "Account deleted successfully",
    });
  };

  return {
    trialBalance,
    createAccount,
    updateAccount,
    addJournalEntry,
    categories,
    setCategories,
    deleteCategory,
    deleteAccount,
  };
}
