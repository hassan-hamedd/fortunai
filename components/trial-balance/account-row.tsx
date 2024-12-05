"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { TaxCategoryCell } from "./tax-category-cell";

export function AccountRow({ account, onClick, onUpdateAccount }) {
  const adjustmentDebit = account.adjustedDebit - account.debit;
  const adjustmentCredit = account.adjustedCredit - account.credit;

  const handleTaxCategoryChange = (newTaxCategory) => {
    onUpdateAccount({
      ...account,
      taxCategory: newTaxCategory,
    });
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="pl-8">{account.code}</TableCell>
      <TableCell>{account.name}</TableCell>
      <TableCell>
        <TaxCategoryCell
          value={account.taxCategory}
          onChange={handleTaxCategoryChange}
        />
      </TableCell>
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
        <ChevronDown
          className="h-4 w-4 text-muted-foreground cursor-pointer"
          onClick={onClick}
        />
      </TableCell>
    </TableRow>
  );
}
