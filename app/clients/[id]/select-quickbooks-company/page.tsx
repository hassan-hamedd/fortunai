"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SelectQuickBooksCompany({
  params,
}: {
  params: { clientId: string };
}) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/quickbooks/companies");
      const data = await response.json();
      setCompanies(data.companies);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCompany = async (companyId: string) => {
    try {
      await fetch("/api/quickbooks/connect-company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: params.clientId,
          companyId,
        }),
      });

      // Redirect back to trial balance
      window.location.href = `/clients/${params.clientId}/trial-balance`;
    } catch (error) {
      console.error("Failed to connect company:", error);
    }
  };

  if (loading) {
    return <div>Loading companies...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Select QuickBooks Company</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {companies.map((company) => (
              <Button
                key={company.id}
                variant="outline"
                onClick={() => handleSelectCompany(company.id)}
                className="justify-start h-auto p-4"
              >
                <div>
                  <div className="font-medium">{company.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ID: {company.id}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
