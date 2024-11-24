"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChart } from "@/components/charts/line-chart";

const mockData = {
  revenue: {
    current: 500000,
    previous: 450000,
    items: [
      { name: "Sales Revenue", current: 450000, previous: 400000 },
      { name: "Service Revenue", current: 50000, previous: 50000 },
    ]
  },
  expenses: {
    current: 350000,
    previous: 300000,
    items: [
      { name: "Cost of Goods Sold", current: 200000, previous: 180000 },
      { name: "Operating Expenses", current: 100000, previous: 80000 },
      { name: "Administrative Expenses", current: 50000, previous: 40000 },
    ]
  }
};

export function ProfitLossStatement({ dateRange }) {
  const netIncome = {
    current: mockData.revenue.current - mockData.expenses.current,
    previous: mockData.revenue.previous - mockData.expenses.previous,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Current Period</TableHead>
                <TableHead className="text-right">Previous Period</TableHead>
                <TableHead className="text-right">Change %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="font-medium">
                <TableCell colSpan={4}>Revenue</TableCell>
              </TableRow>
              {mockData.revenue.items.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="pl-6">{item.name}</TableCell>
                  <TableCell className="text-right">
                    ${item.current.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    ${item.previous.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {((item.current - item.previous) / item.previous * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-medium">
                <TableCell>Total Revenue</TableCell>
                <TableCell className="text-right">
                  ${mockData.revenue.current.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  ${mockData.revenue.previous.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {((mockData.revenue.current - mockData.revenue.previous) / mockData.revenue.previous * 100).toFixed(1)}%
                </TableCell>
              </TableRow>

              <TableRow className="font-medium">
                <TableCell colSpan={4}>Expenses</TableCell>
              </TableRow>
              {mockData.expenses.items.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="pl-6">{item.name}</TableCell>
                  <TableCell className="text-right">
                    ${item.current.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    ${item.previous.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {((item.current - item.previous) / item.previous * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-medium">
                <TableCell>Total Expenses</TableCell>
                <TableCell className="text-right">
                  ${mockData.expenses.current.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  ${mockData.expenses.previous.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {((mockData.expenses.current - mockData.expenses.previous) / mockData.expenses.previous * 100).toFixed(1)}%
                </TableCell>
              </TableRow>

              <TableRow className="font-medium text-lg">
                <TableCell>Net Income</TableCell>
                <TableCell className="text-right">
                  ${netIncome.current.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  ${netIncome.previous.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {((netIncome.current - netIncome.previous) / netIncome.previous * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Trend Analysis</h3>
          <LineChart />
        </div>
      </div>
    </div>
  );
}