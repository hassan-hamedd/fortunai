import OAuthClient from "intuit-oauth";
import { QUICKBOOKS_CONFIG } from "./config";

export class QuickBooksClient {
  private oauthClient: any;
  private baseUrl: string;

  constructor() {
    this.oauthClient = new OAuthClient({
      clientId: QUICKBOOKS_CONFIG.clientId,
      clientSecret: QUICKBOOKS_CONFIG.clientSecret,
      environment: QUICKBOOKS_CONFIG.environment,
      redirectUri: QUICKBOOKS_CONFIG.redirectUri,
    });

    this.baseUrl =
      QUICKBOOKS_CONFIG.environment === "production"
        ? "https://quickbooks.api.intuit.com"
        : "https://sandbox-quickbooks.api.intuit.com";
  }

  getAuthorizationUrl(clientId: string) {
    // Encode the clientId in base64 to safely include it in the state
    const encodedState = Buffer.from(clientId).toString("base64");
    return this.oauthClient.authorizeUri({
      scope: QUICKBOOKS_CONFIG.scopes,
      state: encodedState,
    });
  }

  async getTokens(url: string) {
    const response = await this.oauthClient.createToken(url);
    return {
      access_token: response.token.access_token,
      refresh_token: response.token.refresh_token,
      expires_at: Date.now() + response.token.expires_in * 1000,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      this.oauthClient.setToken({
        refresh_token: refreshToken,
      });
      console.log("refreshing tokens");
      const response = await this.oauthClient.refresh();
      return {
        access_token: response.token.access_token,
        refresh_token: response.token.refresh_token,
        expires_at: Date.now() + response.token.expires_in * 1000,
      };
    } catch (error) {
      console.error("Error refreshing tokens:", error);
      // Check if refresh token is expired or invalid
      if (
        error.message?.includes("invalid_grant") ||
        error.message?.includes("Token expired") ||
        error.message?.includes("The Refresh token is invalid, please Authorize again.")
      ) {
        throw new Error("REFRESH_TOKEN_EXPIRED");
      }
      throw error;
    }
  }

  async getAccounts(accessToken: string, realmId: string) {
    const url = `${this.baseUrl}/v3/company/${realmId}/query`;

    console.log("Making request to:", url); // Add this for debugging

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/text",
      },
      method: "POST",
      body: "SELECT * FROM Account WHERE Active = true",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("QuickBooks API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Failed to fetch QuickBooks accounts: ${errorText}`);
    }

    const data = await response.json();
    console.log("QuickBooks API Response:", data); // Add this for debugging
    return data.QueryResponse.Account;
  }

  async getCompanyInfo(accessToken: string, realmId: string) {
    try {
      console.log("Getting company info with:", { realmId });

      const url = `${this.baseUrl}/v3/company/${realmId}/companyinfo/${realmId}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Company Info Response:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(`Failed to fetch company info: ${errorText}`);
      }

      const data = await response.json();
      return {
        id: data.CompanyInfo.Id,
        companyName: data.CompanyInfo.CompanyName,
        legalName: data.CompanyInfo.LegalName,
        companyStartDate: data.CompanyInfo.CompanyStartDate,
        fiscalYearStartMonth: data.CompanyInfo.FiscalYearStartMonth,
      };
    } catch (error) {
      console.error("Detailed error in getCompanyInfo:", error);
      throw error;
    }
  }

  async getTransactions(accessToken: string, realmId: string) {
    const url = `${this.baseUrl}/v3/company/${realmId}/query`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/text",
      },
      method: "POST",
      // Get all journal entries within date range
      body: "SELECT * FROM JournalEntry WHERE TxnDate >= '2024-01-01'",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch QuickBooks transactions");
    }

    const data = await response.json();
    return data.QueryResponse.JournalEntry || [];
  }
}
