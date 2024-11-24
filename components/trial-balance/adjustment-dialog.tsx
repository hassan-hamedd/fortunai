"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { format } from "date-fns";

export function AdjustmentDialog({ open, onOpenChange, accounts, onSubmit }) {
  const [adjustment, setAdjustment] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    accountCode: "",
    description: "",
    amount: "",
    type: "debit"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...adjustment,
      amount: parseFloat(adjustment.amount)
    });
    setAdjustment({
      date: format(new Date(), "yyyy-MM-dd"),
      accountCode: "",
      description: "",
      amount: "",
      type: "debit"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Adjustment Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={adjustment.date}
              onChange={(e) => setAdjustment(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="account">Account</Label>
            <Select
              value={adjustment.accountCode}
              onValueChange={(value) => setAdjustment(prev => ({ ...prev, accountCode: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.code} value={account.code}>
                    {account.code} - {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={adjustment.description}
              onChange={(e) => setAdjustment(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter adjustment description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={adjustment.amount}
              onChange={(e) => setAdjustment(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="Enter amount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={adjustment.type}
              onValueChange={(value) => setAdjustment(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debit">Debit</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Adjustment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}