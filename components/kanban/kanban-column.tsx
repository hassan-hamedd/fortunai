"use client";

import { useDroppable } from "@dnd-kit/core";
import { KanbanCard } from "./kanban-card";
import { Client } from "@/types/client";
import { Column } from "@/types/status";
import { Pen, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import DeleteStatusDialog from "./delete-status-dialog";

interface KanbanColumnProps {
  id: string;
  title: string;
  clients: Client[];
  handleEditStatusClick: (id: Column["id"], title: Column["title"]) => void;
  handleStatusDelete: (id: Column["id"]) => void;
}

export function KanbanColumn({
  id,
  title,
  clients,
  handleEditStatusClick,
  handleStatusDelete,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteStatus = async () => {
    await handleStatusDelete(id);
    setShowDeleteDialog(false);
  };

  return (
    <div ref={setNodeRef} className="bg-muted/50 rounded-lg p-4">
      <div className="w-full flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>

        {id !== "uncategorized" && (
          <div className="flex space-x-2">
            <Button
              className="bg-transparent hover:bg-muted/50 m-0"
              onClick={() => handleEditStatusClick(id, title)}
            >
              <Pen className="w-[15px] h-[15px] text-black dark:text-white" />
            </Button>
            <Button
              className="bg-transparent hover:bg-muted/50 m-0"
              onClick={() => setShowDeleteDialog(true)}
              disabled={clients.length > 0}
            >
              <Trash className="w-[15px] h-[15px] text-black dark:text-white" />
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-3">
        {clients.map((client) => (
          <KanbanCard key={client.id} client={client} />
        ))}
      </div>

      <DeleteStatusDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteStatus}
      />
    </div>
  );
}
