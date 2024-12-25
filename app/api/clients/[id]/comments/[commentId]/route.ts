import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { clientId: string; commentId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: params.commentId,
      },
    });

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    // Optional: Check if user owns the comment
    if (comment.authorId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.comment.delete({
      where: {
        id: params.commentId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[COMMENT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
