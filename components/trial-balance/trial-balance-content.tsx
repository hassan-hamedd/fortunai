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
import { useTrialBalanceContext } from "@/contexts/trial-balance-context";
import { Account, TaxCategory } from "./types";
import { format } from "date-fns";
import { TrialBalanceUpload } from "./trial-balance-upload";
import { useTrialBalance } from "@/hooks/use-trial-balance";
import { FloatingCategoryDock } from "./floating-category-dock";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function TrialBalanceContent({ clientId }: { clientId: string }) {
  const { trialBalance, loading, error, categories, setCategories } =
    useTrialBalanceContext();
  const {
    createAccount,
    updateAccount,
    addJournalEntry,
    deleteAccount,
    deleteCategory,
  } = useTrialBalance(clientId);
  const { toast } = useToast();

  const [showAdjustmentDialog, setShowAdjustmentDialog] = useState(false);
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showLedger, setShowLedger] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

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

  const handleAddAccount = async (newAccount: Account) => {
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

  const handleSelectAccount = (accountId: string, isSelected: boolean) => {
    setSelectedAccounts((prev) =>
      isSelected ? [...prev, accountId] : prev.filter((id) => id !== accountId)
    );
  };

  const handleMoveAccounts = async (newCategoryId: string) => {
    try {
      // Update all selected accounts
      await Promise.all(
        selectedAccounts.map((accountId) => {
          const account = trialBalance.accounts.find(
            (acc) => acc.id === accountId
          );
          return updateAccount(accountId, {
            ...account,
            taxCategoryId: newCategoryId,
          });
        })
      );

      // Clear selections after successful move
      setSelectedAccounts([]);

      toast({
        title: "Success",
        description: "Accounts moved successfully",
      });
    } catch (error) {
      console.error("Failed to move accounts:", error);
      toast({
        title: "Error",
        description: "Failed to move accounts",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="mt-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[160px]" />
            <Skeleton className="h-10 w-[140px]" />
          </div>
          <Skeleton className="h-5 w-[200px]" />
        </div>

        <div className="rounded-md border">
          <div className="p-4">
            <div className="flex items-center space-x-4 mb-6">
              {Array.from({ length: 9 }).map((_, index) => (
                <Skeleton key={index} className="h-4 flex-1" />
              ))}
            </div>

            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-3 mb-4">
                <Skeleton className="h-6 w-[200px] mb-2" />
                {Array.from({ length: 3 }).map((_, rowIndex) => (
                  <Skeleton key={rowIndex} className="h-12 w-full" />
                ))}
              </div>
            ))}

            <Skeleton className="h-12 w-full mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading trial balance data</div>;
  }

  const isBalanced = checkBalance(trialBalance?.accounts || []);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TrialBalanceUpload clientId={clientId} />
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
                onDeleteAccount={deleteAccount}
                onDeleteCategory={deleteCategory}
                selectedAccounts={selectedAccounts}
                onSelectAccount={handleSelectAccount}
                clientId={clientId}
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

      {selectedAccounts.length > 0 && (
        <FloatingCategoryDock
          selectedCount={selectedAccounts.length}
          categories={categories}
          onMove={handleMoveAccounts}
          onClose={() => setSelectedAccounts([])}
        />
      )}

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
