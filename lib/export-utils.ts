"use client";

import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function exportToExcel(data: any[], columns: string[], filename: string) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');

  // Add headers
  worksheet.addRow(columns);

  // Add data
  data.forEach(row => {
    const values = columns.map(col => row[col]);
    worksheet.addRow(values);
  });

  // Style headers
  worksheet.getRow(1).font = { bold: true };
  worksheet.columns.forEach(column => {
    column.width = 15;
  });

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  
  // Create blob and download
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
}

export function exportToPDF(data: any[], columns: string[], filename: string) {
  const doc = new jsPDF();

  const tableData = data.map(row => columns.map(col => row[col]));

  (doc as any).autoTable({
    head: [columns],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 66, 66] },
  });

  doc.save(`${filename}.pdf`);
}