import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Client } from "@/types/client";
import { Status } from "@/types/status";
import { ClientRow } from "./client-row";

export function StatusGroup({
  status,
  clients,
  onClientClick,
  selectedClients,
  onSelectClient,
  onClientDelete,
}: {
  status: Status;
  clients: Client[];
  onClientClick: (client: Client) => void;
  selectedClients: string[];
  onSelectClient: (clientId: string, isSelected: boolean) => void;
  onClientDelete: (clientId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const groupClients = clients.filter(
    (client) => client.status.id === status.id
  );

  return (
    <>
      <TableRow className="bg-muted/50 hover:bg-muted">
        <TableCell colSpan={7} className="font-medium">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-2" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2" />
            )}
            {status.title}
          </div>
        </TableCell>
      </TableRow>

      {isExpanded &&
        groupClients.map((client) => (
          <ClientRow
            key={client.id}
            client={client}
            onClick={() => onClientClick(client)}
            isSelected={selectedClients.includes(client.id)}
            onSelectChange={onSelectClient}
            onDelete={() => onClientDelete(client.id)}
          />
        ))}
    </>
  );
}
