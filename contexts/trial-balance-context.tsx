import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useParams } from "next/navigation";
import { TaxCategory, TrialBalance } from "@/components/trial-balance/types";

interface TrialBalanceContextType {
  trialBalance: TrialBalance | null;
  setTrialBalance: React.Dispatch<React.SetStateAction<TrialBalance | null>>;
  loading: boolean;
  error: Error | null;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  categories: TaxCategory[];
  setCategories: React.Dispatch<React.SetStateAction<TaxCategory[]>>;
}

const TrialBalanceContext = createContext<TrialBalanceContextType | undefined>(
  undefined
);

export function TrialBalanceProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const clientId = params?.id as string;

  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState<TaxCategory[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!clientId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch both trial balance and categories in parallel
        const [trialBalanceResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/clients/${clientId}/trial-balance`),
          fetch(`/api/clients/${clientId}/tax-categories`),
        ]);

        if (!trialBalanceResponse.ok)
          throw new Error("Failed to fetch trial balance");

        const [trialBalanceData, categoriesData] = await Promise.all([
          trialBalanceResponse.json(),
          categoriesResponse.json(),
        ]);

        setTrialBalance(trialBalanceData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    fetchData();
  }, [clientId]); // Only depend on clientId

  // If there's no clientId, we can show an error or redirect
  if (!clientId) {
    return <div>Invalid client ID</div>;
  }

  return (
    <TrialBalanceContext.Provider
      value={{
        trialBalance,
        loading,
        error,
        setError,
        categories,
        setCategories,
        setTrialBalance,
      }}
    >
      {children}
    </TrialBalanceContext.Provider>
  );
}

export function useTrialBalanceContext() {
  const context = useContext(TrialBalanceContext);
  if (context === undefined) {
    throw new Error(
      "useTrialBalanceContext must be used within a TrialBalanceProvider"
    );
  }
  return context;
}
