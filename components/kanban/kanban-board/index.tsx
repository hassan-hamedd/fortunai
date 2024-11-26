"use client";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "../kanban-column";
import { KanbanCard } from "../kanban-card";
import { Button } from "../../ui/button";
import { MoreVertical, PlusCircle } from "lucide-react";
import { NewClientDialog } from "../new-client-dialog";
import { useKanbanBoardLogic } from "./logic";
import NewStatusDialog from "../new-status-dialog";
import { Skeleton } from "../../ui/skeleton";
import EditStatusDialog from "../edit-status-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const KanbanBoard = () => {
  const {
    mounted,
    columns,
    activeId,
    showNewClientDialog,
    showNewStatusDialog,
    currentStatus,
    loading,
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
  } = useKanbanBoardLogic();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!mounted || loading) {
    return (
      <div className="mt-6">
        <div className="mb-6">
          <Skeleton className="h-[45px] w-[160px]" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="bg-muted/50 rounded-lg p-4 h-[400px]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="w-full mb-6 flex items-center justify-between">
        <Button onClick={() => setShowNewClientDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Client
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowNewStatusDialog(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Create New Status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(event) => setActiveId(String(event.active.id))}
        onDragEnd={async (event) => {
          const { active, over } = event;
          if (!over) {
            setActiveId(null);
            return;
          }

          const activeClient = Object.values(columns)
            .flatMap((col) => col.clients)
            .find((client) => client.id === active.id);

          const sourceColumn = Object.values(columns).find((col) =>
            col.clients.some((client) => client.id === active.id)
          );

          const overColumnId = columns[over.id]
            ? over.id
            : Object.values(columns).find((col) =>
                col.clients.some((client) => client.id === over.id)
              )?.id;

          if (sourceColumn?.id === overColumnId) return;

          if (sourceColumn && overColumnId && activeClient) {
            setColumns((prev) => ({
              ...prev,
              [sourceColumn.id]: {
                ...sourceColumn,
                clients: sourceColumn.clients.filter(
                  (client) => client.id !== active.id
                ),
              },
              [overColumnId]: {
                ...prev[overColumnId],
                clients: [
                  ...prev[overColumnId].clients,
                  { ...activeClient, statusId: String(overColumnId) },
                ],
              },
            }));

            await fetch(`/api/clients/${activeClient.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ statusId: String(overColumnId) }),
            });
          }

          setActiveId(null);
        }}
      >
        <div className="grid grid-cols-4 gap-4">
          {Object.values(columns).map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              clients={column.clients}
              handleEditStatusClick={handleEditStatusClick}
              handleStatusDelete={handleStatusDelete}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <KanbanCard
              client={
                Object.values(columns)
                  .flatMap((col) => col.clients)
                  .find((client) => client.id === activeId) || {
                  id: "",
                  name: "",
                  company: "",
                  taxForm: "",
                  statusId: "",
                  email: "",
                  phone: "",
                  status: {
                    id: "",
                    title: "",
                  },
                  assignedTo: "",
                  lastUpdated: "",
                  createdAt: "",
                }
              }
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <NewClientDialog
        open={showNewClientDialog}
        onOpenChange={setShowNewClientDialog}
        onSubmit={handleNewClient}
      />

      {/* {Object.values(columns).map((column) => (
        <div key={column.id}>
          <h3>{column.title}</h3>
          <Button
            onClick={() => {
              setCurrentStatus(column.id);
              setShowNewStatusDialog(true);
            }}
          >
            Edit Status
          </Button>
          <Button onClick={() => handleStatusDelete(column.id)}>
            Delete Status
          </Button>
        </div>
      ))} */}

      <NewStatusDialog
        open={showNewStatusDialog}
        onOpenChange={setShowNewStatusDialog}
        onSubmit={(status) => {
          handleNewStatus(status.title);
        }}
      />

      {currentStatus && (
        <EditStatusDialog
          key={currentStatus.id}
          open={showEditStatusDialog}
          onOpenChange={setShowEditStatusDialog}
          onSubmit={async (status) => {
            await handleEditStatus(currentStatus, status.title);
          }}
          initialValue={currentStatus.title}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
