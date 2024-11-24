"use client";

import { PageHeader } from "@/components/page-header";
import { ClientDashboard } from "@/components/client/client-dashboard";
import { useParams } from "next/navigation";

export default function ClientPage() {
  const params = useParams();
  const clientId = params.id as string;

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Client Overview" 
        description="Comprehensive view of client's financial data"
      />
      <ClientDashboard clientId={clientId} />
    </div>
  );
}