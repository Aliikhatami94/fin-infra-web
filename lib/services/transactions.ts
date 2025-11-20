import { transactionsMock } from "@/lib/mock"
import { transactionsResponseSchema } from "@/lib/schemas"
import type { Transaction } from "@/types/domain"
import { isMarketingMode } from "@/lib/marketingMode"
import { 
  Coffee, ShoppingBag, Home, Briefcase, UtensilsCrossed, 
  Wallet2, Plane, PiggyBank, Zap, Building, Car, HeartPulse, Gift 
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

/**
 * Plaid transaction response from backend
 */
interface PlaidTransaction {
  transaction_id: string
  account_id: string
  amount: number
  date: string
  name: string
  merchant_name?: string | null
  category?: string[] | null
  pending: boolean
  payment_channel?: string | null
  iso_currency_code?: string | null
}

/**
 * Backend transactions API response
 */
interface TransactionsApiResponse {
  transactions: PlaidTransaction[]
  total_count: number
  accounts: Array<{
    account_id: string
    name: string
    type: string
  }>
}

/**
 * Map Plaid category to icon (simplified for now)
 */
function getCategoryIcon(category?: string[] | null): LucideIcon {
  if (!category || category.length === 0) return Wallet2
  
  const primary = category[0].toLowerCase()
  
  if (primary.includes("food") || primary.includes("restaurant")) return Coffee
  if (primary.includes("groceries") || primary.includes("shops")) return ShoppingBag
  if (primary.includes("mortgage") || primary.includes("rent")) return Home
  if (primary.includes("income") || primary.includes("payroll")) return Briefcase
  if (primary.includes("dining")) return UtensilsCrossed
  if (primary.includes("transfer")) return Wallet2
  if (primary.includes("travel") || primary.includes("airlines")) return Plane
  if (primary.includes("invest") || primary.includes("savings")) return PiggyBank
  if (primary.includes("utilities")) return Zap
  if (primary.includes("bank") || primary.includes("payment")) return Building
  if (primary.includes("transportation") || primary.includes("automotive")) return Car
  if (primary.includes("healthcare") || primary.includes("medical")) return HeartPulse
  if (primary.includes("gift") || primary.includes("charity")) return Gift
  
  return Wallet2
}

/**
 * Transform Plaid transaction to frontend Transaction format
 */
function transformPlaidTransaction(txn: PlaidTransaction, index: number, accountsMap: Map<string, string>): Transaction {
  const accountName = accountsMap.get(txn.account_id) || "Unknown Account"
  
  return {
    id: index + 1,
    date: txn.date,
    merchant: txn.merchant_name || txn.name,
    amount: -txn.amount, // Plaid uses positive for debits, we use negative
    category: txn.category?.[0] || "Other",
    icon: getCategoryIcon(txn.category),
    account: accountName,
    isNew: false,
    isRecurring: false,
    isFlagged: false,
    isTransfer: txn.category?.some(c => c.toLowerCase().includes("transfer")) || false,
    tags: txn.category?.slice(1) || [],
  }
}

/**
 * Fetch transactions from backend API
 */
async function fetchTransactionsFromApi(
  startDate?: string,
  endDate?: string,
  accountId?: string
): Promise<Transaction[]> {
  const token = localStorage.getItem("auth_token")
  if (!token) {
    throw new Error("No authentication token found")
  }
  
  // Build query params
  const params = new URLSearchParams()
  if (startDate) params.append("start_date", startDate)
  if (endDate) params.append("end_date", endDate)
  if (accountId) params.append("account_id", accountId)
  
  const url = `${API_URL}/v0/transactions${params.toString() ? `?${params.toString()}` : ""}`
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  
  if (!response.ok) {
    if (response.status === 404) {
      // No accounts connected yet
      return []
    }
    throw new Error(`Failed to fetch transactions: ${response.statusText}`)
  }
  
  const data: TransactionsApiResponse = await response.json()
  
  // Create account ID to name mapping
  const accountsMap = new Map<string, string>()
  for (const account of data.accounts) {
    accountsMap.set(account.account_id, account.name)
  }
  
  // Transform transactions
  const transformed = data.transactions.map((txn, index) => 
    transformPlaidTransaction(txn, index, accountsMap)
  )
  
  return transformed
}

/**
 * Returns the list of transactions.
 * Fetches from API in production, uses mock data in marketing mode.
 */
export async function getTransactions(
  startDate?: string,
  endDate?: string,
  accountId?: string
): Promise<Transaction[]> {
  if (isMarketingMode()) {
    return transactionsResponseSchema.parse(transactionsMock)
  }
  
  try {
    const transactions = await fetchTransactionsFromApi(startDate, endDate, accountId)
    console.log(`Fetched ${transactions.length} transactions from API`)
    const validated = transactionsResponseSchema.parse(transactions)
    console.log(`Validated ${validated.length} transactions`)
    return validated
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    console.error("Error details:", error instanceof Error ? error.message : error)
    // Fallback to empty array on error (user can re-link)
    return []
  }
}
