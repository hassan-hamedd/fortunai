"use client";

import { PageHeader } from "@/components/page-header";
import { ClientsTable } from "@/components/clients/clients-table";

export default function ClientsPage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Client Management" 
        description="Manage and track your clients"
      />
      <ClientsTable />
    </div>
  );
}