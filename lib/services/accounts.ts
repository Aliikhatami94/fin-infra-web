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
 * Balance history response from backend
 */
interface BalanceHistoryResponse {
  account_id: string
  snapshots: Array<{
    date: string
    balance: number
  }>
  stats: {
    trend: string
    average: number
    minimum: number
    maximum: number
    change_amount: number
    change_percent: number
  }
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
 * Fetch balance history for an account
 */
async function fetchBalanceHistory(
  accountId: string,
  token: string,
  days: number = 30
): Promise<BalanceHistoryResponse | null> {
  try {
    const response = await fetch(
      `${API_URL}/banking/accounts/${accountId}/history?days=${days}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      console.warn(`Failed to fetch balance history for account ${accountId}`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.warn(`Error fetching balance history for account ${accountId}:`, error)
    return null
  }
}

/**
 * Transform Plaid account to frontend Account format
 */
async function transformPlaidAccount(
  acc: PlaidAccount,
  index: number,
  token: string
): Promise<Account> {
  const balance = acc.balances?.current ?? acc.balances?.available ?? 0
  const accountType = mapAccountType(acc.type, acc.subtype)
  
  // Fetch 30-day balance history
  const history = await fetchBalanceHistory(acc.account_id, token, 30)
  
  let balanceHistory: number[] = []
  let change = 0
  
  if (history && history.snapshots.length > 0) {
    // Use real balance history
    balanceHistory = history.snapshots.map((s) => s.balance)
    change = history.stats.change_percent
  } else {
    // Fallback: generate simple balance history estimate
    balanceHistory = Array.from({ length: 30 }, (_, i) => {
      const variance = (Math.random() - 0.5) * balance * 0.02 // ±2% variance
      return Number((balance + variance).toFixed(2))
    })
    balanceHistory[29] = balance // Current balance at end
  }
  
  return {
    id: index + 1,
    name: acc.name,
    type: accountType,
    institution: acc.institution_name || "Unknown",
    balance,
    change,
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
  
  // Transform accounts with balance history (in parallel for performance)
  const transformedAccounts = await Promise.all(
    data.accounts.map((acc, index) => transformPlaidAccount(acc, index, token))
  )
  
  return transformedAccounts
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
