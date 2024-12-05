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

export interface TaxCategory {
  id?: string;
  name: string;
  clientId: string;
  accounts?: Array<{
    id: string;
    name: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NewCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (category: TaxCategory) => Promise<void>;
  clientId: string;
}

export function NewCategoryDialog({
  open,
  onOpenChange,
  onSubmit,
  clientId,
}: NewCategoryDialogProps) {
  const [category, setCategory] = useState<TaxCategory>({
    name: "",
    clientId: clientId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(category);
      setCategory({ name: "", clientId: clientId });
    } catch (error) {
      console.error("Failed to submit category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={category.name}
              onChange={(e) =>
                setCategory((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter category name"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!category.name || isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
