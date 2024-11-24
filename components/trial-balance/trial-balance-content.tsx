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
import { Download, RefreshCw, Plus, AlertTriangle, ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { AdjustmentDialog } from "./adjustment-dialog";
import { LedgerDialog } from "./ledger-dialog";
import { cn } from "@/lib/utils";

const mockTrialBalance = {
  accounts: [
    { 
      code: "1000", 
      name: "Cash", 
      debit: 50000, 
      credit: 0, 
      adjustedDebit: 50000, 
      adjustedCredit: 0,
      previousDebit: 45000,
      previousCredit: 0,
      transactions: [
        { date: "2024-02-20", description: "Client Payment", debit: 30000, credit: 0 },
        { date: "2024-02-15", description: "Office Rent", debit: 0, credit: 2500 },
      ]
    },
    // ... other accounts with similar structure
  ],
  adjustments: [],
  periods: {
    current: { startDate: "2024-01-01", endDate: "2024-02-29" },
    previous: { startDate: "2023-11-01", endDate: "2023-12-31" }
  }
};

export function TrialBalanceContent({ clientId }: { clientId: string }) {
  const [trialBalance, setTrialBalance] = useState(mockTrialBalance);
  const [showAdjustmentDialog, setShowAdjustmentDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showLedger, setShowLedger] = useState(false);

  const handleAddAdjustment = (adjustment) => {
    setTrialBalance(prev => {
      const updatedAccounts = prev.accounts.map(account => {
        if (account.code === adjustment.accountCode) {
          return {
            ...account,
            adjustedDebit: account.adjustedDebit + (adjustment.type === 'debit' ? adjustment.amount : 0),
            adjustedCredit: account.adjustedCredit + (adjustment.type === 'credit' ? adjustment.amount : 0),
          };
        }
        return account;
      });

      return {
        ...prev,
        accounts: updatedAccounts,
        adjustments: [...prev.adjustments, adjustment],
      };
    });
    setShowAdjustmentDialog(false);
  };

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
    setShowLedger(true);
  };

  const checkBalance = (accounts) => {
    const totalDebits = accounts.reduce((sum, acc) => sum + acc.debit + acc.adjustedDebit, 0);
    const totalCredits = accounts.reduce((sum, acc) => sum + acc.credit + acc.adjustedCredit, 0);
    return Math.abs(totalDebits - totalCredits) < 0.01; // Allow for small rounding differences
  };

  const isBalanced = checkBalance(trialBalance.accounts);

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
        </div>
        <div className="text-sm text-muted-foreground">
          Period: {trialBalance.periods.current.startDate} to {trialBalance.periods.current.endDate}
        </div>
      </div>

      {!isBalanced && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Warning: Trial balance is not balanced. Please review entries for discrepancies.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="trial-balance">
        <TabsList>
          <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
          <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
          <TabsTrigger value="adjusted">Adjusted Trial Balance</TabsTrigger>
          <TabsTrigger value="comparative">Comparative</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trial-balance">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trialBalance.accounts.map((account) => (
                  <TableRow 
                    key={account.code}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleAccountClick(account)}
                  >
                    <TableCell>{account.code}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell className="text-right">
                      {account.debit ? `$${account.debit.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {account.credit ? `$${account.credit.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className={cn(
                  "font-semibold",
                  !isBalanced && "text-destructive"
                )}>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="text-right">
                    ${trialBalance.accounts
                      .reduce((sum, account) => sum + account.debit, 0)
                      .toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    ${trialBalance.accounts
                      .reduce((sum, account) => sum + account.credit, 0)
                      .toLocaleString()}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="adjustments">
          <div className="space-y-4">
            <Button onClick={() => setShowAdjustmentDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Adjustment
            </Button>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trialBalance.adjustments.map((adjustment, index) => (
                    <TableRow key={index}>
                      <TableCell>{adjustment.date}</TableCell>
                      <TableCell>{adjustment.accountCode}</TableCell>
                      <TableCell>{adjustment.description}</TableCell>
                      <TableCell className="text-right">
                        {adjustment.type === 'debit' ? `$${adjustment.amount.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {adjustment.type === 'credit' ? `$${adjustment.amount.toLocaleString()}` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="comparative">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Current Debit</TableHead>
                  <TableHead className="text-right">Current Credit</TableHead>
                  <TableHead className="text-right">Previous Debit</TableHead>
                  <TableHead className="text-right">Previous Credit</TableHead>
                  <TableHead className="text-right">Change %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trialBalance.accounts.map((account) => {
                  const currentNet = account.debit - account.credit;
                  const previousNet = account.previousDebit - account.previousCredit;
                  const changePercent = previousNet !== 0 
                    ? ((currentNet - previousNet) / Math.abs(previousNet) * 100).toFixed(1)
                    : 'N/A';
                  
                  return (
                    <TableRow key={account.code}>
                      <TableCell>{account.name}</TableCell>
                      <TableCell className="text-right">
                        {account.debit ? `$${account.debit.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {account.credit ? `$${account.credit.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {account.previousDebit ? `$${account.previousDebit.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {account.previousCredit ? `$${account.previousCredit.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className={cn(
                        "text-right",
                        changePercent !== 'N/A' && (
                          parseFloat(changePercent) > 0 ? "text-green-600" : 
                          parseFloat(changePercent) < 0 ? "text-red-600" : ""
                        )
                      )}>
                        {changePercent !== 'N/A' ? `${changePercent}%` : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="adjusted">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead className="text-right">Adjusted Debit</TableHead>
                  <TableHead className="text-right">Adjusted Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trialBalance.accounts.map((account) => (
                  <TableRow key={account.code}>
                    <TableCell>{account.code}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell className="text-right">
                      {account.adjustedDebit ? `$${account.adjustedDebit.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {account.adjustedCredit ? `$${account.adjustedCredit.toLocaleString()}` : "-"}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-semibold">
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="text-right">
                    ${trialBalance.accounts
                      .reduce((sum, account) => sum + account.adjustedDebit, 0)
                      .toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    ${trialBalance.accounts
                      .reduce((sum, account) => sum + account.adjustedCredit, 0)
                      .toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <AdjustmentDialog
        open={showAdjustmentDialog}
        onOpenChange={setShowAdjustmentDialog}
        accounts={trialBalance.accounts}
        onSubmit={handleAddAdjustment}
      />

      <LedgerDialog
        open={showLedger}
        onOpenChange={setShowLedger}
        account={selectedAccount}
      />
    </div>
  );
}