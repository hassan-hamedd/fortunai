"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Calendar,
  Mail,
  Clock,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScheduleReportDialog } from "./schedule-report-dialog";
import { format } from "date-fns";

interface ScheduledReport {
  id: string;
  name: string;
  frequency: "Daily" | "Weekly" | "Monthly" | "Quarterly";
  nextRun: string;
  recipients: string[];
  format: "PDF" | "Excel";
  type: string;
}

export function ScheduledReports() {
  const [reports, setReports] = useState<ScheduledReport[]>([
    {
      id: "1",
      name: "Monthly P&L",
      frequency: "Monthly",
      nextRun: "2024-03-01",
      recipients: ["john@example.com", "jane@example.com"],
      format: "PDF",
      type: "Profit & Loss",
    },
    {
      id: "2",
      name: "Weekly Cash Flow",
      frequency: "Weekly",
      nextRun: "2024-02-26",
      recipients: ["finance@example.com"],
      format: "Excel",
      type: "Cash Flow",
    },
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [editingReport, setEditingReport] = useState<ScheduledReport | null>(
    null
  );

  const handleAddReport = (report: ScheduledReport) => {
    if (editingReport) {
      setReports(reports.map((r) => (r.id === editingReport.id ? report : r)));
    } else {
      setReports([...reports, { ...report, id: Date.now().toString() }]);
    }
    setShowDialog(false);
    setEditingReport(null);
  };

  const handleEdit = (report: ScheduledReport) => {
    setEditingReport(report);
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    setReports(reports.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Scheduled Reports</h3>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule New Report
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Next Run</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Format</TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.name}</TableCell>
                <TableCell>{report.type}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {report.frequency}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {format(new Date(report.nextRun), "MMM dd, yyyy")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {report.recipients.length} recipient(s)
                  </div>
                </TableCell>
                <TableCell>{report.format}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(report)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(report.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <ScheduleReportDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onSubmit={handleAddReport}
        initialData={editingReport}
      />
    </div>
  );
}
