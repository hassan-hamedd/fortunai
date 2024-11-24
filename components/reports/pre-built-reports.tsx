"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart3, FileText, Download, Share2, Calendar } from "lucide-react";
import { DatePickerWithRange } from "@/components/reports/date-range-picker";
import { useState } from "react";
import { ProfitLossStatement } from "./statements/profit-loss";
import { BalanceSheet } from "./statements/balance-sheet";
import { CashFlowStatement } from "./statements/cash-flow";

const reports = [
  {
    id: "pl",
    name: "Profit & Loss",
    description: "Income, expenses, and net profit analysis",
    icon: LineChart,
    component: ProfitLossStatement,
  },
  {
    id: "bs",
    name: "Balance Sheet",
    description: "Assets, liabilities, and equity overview",
    icon: BarChart3,
    component: BalanceSheet,
  },
  {
    id: "cf",
    name: "Cash Flow",
    description: "Operating, investing, and financing activities",
    icon: FileText,
    component: CashFlowStatement,
  },
];

export function PreBuiltReports() {
  const [selectedReport, setSelectedReport] = useState(reports[0]);
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });

  const ReportComponent = selectedReport.component;

  const handleExport = () => {
    const reportData = {
      type: selectedReport.name,
      dateRange,
      generatedAt: new Date().toISOString(),
      // Add report-specific data here
    };

    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedReport.id}-report.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          {reports.map((report) => (
            <Button
              key={report.id}
              variant={selectedReport.id === report.id ? "default" : "outline"}
              onClick={() => setSelectedReport(report)}
              className="h-auto py-4 px-6"
            >
              <report.icon className="w-4 h-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">{report.name}</div>
                <div className="text-xs text-muted-foreground">
                  {report.description}
                </div>
              </div>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Button variant="outline" size="icon" onClick={handleExport}>
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Calendar className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="p-6 overflow-auto max-h-[calc(100vh-20rem)]">
        <ReportComponent dateRange={dateRange} />
      </Card>
    </div>
  );
}