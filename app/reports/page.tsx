"use client";

import { PageHeader } from "@/components/page-header";
import { ReportsContent } from "@/components/reports/reports-content";

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Financial Reports" 
        description="Generate and analyze comprehensive financial reports"
      />
      <ReportsContent />
    </div>
  );
}