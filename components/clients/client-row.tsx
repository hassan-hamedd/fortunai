import { TableCell, TableRow } from "@/components/ui/table";
import { Client } from "@/types/client";
import {
  Building2,
  Mail,
  Phone,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import dayjs from "@/lib/dayjs";

export function ClientRow({
  client,
  onClick,
  isSelected,
  onSelectChange,
  onDelete,
}: {
  client: Client;
  onClick: () => void;
  isSelected: boolean;
  onSelectChange: (clientId: string, isSelected: boolean) => void;
  onDelete: () => void;
}) {
  return (
    <TableRow
      className={cn("hover:bg-muted/50", isSelected && "bg-primary/10")}
    >
      <TableCell>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelectChange(client.id, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            className="mr-2"
          />
          <div className="flex flex-col">
            <Link
              href={`/clients/${client.id}`}
              className="font-medium hover:underline"
            >
              {client.name}
            </Link>
            <div className="flex items-center text-sm text-muted-foreground">
              <Building2 className="mr-1 h-4 w-4" />
              {client.company}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-sm">
            <Mail className="mr-1 h-4 w-4" />
            {client.email}
          </div>
          <div className="flex items-center text-sm">
            <Phone className="mr-1 h-4 w-4" />
            {client.phone}
          </div>
        </div>
      </TableCell>
      <TableCell>Form {client.taxForm}</TableCell>
      <TableCell>
        <Badge variant="default">{client.status.title}</Badge>
      </TableCell>
      <TableCell>{client.assignedTo}</TableCell>
      <TableCell>{dayjs(client.createdAt).format("MMMM D, YYYY")}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onClick}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
