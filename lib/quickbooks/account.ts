export function isDebitAccount(classification: string): boolean {
  return classification === "Asset" || classification === "Expense";
}

export function isCreditAccount(classification: string): boolean {
  return (
    classification === "Liability" ||
    classification === "Equity" ||
    classification === "Revenue"
  );
}
