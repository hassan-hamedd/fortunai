"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, Trash2, Paperclip, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useCallback, useEffect } from "react";
import { AccountAttachmentDialog } from "./account-attachment-dialog";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function AccountRow({
  account,
  onClick,
  onUpdateAccount,
  onDeleteClick,
  isSelected,
  onSelectChange,
  clientId,
  isDragging = false,
}) {
  const adjustmentDebit = account.adjustedDebit + account.debit;
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

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: account.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };

  return (
    <>
      <TableRow
        ref={setNodeRef}
        style={style}
        className={cn(
          "hover:bg-muted/50 group",
          isSelected && "bg-primary/10",
          (isDragging || isSortableDragging) && "cursor-grabbing"
        )}
      >
        <TableCell className="pl-8">
          <div className="flex items-center gap-2">
            <GripVertical
              className="h-4 w-4 text-muted-foreground cursor-grab focus:outline-none"
              {...attributes}
              {...listeners}
            />
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelectChange(account.id, e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="mr-2"
            />
            {account.code}
          </div>
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
