"use client";

import { PageHeader } from "@/components/page-header";
import { ClientDashboard } from "@/components/client/client-dashboard";
import { CommentsSidebar } from "@/components/comments/comments-sidebar";
import { useParams } from "next/navigation";

export default function ClientPage() {
  const params = useParams();
  const clientId = params.id as string;

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 container mx-auto py-6 overflow-y-auto pr-2">
        <PageHeader
          title="Client Overview"
          description="Comprehensive view of client's financial data"
        />
        <ClientDashboard clientId={clientId} />
      </div>
      <CommentsSidebar clientId={clientId} />
    </div>
  );
}
