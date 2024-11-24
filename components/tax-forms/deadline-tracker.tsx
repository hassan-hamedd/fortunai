"use client";

import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, isSameDay } from "date-fns";

const mockDeadlines = [
  {
    id: "1",
    formType: "Form 1120",
    dueDate: "2024-03-15",
    status: "upcoming",
    description: "Corporate Tax Return",
  },
  {
    id: "2",
    formType: "Form 941",
    dueDate: "2024-04-30",
    status: "upcoming",
    description: "Quarterly Employment Tax",
  },
  {
    id: "3",
    formType: "Form 1040",
    dueDate: "2024-04-15",
    status: "upcoming",
    description: "Individual Tax Return",
  },
];

export function DeadlineTracker({ clientId }) {
  const today = new Date();

  const getDeadlineDates = () => {
    return mockDeadlines.map(deadline => new Date(deadline.dueDate));
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Tax Calendar</h3>
        <Calendar
          mode="single"
          selected={today}
          modifiers={{
            deadline: getDeadlineDates(),
          }}
          modifiersStyles={{
            deadline: {
              backgroundColor: "hsl(var(--primary))",
              color: "white",
              borderRadius: "50%",
            },
          }}
          className="rounded-md border"
        />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Upcoming Deadlines</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Form</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDeadlines.map((deadline) => (
              <TableRow key={deadline.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{deadline.formType}</div>
                    <div className="text-sm text-muted-foreground">
                      {deadline.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{format(new Date(deadline.dueDate), "MMM dd, yyyy")}</TableCell>
                <TableCell>
                  <Badge variant={deadline.status === "upcoming" ? "default" : "secondary"}>
                    {deadline.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}