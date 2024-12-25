import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(
  request: Request,
  { params }: { params: { clientId: string; accountId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const { content } = await request.json();

    const note = await prisma.accountNote.create({
      data: {
        content,
        accountId: params.accountId,
        authorId: userId,
        authorEmail: user.emailAddresses[0].emailAddress,
        authorName: `${user.firstName} ${user.lastName}`,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { clientId: string; accountId: string } }
) {
  try {
    const notes = await prisma.accountNote.findMany({
      where: {
        accountId: params.accountId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}
