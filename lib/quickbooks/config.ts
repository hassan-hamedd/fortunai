export const QUICKBOOKS_CONFIG = {
  clientId: process.env.QUICKBOOKS_CLIENT_ID!,
  clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET!,
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/quickbooks/callback`,
//   environment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
  environment: "sandbox",
  scopes: ["com.intuit.quickbooks.accounting"],
};
