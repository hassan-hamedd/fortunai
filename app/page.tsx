import KanbanBoard from "@/components/kanban/kanban-board";
import { PageHeader } from "@/components/page-header";

export default function Home() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Client Dashboard"
        description="Manage your tax accounting clients"
      />
      <KanbanBoard />
    </div>
  );
}
