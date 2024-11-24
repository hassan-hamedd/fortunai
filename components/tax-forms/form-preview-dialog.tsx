"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export function FormPreviewDialog({ open, onOpenChange, formId, formData }) {
  if (!formId || !formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Form Preview</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh]">
          <div className="space-y-6 p-4">
            <div className="space-y-2">
              <Label>Taxable Income</Label>
              <Input
                value={formData.taxableIncome?.toLocaleString()}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label>Total Income</Label>
              <Input
                value={formData.income?.toLocaleString()}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label>Total Expenses</Label>
              <Input
                value={formData.expenses?.toLocaleString()}
                readOnly
              />
            </div>

            {/* Add more form fields based on the form type */}
          </div>
        </ScrollArea>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}