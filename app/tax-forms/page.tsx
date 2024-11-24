"use client";

import { PageHeader } from "@/components/page-header";
import { TaxFormsContent } from "@/components/tax-forms/tax-forms-content";

export default function TaxFormsPage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Tax Forms" 
        description="Manage and file tax forms for all clients"
      />
      <TaxFormsContent />
    </div>
  );
}