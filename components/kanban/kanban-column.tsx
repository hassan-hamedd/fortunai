"use client";

import { useDroppable } from "@dnd-kit/core";
import { KanbanCard } from "./kanban-card";
import { Client } from "@/types/client";
import { Column } from "@/types/status";
import { Pen } from "lucide-react";
import { Button } from "../ui/button";

interface KanbanColumnProps {
  id: string;
  title: string;
  clients: Client[];
  handleEditStatusClick: (id: Column["id"], title: Column["title"]) => void;
}

export function KanbanColumn({
  id,
  title,
  clients,
  handleEditStatusClick,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div ref={setNodeRef} className="bg-muted/50 rounded-lg p-4">
      <div className="w-full flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>

        <Button
          className="bg-transparent hover:bg-muted/50 m-0"
          onClick={() => handleEditStatusClick(id, title)}
        >
          <Pen className="w-[15px] h-[15px] text-white" />
        </Button>
      </div>
      <div className="space-y-3">
        {clients.map((client) => (
          <KanbanCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
}
