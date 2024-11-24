"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const mockClients = [
  { id: "1", name: "Acme Corp", type: "Corporation" },
  { id: "2", name: "Tech Solutions LLC", type: "LLC" },
  { id: "3", name: "John Smith", type: "Individual" },
];

export function ClientSelector({ selectedClient, onClientChange }) {
  return (
    <Card className="p-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Client</label>
        <Select
          value={selectedClient?.id}
          onValueChange={(value) => {
            const client = mockClients.find(c => c.id === value);
            onClientChange(client);
          }}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            {mockClients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name} - {client.type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}