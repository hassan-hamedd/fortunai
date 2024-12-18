import { NextRequest } from "next/server";
import { QuickBooksClient } from "@/lib/quickbooks/client";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const clientId = searchParams.get("clientId");

  if (!clientId) {
    return new Response("Client ID is required", { status: 400 });
  }

  const qbClient = new QuickBooksClient();
  const authUrl = qbClient.getAuthorizationUrl(clientId);

  // Store clientId in session or secure cookie for callback

  return Response.redirect(authUrl);
}
