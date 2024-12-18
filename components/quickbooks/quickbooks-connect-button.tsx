"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Check, RefreshCw } from "lucide-react";

interface QuickBooksConnectButtonProps {
  clientId: string;
}

export function QuickBooksConnectButton({
  clientId,
}: QuickBooksConnectButtonProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`/api/quickbooks/status/${clientId}`);
        const data = await response.json();
        setIsConnected(data.isConnected);
      } catch (error) {
        console.error("Failed to check QuickBooks connection:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, [clientId]);

  const handleConnect = async () => {
    window.location.href = `/api/quickbooks/connect?clientId=${clientId}`;
  };

  if (isLoading) {
    return (
      <Button variant="outline" disabled>
        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        Checking Connection...
      </Button>
    );
  }

  if (isConnected) {
    return (
      <Button variant="outline" disabled className="bg-green-50">
        <Check className="mr-2 h-4 w-4 text-green-500" />
        Connected to QuickBooks
      </Button>
    );
  }

  return (
    <Button onClick={handleConnect} variant="outline">
      Connect QuickBooks
    </Button>
  );
}
