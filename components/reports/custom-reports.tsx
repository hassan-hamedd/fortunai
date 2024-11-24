"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Save, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const availableFields = [
  { id: "revenue", name: "Revenue" },
  { id: "expenses", name: "Expenses" },
  { id: "assets", name: "Assets" },
  { id: "liabilities", name: "Liabilities" },
  { id: "equity", name: "Equity" },
  { id: "cash_flow", name: "Cash Flow" },
  { id: "ratios", name: "Financial Ratios" },
];

function SortableField({ id, name }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 bg-muted rounded-md cursor-move hover:bg-muted/80 transition-colors"
    >
      {name}
    </div>
  );
}

export function CustomReports() {
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("");
  const [format, setFormat] = useState("");
  const [selectedFields, setSelectedFields] = useState([]);
  const [templates, setTemplates] = useState([]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const field = availableFields.find(f => f.id === active.id);
    if (field && !selectedFields.find(f => f.id === field.id)) {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleRemoveField = (fieldId) => {
    setSelectedFields(selectedFields.filter(f => f.id !== fieldId));
  };

  const handleSaveTemplate = () => {
    if (!reportName) return;
    
    const template = {
      id: Date.now().toString(),
      name: reportName,
      type: reportType,
      format,
      fields: selectedFields,
    };
    
    setTemplates([...templates, template]);
    // Reset form
    setReportName("");
    setReportType("");
    setFormat("");
    setSelectedFields([]);
  };

  const handleGenerateReport = () => {
    // Create report data
    const reportData = {
      name: reportName,
      type: reportType,
      format,
      fields: selectedFields,
      generatedAt: new Date().toISOString(),
    };

    // Generate and download report
    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${reportName || "custom-report"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Report Builder</h3>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleSaveTemplate}>
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
              <Button onClick={handleGenerateReport} disabled={!reportName || selectedFields.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Report Name</Label>
              <Input 
                placeholder="Enter report name" 
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">Financial Statement</SelectItem>
                  <SelectItem value="tax">Tax Report</SelectItem>
                  <SelectItem value="audit">Audit Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="comparative">Comparative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
            >
              <Card className="p-4">
                <h4 className="font-medium mb-2">Available Fields</h4>
                <div className="space-y-2">
                  <SortableContext
                    items={availableFields}
                    strategy={verticalListSortingStrategy}
                  >
                    {availableFields.map((field) => (
                      <SortableField
                        key={field.id}
                        id={field.id}
                        name={field.name}
                      />
                    ))}
                  </SortableContext>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-2">Selected Fields</h4>
                <div className="space-y-2 min-h-[200px]">
                  {selectedFields.map((field) => (
                    <div
                      key={field.id}
                      className="p-2 bg-muted rounded-md flex justify-between items-center"
                    >
                      {field.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveField(field.id)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  {selectedFields.length === 0 && (
                    <div className="h-[200px] border-2 border-dashed rounded-md p-4 flex items-center justify-center text-muted-foreground">
                      Drag fields here to add them to your report
                    </div>
                  )}
                </div>
              </Card>
            </DndContext>
          </div>

          {templates.length > 0 && (
            <div className="mt-8">
              <h4 className="font-medium mb-2">Saved Templates</h4>
              <div className="grid grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="p-4">
                    <h5 className="font-medium">{template.name}</h5>
                    <p className="text-sm text-muted-foreground">{template.type}</p>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReportName(template.name);
                          setReportType(template.type);
                          setFormat(template.format);
                          setSelectedFields(template.fields);
                        }}
                      >
                        Load Template
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}