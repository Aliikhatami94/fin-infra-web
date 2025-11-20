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
  fetched_at?: string  // ISO timestamp when data was fetched from Plaid
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
  // Depository accounts (checking, savings, money market, CD, HSA)
  if (type === "depository") {
    if (subtype === "checking") return "Checking"
    if (subtype === "savings") return "Savings"
    // Default depository to Checking
    return "Checking"
  }
  
  // Credit accounts
  if (type === "credit") return "Credit Card"
  
  // Investment accounts (IRA, 401k, brokerage, etc.)
  if (type === "investment" || type === "brokerage") return "Investment"
  
  // Loan accounts (mortgage, student, auto, personal)
  if (type === "loan") return "loan"
  
  // Fallback: return the raw type
  return type as AccountType
}

/**
 * Cache for balance history to prevent duplicate fetches
 */
const historyCache = new Map<string, { 
  data: BalanceHistoryResponse | null; 
  timestamp: number;
  promise: Promise<BalanceHistoryResponse | null> | null;
}>()
const HISTORY_CACHE_DURATION = 30000 // 30 seconds

/**
 * Fetch balance history for an account with caching and request deduplication
 */
async function fetchBalanceHistory(
  accountId: string,
  token: string,
  days: number = 30
): Promise<BalanceHistoryResponse | null> {
  const cacheKey = `${accountId}:${days}`
  const now = Date.now()
  
  // Check cache
  const cached = historyCache.get(cacheKey)
  if (cached) {
    // Return cached data if still fresh
    if (cached.data !== null && (now - cached.timestamp) < HISTORY_CACHE_DURATION) {
      return cached.data
    }
    // If there's a fetch in progress, wait for it (prevents duplicate requests)
    if (cached.promise) {
      return cached.promise
    }
  }
  
  // Start new fetch
  const fetchPromise = (async () => {
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

      const data = await response.json()
      
      // Update cache
      historyCache.set(cacheKey, { data, timestamp: Date.now(), promise: null })
      
      return data
    } catch (error) {
      console.warn(`Error fetching balance history for account ${accountId}:`, error)
      // Cache the null result to prevent retry storms
      historyCache.set(cacheKey, { data: null, timestamp: Date.now(), promise: null })
      return null
    }
  })()
  
  // Store the promise so concurrent calls can await it
  historyCache.set(cacheKey, { 
    data: cached?.data ?? null, 
    timestamp: cached?.timestamp ?? now, 
    promise: fetchPromise 
  })
  
  return fetchPromise
}

/**
 * Transform Plaid account to frontend Account format
 */
async function transformPlaidAccount(
  acc: PlaidAccount,
  index: number,
  token: string,
  fetchedAt?: string
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
    // Fallback: use current balance for all points (flat line) to accurately reflect no history
    balanceHistory = Array(30).fill(balance)
  }
  
  return {
    id: index + 1,
    account_id: acc.account_id, // Store Plaid account_id for API calls
    name: acc.name,
    type: accountType,
    institution: acc.institution_name || "Unknown",
    balance,
    change,
    balanceHistory,
    lastSync: fetchedAt || new Date().toISOString(), // Use backend's fetch time, not current time
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
    data.accounts.map((acc, index) => transformPlaidAccount(acc, index, token, data.fetched_at))
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
 * Returns recent transactions for a specific account.
 * Fetches from API in production, uses mock data in marketing mode.
 * 
 * @param accountId - Plaid account_id to filter transactions
 * @param limit - Maximum number of transactions to return (default: 3)
 */
export async function getRecentTransactions(accountId?: string, limit: number = 3): Promise<Transaction[]> {
  if (isMarketingMode()) {
    return transactionsResponseSchema.parse(mockTransactions.slice(0, limit))
  }

  try {
    const { getTransactions } = await import("@/lib/services/transactions")
    
    // Fetch last 30 days of transactions for the account
    const endDate = new Date().toISOString().split("T")[0]
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    
    const transactions = await getTransactions(startDate, endDate, accountId)
    
    // Return most recent transactions (limited)
    return transactions.slice(0, limit)
  } catch (error) {
    console.error(`Failed to fetch recent transactions for account ${accountId}:`, error)
    // Fallback to mock data on error
    return transactionsResponseSchema.parse(mockTransactions.slice(0, limit))
  }
}

// Additional functions or updates can be added here if necessary
