"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Update form schema
const formSchema = z.object({
  code: z.string().min(1, "Account code is required"),
  name: z.string().min(2, "Account name must be at least 2 characters"),
  taxCategoryId: z.string().min(1, "Tax category is required"),
  debit: z.number().default(0),
  credit: z.number().default(0),
  adjustedDebit: z.number().default(0),
  adjustedCredit: z.number().default(0),
});

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      taxCategoryId: category.id,
      debit: 0,
      credit: 0,
      adjustedDebit: 0,
      adjustedCredit: 0,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await onSubmit(values as Omit<Account, "id" | "trialBalanceId">);
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      form.reset();
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="debit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Debit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter debit amount"
                        {...field}
                        disabled={form.watch("credit") > 0}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          field.onChange(value);
                          if (value > 0) {
                            form.setValue("credit", 0);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="credit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter credit amount"
                        {...field}
                        disabled={form.watch("debit") > 0}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          field.onChange(value);
                          if (value > 0) {
                            form.setValue("debit", 0);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Account"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
