import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    console.log("data: ", data);

    // Create transactions for each entry
    const transactions = await prisma.$transaction(
      data.entries.map((entry: any) =>
        prisma.transaction.create({
          data: {
            accountId: entry.accountId,
            date: new Date(entry.date),
            description: entry.description,
            debit: entry.type === "debit" ? entry.amount : 0,
            credit: entry.type === "credit" ? entry.amount : 0,
          },
        })
      )
    );

    // Update account balances
    await Promise.all(
      data.entries.map((entry: any) =>
        prisma.account.update({
          where: { id: entry.accountId },
          data: {
            adjustedDebit: {
              increment: entry.type === "debit" ? entry.amount : 0,
            },
            adjustedCredit: {
              increment: entry.type === "credit" ? entry.amount : 0,
            },
          },
        })
      )
    );

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error creating journal entry: ", error);
    return NextResponse.json(
      { error: "Failed to create journal entry" },
      { status: 500 }
    );
  }
}
