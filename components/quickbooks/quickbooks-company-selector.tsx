"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuickBooksCompany } from "@/lib/quickbooks/types";

export function QuickBooksCompanySelector({
  clientId,
  onSelect,
  open,
  onOpenChange,
}: {
  clientId: string;
  onSelect: (companyId: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [companies, setCompanies] = useState<QuickBooksCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchCompanies();
    }
  }, [open]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/quickbooks/companies");
      const data = await response.json();
      setCompanies(data.companies);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select QuickBooks Company</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div>Loading companies...</div>
        ) : (
          <div className="grid gap-4">
            {companies.map((company) => (
              <Button
                key={company.companyId}
                variant="outline"
                onClick={() => onSelect(company.companyId)}
                className="justify-start"
              >
                {company.companyName}
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
