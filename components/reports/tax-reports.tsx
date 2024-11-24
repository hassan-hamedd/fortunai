"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const taxReports = [
  {
    id: "1",
    name: "Q1 2024 Tax Summary",
    type: "Quarterly",
    status: "Filed",
    dueDate: "2024-04-15",
    amount: 25000,
  },
  {
    id: "2",
    name: "Q2 2024 Tax Summary",
    type: "Quarterly",
    status: "Pending",
    dueDate: "2024-07-15",
    amount: 28000,
  },
];

export function TaxReports() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Tax Reports</h3>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Generate New Report
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taxReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.name}</TableCell>
                <TableCell>{report.type}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    report.status === "Filed" 
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {report.status}
                  </div>
                </TableCell>
                <TableCell>{report.dueDate}</TableCell>
                <TableCell className="text-right">
                  ${report.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}