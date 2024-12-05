"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TAX_CATEGORIES } from "@/lib/constants/tax-categories";
import { Account, TaxCategory } from "./types";
import { useToast } from "@/hooks/use-toast";

export function NewAccountDialog({
  open,
  onOpenChange,
  onSubmit,
  category,
  categories,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (account: Omit<Account, "id" | "trialBalanceId">) => Promise<void>;
  category: TaxCategory;
  categories: TaxCategory[];
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState({
    code: "",
    name: "",
    taxCategoryId: category.id,
    debit: 0,
    credit: 0,
    adjustedDebit: 0,
    adjustedCredit: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(account);
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      setAccount({
        code: "",
        name: "",
        taxCategoryId: "",
        debit: 0,
        credit: 0,
        adjustedDebit: 0,
        adjustedCredit: 0,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Account to {category.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Account Code</Label>
            <Input
              value={account.code}
              onChange={(e) =>
                setAccount((prev) => ({ ...prev, code: e.target.value }))
              }
              placeholder="Enter account code"
            />
          </div>

          <div>
            <Label>Account Name</Label>
            <Input
              value={account.name}
              onChange={(e) =>
                setAccount((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter account name"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !account.code ||
                !account.name ||
                !account.taxCategoryId
              }
            >
              {isLoading ? "Adding..." : "Add Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
