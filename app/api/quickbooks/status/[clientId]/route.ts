import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const { clientId } = params;
    console.log("called status");

    const integration = await prisma.quickBooksIntegration.findUnique({
      where: { clientId },
    });

    return Response.json({
      isConnected: !!integration,
      // Optionally include more details if needed
      lastSynced: integration?.updatedAt,
    });
  } catch (error) {
    console.error("QuickBooks status check error:", error);
    return new Response("Failed to check QuickBooks status", { status: 500 });
  }
}
