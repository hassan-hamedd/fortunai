"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccountRow({ 
  account, 
  onClick, 
  onUpdateAccount, 
  onDeleteClick,
  isSelected,
  onSelectChange 
}) {
  const adjustmentDebit = account.adjustedDebit - account.debit;
  const adjustmentCredit = account.adjustedCredit - account.credit;

  const handleTaxCategoryChange = (newTaxCategory) => {
    onUpdateAccount({
      ...account,
      taxCategory: newTaxCategory,
    });
  };

  return (
    <TableRow className={cn(
      "hover:bg-muted/50 group",
      isSelected && "bg-primary/10"
    )}>
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
        {adjustmentDebit > 0 ? `$${adjustmentDebit.toLocaleString()}` : "-"}
      </TableCell>
      <TableCell className="text-right">
        {adjustmentCredit > 0 ? `$${adjustmentCredit.toLocaleString()}` : "-"}
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
        </div>
      </TableCell>
    </TableRow>
  );
}
