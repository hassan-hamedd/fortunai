// app/api/quickbooks/callback/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { QuickBooksClient } from "@/lib/quickbooks/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const stateParam = searchParams.get("state");
    const realmId = searchParams.get("realmId");

    if (!stateParam || !realmId) {
      return new Response("Missing required parameters", { status: 400 });
    }

    // Decode the state parameter to get clientId
    const clientId = Buffer.from(stateParam, "base64").toString();

    if (!clientId) {
      return new Response("Client ID not found in state", { status: 400 });
    }

    // Verify the client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return new Response(`Client not found with ID: ${clientId}`, {
        status: 404,
      });
    }

    const qbClient = new QuickBooksClient();
    const tokens = await qbClient.getTokens(request.url);

    // Check if integration already exists
    const existingIntegration = await prisma.quickBooksIntegration.findUnique({
      where: { clientId },
    });

    if (existingIntegration) {
      // Update existing integration
      await prisma.quickBooksIntegration.update({
        where: { clientId },
        data: {
          realmId,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: new Date(tokens.expires_at),
        },
      });
    } else {
      // Create new integration
      await prisma.quickBooksIntegration.create({
        data: {
          clientId,
          realmId,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: new Date(tokens.expires_at),
        },
      });
    }

    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/clients/${clientId}/trial-balance`
    );
  } catch (error) {
    console.error("QuickBooks callback error:", error);

    // Add more detailed error logging
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }

    return new Response(
      `Failed to connect QuickBooks: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
}

// export async function GET(request: NextRequest) {
//     try {
//       const { userId } = await auth();
//       if (!userId) {
//         return new Response("Unauthorized", { status: 401 });
//       }
  
//       const searchParams = request.nextUrl.searchParams;
//       const code = searchParams.get("code");
  
//       const qbClient = new QuickBooksClient();
//       const tokens = await qbClient.getTokens(request.url);
  
//       const realmId = searchParams.get("realmId");
//       const stateParam = searchParams.get("state");
  
//       if (!stateParam || !realmId) {
//         return new Response("Missing required parameters", { status: 400 });
//       }
  
//       const clientId = Buffer.from(stateParam, "base64").toString();
  
//       // Store the accountant's QuickBooks credentials
//       await prisma.accountantQuickBooks.upsert({
//         where: { userId },
//         update: {
//           accessToken: tokens.access_token,
//           refreshToken: tokens.refresh_token,
//           realmId,
//           expiresAt: new Date(tokens.expires_at),
//         },
//         create: {
//           userId,
//           accessToken: tokens.access_token,
//           refreshToken: tokens.refresh_token,
//           realmId,
//           expiresAt: new Date(tokens.expires_at),
//         },
//       });
  
//       // Redirect to company selection page
//       return Response.redirect(
//         `${process.env.NEXT_PUBLIC_APP_URL}/clients/${clientId}/select-quickbooks-company`
//       );
//     } catch (error) {
//       console.error("QuickBooks callback error:", error);
//       return new Response(
//         `Failed to connect QuickBooks: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`,
//         { status: 500 }
//       );
//     }
//   }
