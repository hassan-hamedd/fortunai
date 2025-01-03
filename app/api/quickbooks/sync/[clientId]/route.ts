import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { QuickBooksClient } from "@/lib/quickbooks/client";
import { QuickBooksAccount } from "@/lib/quickbooks/types";
import { isCreditAccount, isDebitAccount } from "@/lib/quickbooks/account";

export async function POST(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const { clientId } = params;

    // Get QuickBooks integration details
    const integration = await prisma.quickBooksIntegration.findUnique({
      where: { clientId },
    });

    if (!integration) {
      return new Response("QuickBooks integration not found", { status: 404 });
    }

    // Check if tokens need refresh
    const qbClient = new QuickBooksClient();
    let accessToken = integration.accessToken;

    try {
      if (new Date(integration.expiresAt) <= new Date()) {
        const tokens = await qbClient.refreshTokens(integration.refreshToken);
        accessToken = tokens.access_token;

        await prisma.quickBooksIntegration.update({
          where: { clientId },
          data: {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiresAt: new Date(tokens.expires_at),
          },
        });
      }
    } catch (error) {
      if (error.message === "REFRESH_TOKEN_EXPIRED") {
        // Delete the integration since it's no longer valid
        await prisma.quickBooksIntegration.delete({
          where: { clientId },
        });

        return new Response(
          JSON.stringify({
            error: "QUICKBOOKS_REAUTHORIZATION_REQUIRED",
            message:
              "QuickBooks authorization has expired. Please reconnect your account.",
          }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      throw error;
    }

    // Fetch accounts from QuickBooks
    const [qbAccounts, qbTransactions] = await Promise.all([
      qbClient.getAccounts(accessToken, integration.realmId),
      qbClient.getTransactions(accessToken, integration.realmId),
    ]);

    // Get the most recent trial balance for the client
    const existingTrialBalance = await prisma.trialBalance.findFirst({
      where: { clientId },
      orderBy: { createdAt: "desc" },
      include: { accounts: true },
    });

    if (!existingTrialBalance) {
      return new Response("No existing trial balance found", { status: 404 });
    }

    // Get existing tax categories
    const existingCategories = await prisma.taxCategory.findMany({
      where: { clientId },
    });

    // Create a map of lowercase category names to categories for easier lookup
    const categoryMap = new Map(
      existingCategories.map((cat) => [cat.name.toLowerCase(), cat])
    );

    // Convert to const function expression
    const findOrCreateCategory = async (name: string) => {
      const lowercaseName = name.toLowerCase();
      if (categoryMap.has(lowercaseName)) {
        return categoryMap.get(lowercaseName)!;
      }

      const newCategory = await prisma.taxCategory.create({
        data: { name, clientId },
      });
      categoryMap.set(lowercaseName, newCategory);
      return newCategory;
    };

    // Get or create "Uncategorized" category for accounts without classification
    const uncategorizedCategory = await findOrCreateCategory("Uncategorized");

    // Filter out accounts that already exist in the trial balance
    const existingAccountCodes = new Set(
      existingTrialBalance.accounts.map((account) => account.code)
    );

    const newQbAccounts = qbAccounts.filter(
      (qbAccount) => !existingAccountCodes.has(qbAccount.Id)
    );

    // Group existing accounts by tax category for order calculation
    const accountsByCategory = existingTrialBalance.accounts.reduce(
      (acc, account) => {
        if (!acc[account.taxCategoryId]) {
          acc[account.taxCategoryId] = [];
        }
        acc[account.taxCategoryId].push(account);
        return acc;
      },
      {} as Record<string, any[]>
    );

    // Add QuickBooks accounts to existing trial balance
    const accountCreationPromises = newQbAccounts.map(
      async (qbAccount: QuickBooksAccount, index) => {
        const categoryName = qbAccount.Classification || "Uncategorized";
        const category = await findOrCreateCategory(categoryName);

        const categoryAccounts = accountsByCategory[category.id] || [];
        const lastOrder =
          categoryAccounts.length > 0
            ? Math.max(...categoryAccounts.map((acc) => acc.order))
            : 0;

        const newOrder =
          lastOrder > 0 ? lastOrder + 1024 * (index + 1) : 1024 * (index + 1);

        categoryAccounts.push({ order: newOrder });
        accountsByCategory[category.id] = categoryAccounts;

        return {
          code: qbAccount.Id,
          name: qbAccount.Name,
          debit: isDebitAccount(qbAccount.Classification)
            ? Math.max(Math.abs(qbAccount.CurrentBalance), 0)
            : 0,
          credit: isCreditAccount(qbAccount.Classification)
            ? Math.max(Math.abs(qbAccount.CurrentBalance), 0)
            : 0,
          adjustedDebit: 0,
          adjustedCredit: 0,
          order: newOrder,
          taxCategoryId: category.id,
        };
      }
    );

    const newAccounts = await Promise.all(accountCreationPromises);

    const updatedTrialBalance = await prisma.trialBalance.update({
      where: { id: existingTrialBalance.id },
      data: {
        accounts: {
          create: newAccounts,
        },
      },
      include: { accounts: true },
    });

    const updatedAccountIds = new Set<string>();

    // First, let's add a helper function to create missing accounts
    const createMissingAccount = async (
      qbAccountRef: { value: string; name: string },
      trialBalanceId: string,
      clientId: string
    ) => {
      // Fetch the full account details from QuickBooks
      const accountDetails = await qbClient.getAccountById(
        accessToken,
        integration.realmId,
        qbAccountRef.value
      );

      if (!accountDetails) {
        console.error(
          `Could not fetch details for account: ${qbAccountRef.value}`
        );
        return null;
      }

      const categoryName = accountDetails.Classification || "Uncategorized";
      const category = await findOrCreateCategory(categoryName);

      const newAccount = await prisma.account.create({
        data: {
          trialBalanceId,
          code: qbAccountRef.value,
          name: qbAccountRef.name,
          debit: isDebitAccount(accountDetails.Classification)
            ? Math.max(Math.abs(accountDetails.CurrentBalance), 0)
            : 0,
          credit: isCreditAccount(accountDetails.Classification)
            ? Math.max(Math.abs(accountDetails.CurrentBalance), 0)
            : 0,
          adjustedDebit: 0,
          adjustedCredit: 0,
          order: 1024, // You might want to calculate this based on existing accounts
          taxCategoryId: category.id,
        },
      });

      return newAccount;
    };

    // Then modify the transaction processing part
    for (const journalEntry of qbTransactions) {
      for (const line of journalEntry.Line) {
        let account = await prisma.account.findFirst({
          where: {
            code: line.JournalEntryLineDetail.AccountRef.value,
            trialBalanceId: updatedTrialBalance.id,
          },
        });

        if (!account) {
          console.log(
            `Account not found, attempting to create: ${line.JournalEntryLineDetail.AccountRef.value}`
          );

          account = await createMissingAccount(
            line.JournalEntryLineDetail.AccountRef,
            updatedTrialBalance.id,
            clientId
          );

          if (!account) {
            console.error(`Failed to create account for line:`, line);
            continue; // Skip this line if we couldn't create the account
          }
        }

        await prisma.transaction.create({
          data: {
            accountId: account.id,
            date: new Date(journalEntry.TxnDate),
            description:
              line.Description ||
              journalEntry.DocNumber ||
              "QuickBooks Journal Entry",
            debit:
              line.JournalEntryLineDetail.PostingType === "Debit"
                ? parseFloat(line.Amount)
                : 0,
            credit:
              line.JournalEntryLineDetail.PostingType === "Credit"
                ? parseFloat(line.Amount)
                : 0,
          },
        });

        updatedAccountIds.add(account.id);
      }
    }

    for (const accountId of Array.from(updatedAccountIds)) {
      const account = await prisma.account.findUnique({
        where: { id: accountId },
        include: { transactions: true },
      });

      if (account) {
        const totalDebits = account.transactions.reduce(
          (sum, t) => sum + t.debit,
          0
        );
        const totalCredits = account.transactions.reduce(
          (sum, t) => sum + t.credit,
          0
        );

        await prisma.account.update({
          where: { id: accountId },
          data: {
            adjustedDebit: account.debit + totalDebits,
            adjustedCredit: account.credit + totalCredits,
          },
        });
      }
    }

    return Response.json({
      message: "Successfully synced with QuickBooks",
      trialBalance: updatedTrialBalance,
    });
  } catch (error) {
    return new Response("Failed to sync with QuickBooks", { status: 500 });
  }
}
