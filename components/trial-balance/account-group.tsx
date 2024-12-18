"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AccountRow } from "./account-row";
import { NewAccountDialog } from "./new-account-dialogue";
import { Account, TaxCategory } from "./types";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

export function AccountGroup({
  category,
  categories,
  accounts,
  onAccountClick,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount,
  onDeleteCategory,
  selectedAccounts,
  onSelectAccount,
  clientId,
}: {
  category: TaxCategory;
  categories: TaxCategory[];
  accounts: Account[];
  onAccountClick: (account: Account) => void;
  onAddAccount: (account: Account) => Promise<void>;
  onUpdateAccount: (account: Account) => void;
  onDeleteAccount: (accountId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  selectedAccounts: string[];
  onSelectAccount: (accountId: string, isSelected: boolean) => void;
  clientId: string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showNewAccountDialog, setShowNewAccountDialog] = useState(false);
  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null);
  const [showDeleteCategory, setShowDeleteCategory] = useState(false);

  const groupAccounts = accounts
    .filter((account) => account.taxCategoryId === category.id)
    .sort((a, b) => a.order - b.order);

  const handleAddAccount = async (account: Account) => {
    await onAddAccount(account);
    setShowNewAccountDialog(false);
  };

  const { setNodeRef } = useDroppable({
    id: category.id,
    data: {
      type: "category",
      category,
    },
  });

  return (
    <>
      <TableRow
        ref={setNodeRef}
        className="bg-muted/50 hover:bg-muted group"
        data-type="category"
        data-id={category.id}
      >
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
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setShowNewAccountDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                onClick={() => setShowDeleteCategory(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TableCell>
        <TableCell colSpan={8}></TableCell>
      </TableRow>

      {isExpanded && (
        <SortableContext
          items={groupAccounts.map((acc) => acc.id)}
          strategy={verticalListSortingStrategy}
        >
          {groupAccounts.map((account) => (
            <AccountRow
              key={account.id}
              account={account}
              onClick={() => onAccountClick(account)}
              onUpdateAccount={onUpdateAccount}
              onDeleteClick={() => setDeleteAccountId(account.id)}
              isSelected={selectedAccounts.includes(account.id)}
              onSelectChange={onSelectAccount}
              clientId={clientId}
            />
          ))}
          <TableRow className="bg-muted/30">
            <TableCell className="font-medium">{category.name} Total</TableCell>
            <TableCell />
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
                .reduce((sum, acc) => sum + acc.adjustedDebit, 0)
                .toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              $
              {groupAccounts
                .reduce((sum, acc) => sum + acc.adjustedCredit, 0)
                .toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              $
              {groupAccounts
                .reduce((sum, acc) => sum + (acc.adjustedDebit + acc.debit), 0)
                .toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              $
              {groupAccounts
                .reduce(
                  (sum, acc) => sum + (acc.adjustedCredit + acc.credit),
                  0
                )
                .toLocaleString()}
            </TableCell>
            <TableCell />
          </TableRow>
        </SortableContext>
      )}

      <AlertDialog
        open={!!deleteAccountId}
        onOpenChange={() => setDeleteAccountId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this account? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => {
                if (deleteAccountId) {
                  onDeleteAccount(deleteAccountId);
                  setDeleteAccountId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showDeleteCategory}
        onOpenChange={setShowDeleteCategory}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => {
                onDeleteCategory(category.id);
                setShowDeleteCategory(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
