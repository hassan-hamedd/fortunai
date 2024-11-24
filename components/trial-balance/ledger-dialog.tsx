"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export function LedgerDialog({ open, onOpenChange, account }) {
  if (!account) return null;

  const runningBalance = account.transactions.reduce(
    (balance, transaction) => {
      return balance + transaction.debit - transaction.credit;
    },
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {account.code} - {account.name} Ledger
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="mb-4 text-sm text-muted-foreground">
            Running Balance: ${runningBalance.toLocaleString()}
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {account.transactions.map((transaction, index) => {
                  const balance = account.transactions
                    .slice(0, index + 1)
                    .reduce((sum, t) => sum + t.debit - t.credit, 0);

                  return (
                    <TableRow key={index}>
                      <TableCell>{format(new Date(transaction.date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className="text-right">
                        {transaction.debit ? `$${transaction.debit.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {transaction.credit ? `$${transaction.credit.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        ${balance.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}