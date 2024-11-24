"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Download, RefreshCw } from "lucide-react";

const mockClient = {
  name: "Acme Corporation",
  taxForm: "1120S",
  status: "In Progress",
  lastSync: "2024-02-20T10:00:00Z"
};

export function ClientHeader({ clientId }: { clientId: string }) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{mockClient.name}</h2>
          <div className="flex items-center gap-4 mt-2 text-muted-foreground">
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              Form {mockClient.taxForm}
            </div>
            <div>Status: {mockClient.status}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync QuickBooks
          </Button>
        </div>
      </div>
    </Card>
  );
}