"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrialBalanceContent } from "@/components/trial-balance/trial-balance-content";
import { VarianceAnalysis } from "@/components/client/variance-analysis";
import { FinancialMetrics } from "@/components/client/financial-metrics";
import { ClientHeader } from "@/components/client/client-header";

export function ClientDashboard({ clientId }: { clientId: string }) {
  return (
    <div className="space-y-6 mt-6">
      <ClientHeader clientId={clientId} />

      <Tabs defaultValue="trial-balance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="variance">Variance Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trial-balance">
          <TrialBalanceContent clientId={clientId} />
        </TabsContent>

        <TabsContent value="overview">
          <FinancialMetrics clientId={clientId} />
        </TabsContent>

        <TabsContent value="variance">
          <VarianceAnalysis clientId={clientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
