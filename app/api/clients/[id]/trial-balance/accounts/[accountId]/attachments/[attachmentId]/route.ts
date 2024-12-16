import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { accountId: string; attachmentId: string } }
) {
  await prisma.accountAttachment.delete({
    where: { id: params.attachmentId },
  });
  return NextResponse.json({ success: true });
}
