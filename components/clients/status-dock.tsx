import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Status } from "@/types/status";
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

export function StatusDock({
  selectedCount,
  statuses,
  onMove,
  onClose,
}: {
  selectedCount: number;
  statuses: Status[];
  onMove: (statusId: string) => void;
  onClose: () => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleMove = (statusId: string) => {
    setSelectedStatus(statusId);
    setShowConfirmDialog(true);
  };

  const handleConfirmMove = () => {
    if (selectedStatus) {
      onMove(selectedStatus);
      setShowConfirmDialog(false);
      setSelectedStatus(null);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-background border rounded-lg shadow-lg p-4 flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {selectedCount} client{selectedCount !== 1 ? "s" : ""} selected
        </span>
        <Select onValueChange={handleMove}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Move to status..." />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.id} value={status.id}>
                {status.title}
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
            <AlertDialogTitle>Move Clients</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to move {selectedCount} client
              {selectedCount !== 1 ? "s" : ""} to{" "}
              {statuses.find((s) => s.id === selectedStatus)?.title}? This
              action can be undone by moving the clients again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedStatus(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmMove}>
              Move Clients
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
