"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, AlertTriangle, Download, Send, Eye } from "lucide-react";
import { FormPreviewDialog } from "./form-preview-dialog";
import { FormErrorsDialog } from "./form-errors-dialog";

const taxForms = {
  income: [
    { id: "1040", name: "Form 1040 - Individual Income Tax Return" },
    { id: "1120", name: "Form 1120 - Corporate Tax Return" },
    { id: "1120S", name: "Form 1120S - S Corporation Tax Return" },
    { id: "1065", name: "Form 1065 - Partnership Tax Return" },
  ],
  payroll: [
    { id: "941", name: "Form 941 - Quarterly Employment Tax Return" },
    { id: "W2", name: "Form W-2 - Wage and Tax Statement" },
    { id: "940", name: "Form 940 - FUTA Tax Return" },
  ],
  sales: [
    { id: "ST100", name: "Sales Tax Return" },
    { id: "ST101", name: "Sales Tax Exemption Certificate" },
  ],
};

export function PreBuiltForms({ clientId }) {
  const [selectedForm, setSelectedForm] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [formData, setFormData] = useState({});

  const handleFormSelect = (formId) => {
    // Simulate fetching form data from trial balance
    setFormData({
      // Mock data
      income: 500000,
      expenses: 300000,
      taxableIncome: 200000,
      errors: [
        { field: "Line 22", message: "Amount exceeds threshold" },
        { field: "Schedule C", message: "Missing depreciation details" },
      ],
    });
    setSelectedForm(formId);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleValidate = () => {
    setShowErrors(true);
  };

  const handleEFile = () => {
    // Implement e-filing logic
    console.log("E-filing form:", selectedForm);
  };

  if (!clientId) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please select a client to view available tax forms.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="income" className="space-y-4">
        <TabsList>
          <TabsTrigger value="income">Income Tax</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Tax</TabsTrigger>
          <TabsTrigger value="sales">Sales Tax</TabsTrigger>
        </TabsList>

        {Object.entries(taxForms).map(([category, forms]) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-2 gap-4">
              {forms.map((form) => (
                <Card
                  key={form.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedForm === form.id ? "border-primary" : ""
                  }`}
                  onClick={() => handleFormSelect(form.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <div>
                        <h3 className="font-medium">{form.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Tax Year: 2024
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {selectedForm && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Form Actions</h3>
              <div className="space-x-2">
                <Button variant="outline" onClick={handleValidate}>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Validate
                </Button>
                <Button variant="outline" onClick={handlePreview}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={handleEFile}>
                  <Send className="w-4 h-4 mr-2" />
                  E-File
                </Button>
              </div>
            </div>

            {formData.errors?.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {formData.errors.length} issues found. Please review before filing.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Card>
      )}

      <FormPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        formId={selectedForm}
        formData={formData}
      />

      <FormErrorsDialog
        open={showErrors}
        onOpenChange={setShowErrors}
        errors={formData.errors || []}
      />
    </div>
  );
}