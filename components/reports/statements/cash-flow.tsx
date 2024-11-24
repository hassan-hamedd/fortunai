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
  operating: {
    inflows: [
      { name: "Net Income", amount: 150000 },
      { name: "Depreciation", amount: 25000 },
      { name: "Decrease in Accounts Receivable", amount: 15000 },
    ],
    outflows: [
      { name: "Increase in Inventory", amount: -30000 },
      { name: "Decrease in Accounts Payable", amount: -20000 },
    ],
  },
  investing: {
    inflows: [
      { name: "Sale of Equipment", amount: 50000 },
    ],
    outflows: [
      { name: "Purchase of Equipment", amount: -100000 },
    ],
  },
  financing: {
    inflows: [
      { name: "Proceeds from Long-term Debt", amount: 200000 },
    ],
    outflows: [
      { name: "Dividend Payments", amount: -50000 },
      { name: "Repayment of Short-term Debt", amount: -75000 },
    ],
  },
};

export function CashFlowStatement({ dateRange }) {
  const calculateTotal = (items) => items.reduce((sum, item) => sum + item.amount, 0);

  const operatingTotal = calculateTotal([...mockData.operating.inflows, ...mockData.operating.outflows]);
  const investingTotal = calculateTotal([...mockData.investing.inflows, ...mockData.investing.outflows]);
  const financingTotal = calculateTotal([...mockData.financing.inflows, ...mockData.financing.outflows]);
  const netCashFlow = operatingTotal + investingTotal + financingTotal;

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Activity</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="font-medium">
            <TableCell colSpan={2}>Operating Activities</TableCell>
          </TableRow>
          {mockData.operating.inflows.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="pl-8">{item.name}</TableCell>
              <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          {mockData.operating.outflows.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="pl-8">{item.name}</TableCell>
              <TableCell className="text-right text-red-500">
                ${Math.abs(item.amount).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="font-medium">
            <TableCell className="pl-4">Net Cash from Operating Activities</TableCell>
            <TableCell className="text-right">${operatingTotal.toLocaleString()}</TableCell>
          </TableRow>

          <TableRow className="font-medium">
            <TableCell colSpan={2}>Investing Activities</TableCell>
          </TableRow>
          {mockData.investing.inflows.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="pl-8">{item.name}</TableCell>
              <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          {mockData.investing.outflows.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="pl-8">{item.name}</TableCell>
              <TableCell className="text-right text-red-500">
                ${Math.abs(item.amount).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="font-medium">
            <TableCell className="pl-4">Net Cash from Investing Activities</TableCell>
            <TableCell className="text-right">${investingTotal.toLocaleString()}</TableCell>
          </TableRow>

          <TableRow className="font-medium">
            <TableCell colSpan={2}>Financing Activities</TableCell>
          </TableRow>
          {mockData.financing.inflows.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="pl-8">{item.name}</TableCell>
              <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          {mockData.financing.outflows.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="pl-8">{item.name}</TableCell>
              <TableCell className="text-right text-red-500">
                ${Math.abs(item.amount).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="font-medium">
            <TableCell className="pl-4">Net Cash from Financing Activities</TableCell>
            <TableCell className="text-right">${financingTotal.toLocaleString()}</TableCell>
          </TableRow>

          <TableRow className="font-medium text-lg">
            <TableCell>Net Change in Cash</TableCell>
            <TableCell className="text-right">${netCashFlow.toLocaleString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}