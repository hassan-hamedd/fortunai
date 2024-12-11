import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { TaxCategory } from "./types";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function FloatingCategoryDock({
  selectedCount,
  categories,
  onMove,
  onClose,
}: {
  selectedCount: number;
  categories: TaxCategory[];
  onMove: (categoryId: string) => void;
  onClose: () => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleMove = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowConfirmDialog(true);
  };

  const handleConfirmMove = () => {
    if (selectedCategory) {
      onMove(selectedCategory);
      setShowConfirmDialog(false);
      setSelectedCategory(null);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-background border rounded-lg shadow-lg p-4 flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {selectedCount} account{selectedCount !== 1 ? "s" : ""} selected
        </span>
        <Select onValueChange={handleMove}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Move to category..." />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move Accounts</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to move {selectedCount} account
              {selectedCount !== 1 ? "s" : ""} to{" "}
              {categories.find((c) => c.id === selectedCategory)?.name}? This
              action can be undone by moving the accounts again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedCategory(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmMove}>
              Move Accounts
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
