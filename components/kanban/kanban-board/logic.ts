import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { fetchClients, createClient } from "@/lib/api";
import { Status, Column } from "@/types/status";

export const useKanbanBoardLogic = () => {
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
      updatedColumns["unknown"] = {
        id: "unknown",
        title: "Unknown",
        clients: [],
      };

      clients.forEach((client) => {
        const clientStatus = statuses.find(
          (status) => status.id === client.statusId
        );
        const columnId = clientStatus ? clientStatus.id : "unknown";

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

  const handleNewClient = async (
    clientData: Omit<Client, "id" | "statusId">
  ) => {
    const newClient: Client = {
      id: Date.now().toString(),
      ...clientData,
      statusId: "new",
    };

    const createdClient = await createClient(newClient);
    setColumns((prev) => ({
      ...prev,
      new: {
        ...prev.new,
        clients: [...prev.new.clients, createdClient],
      },
    }));
    setShowNewClientDialog(false);
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
      await fetch(`/api/statuses/${statusId}`, {
        method: "DELETE",
      });
      // Optionally refresh the statuses after deletion
    }
  };

  const handleNewStatus = async (newStatus: string) => {
    await fetch("/api/statuses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newStatus }),
    });
    // Optionally refresh the statuses after creation
  };

  const handleEditStatus = async (status: Status, newStatus: string) => {
    await fetch(`/api/statuses/${status.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newStatus }),
    });
    // Optionally refresh the statuses after update
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
