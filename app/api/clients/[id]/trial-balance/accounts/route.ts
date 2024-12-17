import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { taxCategoryId, trialBalanceId, ...accountData } = data;

    const account = await prisma.account.create({
      data: {
        ...accountData,
        trialBalance: {
          connect: {
            id: trialBalanceId,
          },
        },
        taxCategory: {
          connect: {
            id: taxCategoryId,
          },
        },
      },
      include: {
        transactions: true,
        taxCategory: true,
      },
    });
    return NextResponse.json(account);
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();

    const account = await prisma.account.update({
      where: { id: data.id },
      data: {
        taxCategoryId: data.taxCategoryId,
        order: data.order || 0,
        adjustedDebit: data.adjustedDebit,
        adjustedCredit: data.adjustedCredit,
      },
      include: {
        transactions: true,
        taxCategory: true,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  const { id } = data;

  await prisma.accountAttachment.deleteMany({ where: { accountId: id } });
  await prisma.transaction.deleteMany({ where: { accountId: id } });
  await prisma.account.delete({ where: { id } });
  return NextResponse.json({ message: "Account deleted" });
}
