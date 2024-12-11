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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

export function AdjustmentDialog({ open, onOpenChange, accounts, onSubmit }) {
  const [journalEntry, setJournalEntry] = useState({
    name: "",
    date: format(new Date(), "yyyy-MM-dd"),
    memo: "",
    entries: [
      {
        date: format(new Date(), "yyyy-MM-dd"),
        accountId: "",
        accountCode: "",
        description: "",
        amount: "",
        type: "debit",
      },
      {
        date: format(new Date(), "yyyy-MM-dd"),
        accountId: "",
        accountCode: "",
        description: "",
        amount: "",
        type: "credit",
      },
    ],
  });

  const handleEntryChange = (index, field, value) => {
    setJournalEntry((prev) => ({
      ...prev,
      entries: prev.entries.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  const handleAddEntry = () => {
    setJournalEntry((prev) => ({
      ...prev,
      entries: [
        ...prev.entries,
        {
          date: format(new Date(), "yyyy-MM-dd"),
          accountId: "",
          accountCode: "",
          description: "",
          amount: "",
          type: "debit",
        },
      ],
    }));
  };

  const handleDeleteEntry = (index) => {
    setJournalEntry((prev) => ({
      ...prev,
      entries: prev.entries.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");

    // Validate debits equal credits
    const totalDebits = journalEntry.entries
      .filter((entry) => entry.type === "debit")
      .reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);

    const totalCredits = journalEntry.entries
      .filter((entry) => entry.type === "credit")
      .reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      alert("Debits must equal credits");
      return;
    }

    // Submit journal entry
    onSubmit({
      name: journalEntry.name,
      date: journalEntry.date,
      memo: journalEntry.memo,
      entries: journalEntry.entries.map((entry) => ({
        ...entry,
        amount: parseFloat(entry.amount),
      })),
    });

    // Reset form
    setJournalEntry({
      name: "",
      date: format(new Date(), "yyyy-MM-dd"),
      memo: "",
      entries: [
        {
          date: format(new Date(), "yyyy-MM-dd"),
          accountId: "",
          accountCode: "",
          description: "",
          amount: "",
          type: "debit",
        },
        {
          date: format(new Date(), "yyyy-MM-dd"),
          accountId: "",
          accountCode: "",
          description: "",
          amount: "",
          type: "credit",
        },
      ],
    });
  };

  const handleCloseDialog = () => {
    onOpenChange(false); // Close the dialog without submitting the form
  };

  const getValidAccounts = (type) => {
    return accounts.filter((account) => {
      console.log("account:", account);
      // If account has debit balance (positive), it's a debit-normal account
      // If account has credit balance (negative), it's a credit-normal account
      const isDebitAccount = account.debit > 0;
      const isCreditAccount = account.credit > 0;

      // For new accounts (balance = 0), allow either debit or credit
      if (account.credit === 0 && account.debit === 0) {
        return true;
      }

      console.log("isDebitAccount:", isDebitAccount);
      console.log("isCreditAccount:", isCreditAccount);

      return type === "debit" ? isDebitAccount : isCreditAccount;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Journal Entry</DialogTitle>
        </DialogHeader>
        {accounts.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              No tax accounts available. Please add tax accounts before creating
              adjustments.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Journal Entry Name</Label>
                <Input
                  value={journalEntry.name}
                  onChange={(e) =>
                    setJournalEntry((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter a name for this entry"
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={journalEntry.date}
                  onChange={(e) =>
                    setJournalEntry((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <Label>Memo</Label>
              <Textarea
                value={journalEntry.memo}
                onChange={(e) =>
                  setJournalEntry((prev) => ({ ...prev, memo: e.target.value }))
                }
                placeholder="Enter additional notes or description"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              {journalEntry.entries.map((entry, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 items-end">
                  <div>
                    <Label>Account</Label>
                    <Select
                      value={entry.accountCode}
                      onValueChange={(value) => {
                        const account = accounts.find(
                          (acc) => acc.code === value
                        );
                        handleEntryChange(index, "accountCode", value);
                        handleEntryChange(index, "accountId", account.id);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {getValidAccounts(entry.type).map((account) => (
                          <SelectItem
                            key={account.code}
                            value={account.code || "a"}
                          >
                            {account.code} - {account.name}
                            {account.balance === 0 && " (New Account)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Input
                      value={entry.description}
                      onChange={(e) =>
                        handleEntryChange(index, "description", e.target.value)
                      }
                      placeholder="Description"
                    />
                  </div>

                  <div>
                    <Label>Type</Label>
                    <Select
                      value={entry.type}
                      onValueChange={(value) =>
                        handleEntryChange(index, "type", value)
                      }
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

                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={entry.amount}
                      onChange={(e) =>
                        handleEntryChange(index, "amount", e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </div>

                  <div className="col-span-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEntry(index)}
                      disabled={journalEntry.entries.length <= 2}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleAddEntry}>
                Add Line
              </Button>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Journal Entry</Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
