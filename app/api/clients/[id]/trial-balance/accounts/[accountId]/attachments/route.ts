import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  const attachments = await prisma.accountAttachment.findMany({
    where: { accountId: params.accountId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(attachments);
}

export async function POST(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  const data = await request.json();
  const attachment = await prisma.accountAttachment.create({
    data: {
      ...data,
      accountId: params.accountId,
    },
  });
  return NextResponse.json(attachment);
}

// app/api/clients/accounts/[accountId]/attachments/[attachmentId]/route.ts
export async function DELETE(
  request: Request,
  { params }: { params: { accountId: string; attachmentId: string } }
) {
  await prisma.accountAttachment.delete({
    where: { id: params.attachmentId },
  });
  return NextResponse.json({ success: true });
}
