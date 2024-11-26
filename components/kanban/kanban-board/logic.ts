import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { fetchClients, createClient } from "@/lib/api";
import { Status, Column } from "@/types/status";
import { useToast } from "@/hooks/use-toast";

export const useKanbanBoardLogic = () => {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [columns, setColumns] = useState<Record<string, Column>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showNewStatusDialog, setShowNewStatusDialog] = useState(false);
  const [showEditStatusDialog, setShowEditStatusDialog] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClientsAndStatuses = async () => {
      setLoading(true);
      const clients: Client[] = await fetchClients();
      const statusesResponse = await fetch("/api/statuses");
      const statuses: Status[] = await statusesResponse.json();

      const updatedColumns: Record<string, Column> = {};
      statuses.forEach((status) => {
        updatedColumns[status.id] = {
          id: status.id,
          title: status.title,
          clients: [],
        };
      });

      const hasUncategorizedClients = clients.some(
        (client) => !statuses.some((status) => status.id === client.statusId)
      );

      if (hasUncategorizedClients) {
        updatedColumns["uncategorized"] = {
          id: "uncategorized",
          title: "Uncategorized",
          clients: [],
        };
      }

      clients.forEach((client) => {
        const clientStatus = statuses.find(
          (status) => status.id === client.statusId
        );
        const columnId = clientStatus ? clientStatus.id : "uncategorized";

        if (
          !updatedColumns[columnId].clients.some(
            (existingClient) => existingClient.id === client.id
          )
        ) {
          updatedColumns[columnId].clients.push(client);
        }
      });

      setColumns(updatedColumns);
      setMounted(true);
      setLoading(false);
    };
    loadClientsAndStatuses();
  }, []);

  const handleNewClient = async (newClient: Client) => {
    try {
      console.log("newClient: ", newClient);

      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) throw new Error("Failed to create client");

      toast({ title: "Success", description: "Client created successfully!" });

      const createdClient = await response.json();

      // Check if the status column exists
      const clientStatusExists = columns[newClient.statusId];

      // If the status column does not exist, add an uncategorized column
      if (!clientStatusExists) {
        setColumns((prev) => ({
          ...prev,
          ["uncategorized"]: {
            id: "uncategorized",
            title: "Uncategorized",
            clients: [createdClient],
          },
        }));
      }

      // Add the new client to the appropriate column
      const columnId = clientStatusExists
        ? newClient.statusId
        : "uncategorized";
      setColumns((prev) => ({
        ...prev,
        [columnId]: {
          ...prev[columnId],
          clients: [...prev[columnId].clients, createdClient],
        },
      }));

      setShowNewClientDialog(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error creating client: ",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (statusId: string, newStatus: string) => {
    await fetch(`/api/statuses/${statusId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newStatus }),
    });
    // Optionally refresh the statuses after update
  };

  const handleStatusDelete = async (statusId: string) => {
    const column = columns[statusId];
    if (column && column.clients.length === 0 && statusId !== "unknown") {
      try {
        await fetch(`/api/statuses/${statusId}`, {
          method: "DELETE",
        });
        toast({ title: "Success", description: "Status deleted successfully!" });
        setColumns((prev) => {
          const { [statusId]: _, ...rest } = prev; // Remove the deleted status
          return rest;
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete status.",
          variant: "destructive",
        });
      }
    }
  };

  const handleNewStatus = async (title: string) => {
    // Add the new status to the database
    const response = await fetch("/api/statuses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error("Failed to add new status");
    }

    const newStatus = await response.json();

    toast({ title: "Success", description: "New status added successfully!" });

    // Update the columns to include the new status
    setColumns((prev) => ({
      ...prev,
      [newStatus.id]: {
        id: newStatus.id,
        title: newStatus.title,
        clients: [], // Initialize with an empty array or any default clients
      },
    }));
  };

  const handleEditStatus = async (status: Status, newStatus: string) => {
    try {
      const response = await fetch(`/api/statuses/${status.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedStatus = await response.json();

      // Update the columns to reflect the new status title
      setColumns((prev) => ({
        ...prev,
        [status.id]: {
          ...prev[status.id],
          title: updatedStatus.title, // Update the title in the state
        },
      }));

      toast({ title: "Success", description: "Status updated successfully!" }); // Success toast
      setShowEditStatusDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status: " + (error as Error).message,
        variant: "destructive",
      }); // Error toast
    }
  };

  const handleEditStatusClick = (id: Column["id"], title: Column["title"]) => {
    const newCurrentStatus: Status = { id, title };

    setCurrentStatus(newCurrentStatus);
    setShowEditStatusDialog(true);
  };

  return {
    mounted,
    columns,
    activeId,
    showNewClientDialog,
    showNewStatusDialog,
    currentStatus,
    loading,
    setMounted,
    setColumns,
    setActiveId,
    setShowNewClientDialog,
    setShowNewStatusDialog,
    setCurrentStatus,
    handleNewClient,
    handleEditStatus,
    handleNewStatus,
    handleStatusDelete,
    handleEditStatusClick,
    showEditStatusDialog,
    setShowEditStatusDialog,
  };
};
