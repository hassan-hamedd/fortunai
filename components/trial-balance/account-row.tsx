"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, Trash2, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useCallback, useEffect } from "react";
import { AccountAttachmentDialog } from "./account-attachment-dialog";

export function AccountRow({
  account,
  onClick,
  onUpdateAccount,
  onDeleteClick,
  isSelected,
  onSelectChange,
  clientId,
}) {
  const adjustmentDebit =
    account.debit - account.adjustedDebit + account.credit;
  const adjustmentCredit = account.adjustedCredit + account.credit;

  const [showAttachments, setShowAttachments] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const fetchAttachments = useCallback(async () => {
    const response = await fetch(
      `/api/clients/${clientId}/trial-balance/accounts/${account.id}/attachments`
    );
    if (response.ok) {
      const data = await response.json();
      setAttachments(data);
    }
  }, [account.id]);

  useEffect(() => {
    if (showAttachments) {
      fetchAttachments();
    }
  }, [showAttachments, fetchAttachments]);

  const handleTaxCategoryChange = (newTaxCategory) => {
    onUpdateAccount({
      ...account,
      taxCategory: newTaxCategory,
    });
  };

  return (
    <>
      <TableRow
        className={cn("hover:bg-muted/50 group", isSelected && "bg-primary/10")}
      >
        <TableCell className="pl-8">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelectChange(account.id, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            className="mr-2"
          />
          {account.code}
        </TableCell>
        <TableCell>{account.name}</TableCell>
        <TableCell className="text-right">
          {account.debit ? `$${account.debit.toLocaleString()}` : "-"}
        </TableCell>
        <TableCell className="text-right">
          {account.credit ? `$${account.credit.toLocaleString()}` : "-"}
        </TableCell>
        <TableCell className="text-right">
          {account.adjustedDebit
            ? `$${account.adjustedDebit.toLocaleString()}`
            : "-"}
        </TableCell>
        <TableCell className="text-right">
          {account.adjustedCredit
            ? `$${account.adjustedCredit.toLocaleString()}`
            : "-"}
        </TableCell>
        <TableCell className="text-right">${adjustmentDebit}</TableCell>
        <TableCell className="text-right">${adjustmentCredit}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <ChevronDown
              className="h-4 w-4 text-muted-foreground cursor-pointer"
              onClick={onClick}
            />
            <Trash2
              className="h-4 w-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={onDeleteClick}
            />
            <Paperclip
              className="h-4 w-4 text-muted-foreground cursor-pointer"
              onClick={() => setShowAttachments(true)}
            />
          </div>
        </TableCell>
      </TableRow>

      <AccountAttachmentDialog
        open={showAttachments}
        onOpenChange={setShowAttachments}
        accountId={account.id}
        clientId={clientId}
        attachments={attachments}
        onAttachmentAdded={fetchAttachments}
        onAttachmentDeleted={(id) => {
          setAttachments((prev) => prev.filter((a) => a.id !== id));
        }}
      />
    </>
  );
}
