"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockData = {
  assets: {
    current: [
      { name: "Cash", amount: 150000 },
      { name: "Accounts Receivable", amount: 75000 },
      { name: "Inventory", amount: 125000 },
    ],
    nonCurrent: [
      { name: "Property & Equipment", amount: 500000 },
      { name: "Intangible Assets", amount: 100000 },
    ],
  },
  liabilities: {
    current: [
      { name: "Accounts Payable", amount: 50000 },
      { name: "Short-term Loans", amount: 75000 },
    ],
    nonCurrent: [
      { name: "Long-term Debt", amount: 200000 },
    ],
  },
  equity: [
    { name: "Common Stock", amount: 400000 },
    { name: "Retained Earnings", amount: 225000 },
  ],
};

export function BalanceSheet({ dateRange }) {
  const totalCurrentAssets = mockData.assets.current.reduce((sum, item) => sum + item.amount, 0);
  const totalNonCurrentAssets = mockData.assets.nonCurrent.reduce((sum, item) => sum + item.amount, 0);
  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  const totalCurrentLiabilities = mockData.liabilities.current.reduce((sum, item) => sum + item.amount, 0);
  const totalNonCurrentLiabilities = mockData.liabilities.nonCurrent.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;

  const totalEquity = mockData.equity.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="font-medium">
            <TableCell colSpan={2}>Assets</TableCell>
          </TableRow>
          <TableRow className="font-medium">
            <TableCell className="pl-4">Current Assets</TableCell>
            <TableCell></TableCell>
          </TableRow>
          {mockData.assets.current.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="pl-8">{item.name}</TableCell>
              <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="pl-4 font-medium">Total Current Assets</TableCell>
            <TableCell className="text-right font-medium">${totalCurrentAssets.toLocaleString()}</TableCell>
          </TableRow>

          <TableRow className="font-medium">
            <TableCell className="pl-4">Non-Current Assets</TableCell>
            <TableCell></TableCell>
          </TableRow>
          {mockData.assets.nonCurrent.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="pl-8">{item.name}</TableCell>
              <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="pl-4 font-medium">Total Non-Current Assets</TableCell>
            <TableCell className="text-right font-medium">${totalNonCurrentAssets.toLocaleString()}</TableCell>
          </TableRow>

          <TableRow className="font-medium text-lg">
            <TableCell>Total Assets</TableCell>
            <TableCell className="text-right">${totalAssets.toLocaleString()}</TableCell>
          </TableRow>

          <TableRow className="font-medium">
            <TableCell colSpan={2}>Liabilities</TableCell>
          </TableRow>
          <TableRow className="font-medium">
            <TableCell className="pl-4">Current Liabilities</TableCell>
            <TableCell></TableCell>
          </TableRow>
          {mockData.liabilities.current.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="pl-8">{item.name}</TableCell>
              <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="pl-4 font-medium">Total Current Liabilities</TableCell>
            <TableCell className="text-right font-medium">${totalCurrentLiabilities.toLocaleString()}</TableCell>
          </TableRow>

          <TableRow className="font-medium">
            <TableCell className="pl-4">Non-Current Liabilities</TableCell>
            <TableCell></TableCell>
          </TableRow>
          {mockData.liabilities.nonCurrent.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="pl-8">{item.name}</TableCell>
              <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="pl-4 font-medium">Total Non-Current Liabilities</TableCell>
            <TableCell className="text-right font-medium">${totalNonCurrentLiabilities.toLocaleString()}</TableCell>
          </TableRow>

          <TableRow className="font-medium text-lg">
            <TableCell>Total Liabilities</TableCell>
            <TableCell className="text-right">${totalLiabilities.toLocaleString()}</TableCell>
          </TableRow>

          <TableRow className="font-medium">
            <TableCell colSpan={2}>Equity</TableCell>
          </TableRow>
          {mockData.equity.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="pl-8">{item.name}</TableCell>
              <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          <TableRow className="font-medium text-lg">
            <TableCell>Total Equity</TableCell>
            <TableCell className="text-right">${totalEquity.toLocaleString()}</TableCell>
          </TableRow>

          <TableRow className="font-medium text-lg">
            <TableCell>Total Liabilities and Equity</TableCell>
            <TableCell className="text-right">${(totalLiabilities + totalEquity).toLocaleString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}