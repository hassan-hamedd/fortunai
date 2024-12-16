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
import { StatusGroup } from "./status-group";
import { StatusDock } from "./status-dock";
import { Skeleton } from "@/components/ui/skeleton";

export function ClientsTable() {
  const { toast } = useToast();
  const { handleNewClient } = useKanbanBoardLogic();

  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      const response = await fetch("/api/clients");
      const data = await response.json();
      setClients(data);
      setIsLoadingClients(false);
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const fetchStatuses = async () => {
      const response = await fetch("/api/statuses");
      const data = await response.json();
      setStatuses(data);
      setIsLoadingStatuses(false);
    };

    fetchStatuses();
  }, []);

  const filteredClients: Client[] = clients.filter((client) => {
    const { statusId, status, id, assignedTo, ...filteredClient } = client;

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

  const handleSelectClient = (clientId: string, isSelected: boolean) => {
    setSelectedClients((prev) =>
      isSelected ? [...prev, clientId] : prev.filter((id) => id !== clientId)
    );
  };

  const handleMoveClients = async (newStatusId: string) => {
    try {
      await Promise.all(
        selectedClients.map(async (clientId) => {
          const currentClient = clients.find((c) => c.id === clientId);
          if (!currentClient) return;

          const { assignedTo, company, email, name, phone, taxForm } =
            currentClient;

          const response = await fetch(`/api/clients/${clientId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              assignedTo,
              company,
              email,
              name,
              phone,
              taxForm,
              statusId: newStatusId,
              lastUpdated: new Date().toISOString().split("T")[0],
            }),
          });

          if (!response.ok) throw new Error("Failed to update client status");

          const updatedClient = await response.json();
          setClients((prev) =>
            prev.map((client) =>
              client.id === clientId ? updatedClient : client
            )
          );
        })
      );

      setSelectedClients([]);
      toast({
        title: "Success",
        description: "Clients moved successfully",
      });
    } catch (error) {
      console.error("Failed to move clients:", error);
      toast({
        title: "Error",
        description: "Failed to move clients",
        variant: "destructive",
      });
    }
  };

  if (isLoadingClients || isLoadingStatuses) {
    return (
      <div className="space-y-4 mt-6">
        <div className="flex justify-between items-center">
          <div className="w-72 mb-6">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-[120px]" />
        </div>

        <div className="rounded-md border">
          <div className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton key={index} className="h-4 w-[100px]" />
              ))}
            </div>
            <div className="flex flex-col items-center mb-4 w-full gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="space-y-3 w-full">
                  <Skeleton className="h-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            {statuses.map((status) => (
              <StatusGroup
                key={status.id}
                status={status}
                clients={filteredClients}
                onClientClick={handleEdit}
                selectedClients={selectedClients}
                onSelectClient={handleSelectClient}
                onClientDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedClients.length > 0 && (
        <StatusDock
          selectedCount={selectedClients.length}
          statuses={statuses}
          onMove={handleMoveClients}
          onClose={() => setSelectedClients([])}
        />
      )}

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
