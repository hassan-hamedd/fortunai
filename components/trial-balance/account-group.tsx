"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { AccountRow } from "./account-row";
import { NewAccountDialog } from "./new-account-dialogue";
import { Account, TaxCategory } from "./types";

export function AccountGroup({
  category,
  categories,
  accounts,
  onAccountClick,
  onAddAccount,
  onUpdateAccount,
}: {
  category: TaxCategory;
  categories: TaxCategory[];
  accounts: Account[];
  onAccountClick: (account: Account) => void;
  onAddAccount: (account: Account) => Promise<void>;
  onUpdateAccount: (account: Account) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showNewAccountDialog, setShowNewAccountDialog] = useState(false);

  const groupAccounts = accounts.filter(
    (account) => account.taxCategoryId === category.id
  );

  const handleAddAccount = async (account: Account) => {
    await onAddAccount(account);
    setShowNewAccountDialog(false);
  };

  return (
    <>
      <TableRow className="bg-muted/50 hover:bg-muted group">
        <TableCell colSpan={2} className="font-medium">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              {category.name}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setShowNewAccountDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
        </TableCell>
        <TableCell colSpan={8}></TableCell>
      </TableRow>

      {isExpanded &&
        groupAccounts.map((account) => (
          <AccountRow
            key={account.code}
            account={account}
            onClick={() => onAccountClick(account)}
            onUpdateAccount={onUpdateAccount}
          />
        ))}

      {isExpanded && (
        <TableRow className="bg-muted/30">
          <TableCell colSpan={3} className="font-medium">
            {category.name} Total
          </TableCell>
          <TableCell className="text-right">
            $
            {groupAccounts
              .reduce((sum, acc) => sum + acc.debit, 0)
              .toLocaleString()}
          </TableCell>
          <TableCell className="text-right">
            $
            {groupAccounts
              .reduce((sum, acc) => sum + acc.credit, 0)
              .toLocaleString()}
          </TableCell>
          <TableCell className="text-right">
            $
            {groupAccounts
              .reduce((sum, acc) => sum + (acc.adjustedDebit - acc.debit), 0)
              .toLocaleString()}
          </TableCell>
          <TableCell className="text-right">
            $
            {groupAccounts
              .reduce((sum, acc) => sum + (acc.adjustedCredit - acc.credit), 0)
              .toLocaleString()}
          </TableCell>
          <TableCell className="text-right">
            $
            {groupAccounts
              .reduce((sum, acc) => sum + acc.adjustedDebit, 0)
              .toLocaleString()}
          </TableCell>
          <TableCell className="text-right">
            $
            {groupAccounts
              .reduce((sum, acc) => sum + acc.adjustedCredit, 0)
              .toLocaleString()}
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      )}

      <NewAccountDialog
        open={showNewAccountDialog}
        onOpenChange={setShowNewAccountDialog}
        onSubmit={handleAddAccount}
        category={category}
        categories={categories}
      />
    </>
  );
}
