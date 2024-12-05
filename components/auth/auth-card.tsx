"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <Card className={cn("w-full max-w-md p-8", className)}>
        <div className="mb-8 flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">FortunAI</h1>
          <p className="text-sm text-muted-foreground">
            Professional Tax Accounting Solution
          </p>
        </div>
        {children}
      </Card>
    </div>
  );
}
