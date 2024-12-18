"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Client } from "@/types/client";
import { FileText, Download, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export function ClientHeader({ clientId }: { clientId: string }) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClient() {
      try {
        const response = await fetch(`/api/clients/${clientId}`);
        const data = await response.json();
        setClient(data);
      } catch (error) {
        console.error("Failed to fetch client:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchClient();
  }, [clientId]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <Skeleton className="h-8 w-[200px]" />
            <div className="flex items-center gap-10">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[140px]" />
          </div>
        </div>
      </Card>
    );
  }

  if (!client) {
    return (
      <Card className="p-6">
        <div>Client not found</div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{client.name}</h2>
          <div className="flex items-center gap-10 mt-2 text-muted-foreground">
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              Form {client.taxForm}
            </div>
            <div>Status: {client.status.title}</div>
            <div>Assignee: {client.assignedTo}</div>
            {client.reviewer && <div>Reviewer: {client.reviewer}</div>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </Card>
  );
}
