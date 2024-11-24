"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "../ui/card";
import { Building2, FileText, GripVertical } from "lucide-react";
import Link from "next/link";
import { Client } from "@/types/client";

export function KanbanCard({ client }: { client: Client }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: client.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <Link href={`/clients/${client.id}`} className="block flex-1">
            <div className="space-y-2">
              <div className="font-medium">{client.name}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Building2 className="h-4 w-4 mr-1" />
                {client.company}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <FileText className="h-4 w-4 mr-1" />
                Form {client.taxForm}
              </div>
            </div>
          </Link>
          {/* Drag handle */}
          <div {...listeners} className="cursor-grab text-muted-foreground">
            <GripVertical className="h-4 w-4" />
          </div>
        </div>
      </Card>
    </div>
  );
}
