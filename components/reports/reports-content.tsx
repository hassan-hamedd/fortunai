"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreBuiltReports } from "./pre-built-reports";
import { CustomReports } from "./custom-reports";
import { TaxReports } from "./tax-reports";
import { ScheduledReports } from "./scheduled-reports";

export function ReportsContent() {
  return (
    <div className="mt-6 h-[calc(100vh-10rem)] overflow-auto pb-8">
      <Tabs defaultValue="pre-built" className="space-y-4">
        <TabsList className="sticky top-0 z-10 bg-background">
          <TabsTrigger value="pre-built">Pre-Built Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="tax">Tax Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="pre-built">
          <PreBuiltReports />
        </TabsContent>

        <TabsContent value="custom">
          <CustomReports />
        </TabsContent>

        <TabsContent value="tax">
          <TaxReports />
        </TabsContent>

        <TabsContent value="scheduled">
          <ScheduledReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}