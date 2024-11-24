"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreBuiltForms } from "./pre-built-forms";
import { DeadlineTracker } from "./deadline-tracker";
import { FilingHistory } from "./filing-history";
import { ClientSelector } from "./client-selector";

export function TaxFormsContent() {
  const [selectedClient, setSelectedClient] = useState(null);

  return (
    <div className="mt-6">
      <ClientSelector 
        selectedClient={selectedClient}
        onClientChange={setSelectedClient}
      />

      <div className="mt-6">
        <Tabs defaultValue="forms" className="space-y-4">
          <TabsList>
            <TabsTrigger value="forms">Tax Forms</TabsTrigger>
            <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
            <TabsTrigger value="history">Filing History</TabsTrigger>
          </TabsList>

          <TabsContent value="forms">
            <PreBuiltForms clientId={selectedClient?.id} />
          </TabsContent>

          <TabsContent value="deadlines">
            <DeadlineTracker clientId={selectedClient?.id} />
          </TabsContent>

          <TabsContent value="history">
            <FilingHistory clientId={selectedClient?.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}