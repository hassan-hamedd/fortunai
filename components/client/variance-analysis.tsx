"use client";

import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockVariances = [
  {
    account: "Revenue",
    currentPeriod: 150000,
    previousPeriod: 120000,
    variance: 25,
    significant: true,
  },
  {
    account: "Cost of Goods Sold",
    currentPeriod: 90000,
    previousPeriod: 70000,
    variance: 28.57,
    significant: true,
  },
  {
    account: "Operating Expenses",
    currentPeriod: 30000,
    previousPeriod: 28000,
    variance: 7.14,
    significant: false,
  },
];

export function VarianceAnalysis({ clientId }: { clientId: string }) {
  const significantVariances = mockVariances.filter(v => v.significant);

  return (
    <div className="space-y-6">
      {significantVariances.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Significant Variances Detected</AlertTitle>
          <AlertDescription>
            {significantVariances.length} accounts show significant variations from the previous period.
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Period-over-Period Variance Analysis</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Current Period</TableHead>
              <TableHead className="text-right">Previous Period</TableHead>
              <TableHead className="text-right">Variance %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockVariances.map((item) => (
              <TableRow key={item.account}>
                <TableCell>{item.account}</TableCell>
                <TableCell className="text-right">
                  ${item.currentPeriod.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  ${item.previousPeriod.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {item.variance > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    {item.variance}%
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}