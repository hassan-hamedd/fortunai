"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, RefreshCw, Plus, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { AdjustmentDialog } from "./adjustment-dialog";
import { LedgerDialog } from "./ledger-dialog";
import { AccountGroup } from "./account-group";
import { NewCategoryDialog } from "./new-category-dialogue";
import { ACCOUNT_CATEGORIES } from "@/lib/constants/account-categories";
import { cn } from "@/lib/utils";
import { useTrialBalance } from "@/hooks/use-trial-balance";
import { Account, TaxCategory } from "./types";
import { format } from "date-fns";

export function TrialBalanceContent({ clientId }: { clientId: string }) {
  const {
    trialBalance,
    loading,
    error,
    updateAccount,
    addJournalEntry,
    createAccount,
  } = useTrialBalance(clientId);
  const [categories, setCategories] = useState<TaxCategory[]>([]);
  const [showAdjustmentDialog, setShowAdjustmentDialog] = useState(false);
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showLedger, setShowLedger] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(`/api/clients/${clientId}/tax-categories`);
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, [trialBalance, clientId]);

  const handleAddCategory = async (newCategory) => {
    try {
      const response = await fetch(`/api/clients/${clientId}/tax-categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategory.name }),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      const savedCategory = await response.json();
      setCategories((prev) => [
        ...prev,
        {
          ...newCategory,
          id: savedCategory.id,
        },
      ]);
      setShowNewCategoryDialog(false);
    } catch (error) {
      console.error("Failed to create category:", error);
      // You might want to add error handling UI here
    }
  };

  console.log("trial balance: ", trialBalance);
  const handleAddAccount = async (newAccount: Account) => {
    console.log("newAccount: ", newAccount);
    try {
      await createAccount(newAccount);
    } catch (error) {
      console.error("Failed to add account:", error);
    }
  };

  const handleUpdateAccount = async (updatedAccount) => {
    try {
      await updateAccount(updatedAccount.id, updatedAccount);
    } catch (error) {
      console.error("Failed to update account:", error);
    }
  };

  const handleAddJournalEntry = async (journalEntry) => {
    try {
      await addJournalEntry(journalEntry);
      setShowAdjustmentDialog(false);
    } catch (error) {
      console.error("Failed to add journal entry:", error);
    }
  };

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
    setShowLedger(true);
  };

  const checkBalance = (accounts = []) => {
    const totalDebits = accounts.reduce(
      (sum, acc) => sum + (acc.debit || 0) + (acc.adjustedDebit || 0),
      0
    );
    const totalCredits = accounts.reduce(
      (sum, acc) => sum + (acc.credit || 0) + (acc.adjustedCredit || 0),
      0
    );
    return Math.abs(totalDebits - totalCredits) < 0.01;
  };

  console.log("trialBalance: ", trialBalance);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading trial balance data</div>;
  }

  const isBalanced = checkBalance(trialBalance?.accounts || []);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync with QuickBooks
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setShowAdjustmentDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Journal Entry
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowNewCategoryDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Period: {format(trialBalance?.startDate, "MM/dd/yyyy")} to{" "}
          {format(trialBalance?.endDate, "MM/dd/yyyy")}
        </div>
      </div>

      {!isBalanced && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Warning: Trial balance is not balanced. Please review entries for
            discrepancies.
          </AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account Code</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead>Tax Category</TableHead>
              <TableHead className="text-right">Unadjusted Debit</TableHead>
              <TableHead className="text-right">Unadjusted Credit</TableHead>
              <TableHead className="text-right">Adjustments Debit</TableHead>
              <TableHead className="text-right">Adjustments Credit</TableHead>
              <TableHead className="text-right">Adjusted Debit</TableHead>
              <TableHead className="text-right">Adjusted Credit</TableHead>
              <TableHead className="w-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.values(categories).map((category) => (
              <AccountGroup
                key={category.id}
                category={category}
                categories={categories}
                accounts={trialBalance?.accounts || []}
                onAccountClick={handleAccountClick}
                onAddAccount={handleAddAccount}
                onUpdateAccount={handleUpdateAccount}
              />
            ))}

            <TableRow
              className={cn("font-semibold", !isBalanced && "text-destructive")}
            >
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">
                $
                {trialBalance?.accounts
                  .reduce((sum, account) => sum + account.debit, 0)
                  .toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                $
                {trialBalance?.accounts
                  .reduce((sum, account) => sum + account.credit, 0)
                  .toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                $
                {trialBalance?.accounts
                  .reduce(
                    (sum, account) =>
                      sum + (account.adjustedDebit - account.debit),
                    0
                  )
                  .toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                $
                {trialBalance?.accounts
                  .reduce(
                    (sum, account) =>
                      sum + (account.adjustedCredit - account.credit),
                    0
                  )
                  .toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                $
                {trialBalance?.accounts
                  .reduce((sum, account) => sum + account.adjustedDebit, 0)
                  .toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                $
                {trialBalance?.accounts
                  .reduce((sum, account) => sum + account.adjustedCredit, 0)
                  .toLocaleString()}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <AdjustmentDialog
        open={showAdjustmentDialog}
        onOpenChange={setShowAdjustmentDialog}
        accounts={trialBalance?.accounts || []}
        onSubmit={handleAddJournalEntry}
      />

      <NewCategoryDialog
        open={showNewCategoryDialog}
        onOpenChange={setShowNewCategoryDialog}
        onSubmit={handleAddCategory}
        clientId={clientId}
      />

      <LedgerDialog
        open={showLedger}
        onOpenChange={setShowLedger}
        account={selectedAccount}
      />
    </div>
  );
}
