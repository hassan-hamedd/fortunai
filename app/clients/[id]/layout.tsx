"use client";

import { TrialBalanceProvider } from "@/contexts/trial-balance-context";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TrialBalanceProvider>{children}</TrialBalanceProvider>;
}
