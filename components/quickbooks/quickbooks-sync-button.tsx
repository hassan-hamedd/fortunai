"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function QuickBooksSyncButton({ clientId }: { clientId: string }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(`/api/quickbooks/sync/${clientId}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to sync with QuickBooks");
      }

      const data = await response.json();

      toast({
        title: "Success",
        description: "Successfully synced with QuickBooks",
      });

      // Optionally refresh the page or update the UI
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync with QuickBooks",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button onClick={handleSync} disabled={isSyncing}>
      <RefreshCw
        className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
      />
      Sync QuickBooks
    </Button>
  );
}
