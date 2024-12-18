import * as XLSX from "xlsx";
import { Account } from "@/components/trial-balance/types";

// Robust parsing function to handle different Excel formats
function parseAccounts(data: any[]): Partial<Account>[] {
  const accounts: Partial<Account>[] = [];

  // Assume the header is in the 5th row (index 4)
  const headerRowIndex = 4;
  const headerRow = data[headerRowIndex];

  if (!headerRow) {
    throw new Error("Could not find header row in the Excel file");
  }

  // Intelligent header index detection
  const headerIndices = {
    name: headerRow.findIndex((h) =>
      ["account", "name", "title", "description"].some((keyword) =>
        String(h).toLowerCase().includes(keyword)
      )
    ),
    debit: headerRow.findIndex((h) =>
      String(h).toLowerCase().includes("debit")
    ),
    credit: headerRow.findIndex((h) =>
      String(h).toLowerCase().includes("credit")
    ),
  };

  // Validation to ensure we found critical columns
  if (headerIndices.name === -1) {
    throw new Error("Could not find required column: Account Name");
  }

  // Start parsing from the row after headers
  const startIndex = headerRowIndex + 1;

  for (let i = startIndex; i < data.length; i++) {
    const row = data[i];

    if (!row || row.length < 2) continue;

    const parseNumeric = (value: any) => {
      if (value === null || value === undefined) return 0;
      if (typeof value === "string") {
        value = value.replace(/[\$,()]/g, "").trim();
        if (value.startsWith("(") && value.endsWith(")")) {
          value = `-${value.slice(1, -1)}`;
        }
      }
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : Math.abs(parsed);
    };

    const generateAccountCode = (index: number) =>
      `ACC${(index + 1).toString().padStart(4, "0")}`;

    const account: Partial<Account> = {
      code: generateAccountCode(i - startIndex),
      name: String(row[headerIndices.name] || "").trim(),
      debit:
        headerIndices.debit !== -1 && headerIndices.debit < row.length
          ? parseNumeric(row[headerIndices.debit])
          : 0,
      credit:
        headerIndices.credit !== -1 && headerIndices.credit < row.length
          ? parseNumeric(row[headerIndices.credit])
          : 0,
      adjustedDebit: 0,
      adjustedCredit: 0,
    };

    if (account.name) {
      accounts.push(account);
    }
  }

  return accounts;
}

export function parseTrialBalanceFromExcel(
  file: File
): Promise<Partial<Account>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const accounts = parseAccounts(data);
        resolve(accounts);
      } catch (error) {
        reject(new Error(`Error parsing Excel file: ${error.message}`));
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
}
