import { accountsData, mockTransactions } from "@/lib/mock"
import { accountsResponseSchema, transactionsResponseSchema } from "@/lib/schemas"
import type { Account, Transaction, AccountType } from "@/types/domain"
import { isMarketingMode } from "@/lib/marketingMode"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

/**
 * Plaid account response from backend
 */
interface PlaidAccount {
  account_id: string
  name: string
  type: string
  subtype?: string
  balances?: {
    available?: number | null
    current?: number | null
  }
  mask?: string
  institution_name?: string
}

/**
 * Backend accounts API response
 */
interface AccountsApiResponse {
  accounts: PlaidAccount[]
}

/**
 * Map Plaid account type to frontend AccountType
 */
function mapAccountType(type: string, subtype?: string): AccountType {
  if (type === "depository") {
    if (subtype === "checking") return "Checking"
    if (subtype === "savings") return "Savings"
    return "Checking"
  }
  if (type === "credit") return "Credit Card"
  if (type === "investment" || type === "brokerage") return "Investment"
  return type as AccountType
}

/**
 * Transform Plaid account to frontend Account format
 */
function transformPlaidAccount(acc: PlaidAccount, index: number): Account {
  const balance = acc.balances?.current ?? acc.balances?.available ?? 0
  const accountType = mapAccountType(acc.type, acc.subtype)
  
  // Generate simple balance history (last 30 days trend)
  const balanceHistory = Array.from({ length: 30 }, (_, i) => {
    const variance = (Math.random() - 0.5) * balance * 0.02 // ±2% variance
    return Number((balance + variance).toFixed(2))
  })
  balanceHistory[29] = balance // Current balance at end
  
  return {
    id: index + 1,
    name: acc.name,
    type: accountType,
    institution: acc.institution_name || "Unknown",
    balance,
    change: 0, // TODO: Calculate from historical data
    balanceHistory,
    lastSync: new Date().toISOString(),
    status: "active",
    nextBillDue: null,
    nextBillAmount: null,
  }
}

/**
 * Fetch accounts from backend API
 */
async function fetchAccountsFromApi(): Promise<Account[]> {
  const token = localStorage.getItem("auth_token")
  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(`${API_URL}/v0/banking-connection/accounts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      // No accounts connected yet
      return []
    }
    throw new Error(`Failed to fetch accounts: ${response.statusText}`)
  }

  const data: AccountsApiResponse = await response.json()
  return data.accounts.map(transformPlaidAccount)
}

/**
 * Returns the list of connected accounts using the shared domain contract.
 * Fetches from API in production, uses mock data in marketing mode.
 */
export async function getAccounts(): Promise<Account[]> {
  if (isMarketingMode()) {
    return accountsResponseSchema.parse(accountsData)
  }

  try {
    const accounts = await fetchAccountsFromApi()
    return accountsResponseSchema.parse(accounts)
  } catch (error) {
    console.error("Failed to fetch accounts:", error)
    // Fallback to empty array on error (user can re-link)
    return []
  }
}

/**
 * Returns a limited set of recent transactions for account detail panes.
 * Validation keeps icon and numeric shapes consistent across consumers.
 */
export function getRecentTransactions(): Transaction[] {
  return transactionsResponseSchema.parse(mockTransactions)
}

// Additional functions or updates can be added here if necessary
