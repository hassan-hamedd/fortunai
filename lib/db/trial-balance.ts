import { prisma } from "@/lib/db";

export async function getTrialBalance(clientId: string) {
  return prisma.trialBalance.findFirst({
    where: { clientId },
    include: {
      accounts: {
        include: {
          transactions: true,
          taxCategory: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTrialBalance(clientId: string, data: any) {
  return prisma.trialBalance.create({
    data: {
      clientId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      accounts: {
        create: data.accounts.map((account: any) => ({
          code: account.code,
          name: account.name,
          debit: account.debit,
          credit: account.credit,
          adjustedDebit: account.adjustedDebit,
          adjustedCredit: account.adjustedCredit,
          taxCategoryId: account.taxCategoryId,
        })),
      },
    },
    include: {
      accounts: {
        include: {
          transactions: true,
          taxCategory: true,
        },
      },
    },
  });
}

export async function updateAccount(accountId: string, data: any) {
  return prisma.account.update({
    where: { id: accountId },
    data: {
      taxCategoryId: data.taxCategoryId,
      adjustedDebit: data.adjustedDebit,
      adjustedCredit: data.adjustedCredit,
    },
    include: {
      transactions: true,
      taxCategory: true,
    },
  });
}

export async function createJournalEntry(trialBalanceId: string, data: any) {
  const entries = data.entries.map((entry: any) => ({
    accountId: entry.accountId,
    date: new Date(entry.date),
    description: entry.description,
    debit: entry.type === "debit" ? entry.amount : 0,
    credit: entry.type === "credit" ? entry.amount : 0,
  }));

  return prisma.$transaction(
    entries.map((entry: any) =>
      prisma.transaction.create({
        data: entry,
      })
    )
  );
}
