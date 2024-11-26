"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { EditClientDialog } from "./edit-client-dialog";
import {
  MoreHorizontal,
  Plus,
  Search,
  FileText,
  Building2,
  Mail,
  Phone,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Client } from "@/types/client";
import { useToast } from "@/hooks/use-toast";
import { Status } from "@/types/status";
import { NewClientDialog } from "../kanban/new-client-dialog";
import { useKanbanBoardLogic } from "../kanban/kanban-board/logic";
import dayjs from "@/lib/dayjs";

export function ClientsTable() {
  const { toast } = useToast();
  const { handleNewClient } = useKanbanBoardLogic();

  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      const response = await fetch("/api/clients");
      const data = await response.json();
      setClients(data);
    };

    fetchClients();
  }, []);

  const filteredClients: Client[] = clients.filter((client) => {
    const { statusId, status, id, assignedTo, ...filteredClient } = client;
    console.log("Object.values(client): ", Object.values(filteredClient));

    return Object.values(filteredClient).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleEdit = (client: Client) => {
    setEditingClient(client);
  };

  const handleDelete = async (clientId: Client["id"]) => {
    setClients(clients.filter((client) => client.id !== clientId));

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete client");
      }

      toast({ title: "Success", description: "Client deleted successfully!" });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error deleting client: " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleSave = (updatedClient: Client) => {
    if (editingClient) {
      setClients(
        clients.map((client) =>
          client.id === updatedClient.id ? updatedClient : client
        )
      );
    }
    setEditingClient(null);
  };

  const getStatusBadge = (status: Status["title"]) => {
    console.log("status: ", status);
    return <Badge variant="default">{status}</Badge>;
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center">
        <div className="relative w-72 mb-6">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => setShowNewClientDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Tax Form</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
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
                <TableCell>
                  <div className="flex items-center">
                    <FileText className="mr-1 h-4 w-4" />
                    Form {client.taxForm}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(client.status.title)}</TableCell>
                <TableCell>{client.assignedTo}</TableCell>
                <TableCell>
                  {dayjs(client.createdAt, "YYYY-MM-DD").format("MMMM D, YYYY")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(client)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(client.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingClient && (
        <EditClientDialog
          client={editingClient}
          open={!!editingClient}
          onOpenChange={(open) => !open && setEditingClient(null)}
          onSave={handleSave}
        />
      )}

      <NewClientDialog
        open={showNewClientDialog}
        onOpenChange={setShowNewClientDialog}
        onSubmit={handleNewClient}
      />
    </div>
  );
}
