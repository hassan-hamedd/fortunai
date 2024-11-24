"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";

export function FinancialMetrics({ clientId }: { clientId: string }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Revenue YTD"
          value="$1,234,567"
          trend={12.5}
          icon={DollarSign}
        />
        <MetricCard
          title="Net Income"
          value="$234,567"
          trend={-5.2}
          icon={TrendingUp}
        />
        <MetricCard
          title="Total Assets"
          value="$2,345,678"
          trend={8.3}
          icon={PieChart}
        />
        <MetricCard
          title="Total Liabilities"
          value="$1,123,456"
          trend={3.1}
          icon={TrendingDown}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Income Trend</h3>
          <LineChart />
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Revenue vs Expenses</h3>
          <BarChart />
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon: Icon }) {
  const isPositive = trend > 0;
  
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className={`mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{trend}% from last period
      </div>
    </Card>
  );
}