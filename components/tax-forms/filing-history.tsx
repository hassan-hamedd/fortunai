"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, History } from "lucide-react";
import { format } from "date-fns";

const mockFilings = [
  {
    id: "1",
    formType: "Form 1120",
    taxYear: "2023",
    filedDate: "2024-03-10",
    status: "accepted",
    confirmationNumber: "123456789",
  },
  {
    id: "2",
    formType: "Form 941",
    taxYear: "2023",
    filedDate: "2024-01-15",
    status: "accepted",
    confirmationNumber: "987654321",
  },
  {
    id: "3",
    formType: "Form 1120",
    taxYear: "2022",
    filedDate: "2023-03-12",
    status: "amended",
    confirmationNumber: "456789123",
  },
];

export function FilingHistory({ clientId }) {
  const getStatusBadge = (status) => {
    const variants = {
      accepted: "success",
      pending: "warning",
      rejected: "destructive",
      amended: "default",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Filing History</h3>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Form Type</TableHead>
              <TableHead>Tax Year</TableHead>
              <TableHead>Filed Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Confirmation #</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockFilings.map((filing) => (
              <TableRow key={filing.id}>
                <TableCell className="font-medium">{filing.formType}</TableCell>
                <TableCell>{filing.taxYear}</TableCell>
                <TableCell>{format(new Date(filing.filedDate), "MMM dd, yyyy")}</TableCell>
                <TableCell>{getStatusBadge(filing.status)}</TableCell>
                <TableCell>{filing.confirmationNumber}</TableCell>
                <TableCell className="text-right">
                  <div className="space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    {filing.status === "amended" && (
                      <Button variant="ghost" size="sm">
                        <History className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}