export const ACCOUNT_CATEGORIES = {
  ASSETS: {
    id: "assets",
    name: "Assets",
    subcategories: [
      { id: "current-assets", name: "Current Assets" },
      { id: "fixed-assets", name: "Fixed Assets" },
      { id: "other-assets", name: "Other Assets" },
    ],
  },
  LIABILITIES: {
    id: "liabilities",
    name: "Liabilities",
    subcategories: [
      { id: "current-liabilities", name: "Current Liabilities" },
      { id: "long-term-liabilities", name: "Long-term Liabilities" },
    ],
  },
  EQUITY: {
    id: "equity",
    name: "Equity",
    subcategories: [
      { id: "capital", name: "Capital" },
      { id: "retained-earnings", name: "Retained Earnings" },
    ],
  },
  REVENUE: {
    id: "revenue",
    name: "Revenue",
    subcategories: [
      { id: "operating-revenue", name: "Operating Revenue" },
      { id: "other-revenue", name: "Other Revenue" },
    ],
  },
  EXPENSES: {
    id: "expenses",
    name: "Expenses",
    subcategories: [
      { id: "operating-expenses", name: "Operating Expenses" },
      { id: "administrative-expenses", name: "Administrative Expenses" },
      { id: "other-expenses", name: "Other Expenses" },
    ],
  },
};
