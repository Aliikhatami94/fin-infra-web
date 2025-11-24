import { transactionsMock } from "@/lib/mock"
import { transactionsResponseSchema } from "@/lib/schemas"
import type { Transaction } from "@/types/domain"
import { isMarketingMode } from "@/lib/marketingMode"
import { 
  Coffee, ShoppingBag, Home, Briefcase, UtensilsCrossed, 
  Wallet2, Plane, PiggyBank, Zap, Building, Car, HeartPulse, Gift,
  TrendingUp, TrendingDown, DollarSign
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { format } from "date-fns"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Cache duration: 30 seconds (matches backend TTL)
const CACHE_DURATION = 30 * 1000

// Cache for transactions with promise deduplication
const transactionsCache = new Map<
  string, 
  { 
    data: Transaction[] | null; 
    timestamp: number; 
    promise: Promise<Transaction[]> | null 
  }
>()

/**
 * Unified activity item from backend /v0/activity/feed endpoint
 */
interface ActivityItem {
  id: string
  type: 'banking' | 'investment'  // Backend field name
  date: string  // Backend field name (ISO date string)
  amount: number
  description: string
  account_id: string  // Backend field name
  account_name?: string | null  // Backend field name
  currency?: string
  // Banking-specific fields
  merchant_name?: string | null  // Backend field name
  category?: string[] | null
  pending?: boolean
  // Investment-specific fields
  transaction_type?: string | null  // Backend field name (buy, sell, dividend, etc)
  security_symbol?: string | null  // Backend field name
  security_name?: string | null  // Backend field name
  quantity?: number | null
  price?: number | null
  fees?: number | null
}

/**
 * Backend activity feed API response
 */
interface ActivityFeedResponse {
  activities: ActivityItem[]
  total_count: number
  start_date?: string
  end_date?: string
}

/**
 * Map activity to icon based on type and category
 */
function getActivityIcon(activity: ActivityItem): LucideIcon {
  // Investment activities
  if (activity.type === 'investment') {
    if (activity.amount > 0) return TrendingUp
    if (activity.amount < 0) return TrendingDown
    return DollarSign
  }
  
  // Banking activities - use category
  const category = activity.category
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
 * Transform unified activity item to frontend Transaction format
 */
function transformActivityToTransaction(activity: ActivityItem, index: number): Transaction {
  // For investment activities, use symbol + type as merchant
  let merchant = activity.description || 'Unknown'
  if (activity.type === 'investment' && activity.security_symbol) {
    merchant = `${activity.security_symbol} ${activity.transaction_type || ''}`
  } else if (activity.merchant_name) {
    merchant = activity.merchant_name
  }
  
  // Use first category for primary category, rest for tags
  const primaryCategory = activity.category?.[0] || 
    (activity.type === 'investment' ? 'Investment' : 'Other')
  
  // Safe date extraction (backend returns ISO date string like "2025-01-15")
  const date = activity.date || new Date().toISOString().split('T')[0]
  
  return {
    id: index + 1,
    date,
    merchant: merchant.trim(),
    amount: activity.amount || 0,
    category: primaryCategory,
    icon: getActivityIcon(activity),
    account: activity.account_name || activity.account_id.substring(0, 20) + '...',
    isNew: false,
    isRecurring: false,
    isFlagged: false,
    isTransfer: activity.category?.some(c => c.toLowerCase().includes("transfer")) || false,
    tags: activity.category?.slice(1) || [],
  }
}

/**
 * Fetch transactions from backend unified activity feed API
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
  
  // Calculate days for activity feed endpoint
  let days = 30 // default
  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  } else if (startDate) {
    const start = new Date(startDate)
    const now = new Date()
    days = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }
  
  // Build query params
  const params = new URLSearchParams()
  params.append("days", days.toString())
  // Include both banking and investment transactions
  params.append("types", "banking,investment")
  
  const url = `${API_URL}/v0/activity/feed?${params.toString()}`
  
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
    throw new Error(`Failed to fetch activity feed: ${response.statusText}`)
  }
  
  const data: ActivityFeedResponse = await response.json()
  
  console.log(`[Transactions] Received ${data.activities.length} activities from API`)
  
  // Filter out invalid activities (missing required fields)
  let activities = data.activities.filter(a => {
    if (!a.date) {
      console.warn('[Transactions] Skipping activity with missing date:', a)
      return false
    }
    if (!a.id) {
      console.warn('[Transactions] Skipping activity with missing id:', a)
      return false
    }
    return true
  })
  
  console.log(`[Transactions] ${activities.length} valid activities after filtering`)
  
  // Filter by account ID if provided
  if (accountId) {
    activities = activities.filter(a => a.account_id === accountId)
  }
  
  // Filter by date range if provided (backend returns wider range than requested)
  if (startDate || endDate) {
    activities = activities.filter(activity => {
      const activityDate = activity.date  // Backend returns ISO date string like "2025-01-15"
      if (startDate && activityDate < startDate) return false
      if (endDate && activityDate > endDate) return false
      return true
    })
  }
  
  // Transform to Transaction format
  const transformed = activities.map((activity, index) => 
    transformActivityToTransaction(activity, index)
  )
  
  return transformed
}

/**
 * Returns the list of transactions.
 * Fetches from API in production, uses mock data in marketing mode.
 * Implements caching with promise deduplication to prevent duplicate API calls.
 */
export async function getTransactions(
  startDate?: string,
  endDate?: string,
  accountId?: string
): Promise<Transaction[]> {
  if (isMarketingMode()) {
    return transactionsResponseSchema.parse(transactionsMock)
  }
  
  // Create cache key from parameters
  const cacheKey = `${startDate || "all"}:${endDate || "all"}:${accountId || "all"}`
  
  const now = Date.now()
  const cached = transactionsCache.get(cacheKey)
  
  // Return cached data if fresh
  if (cached?.data && (now - cached.timestamp) < CACHE_DURATION) {
    console.log(`Using cached transactions (${cached.data.length} items)`)
    return cached.data
  }
  
  // If fetch already in progress, await it (prevents duplicate calls)
  if (cached?.promise) {
    console.log("Awaiting existing transactions fetch...")
    return cached.promise
  }
  
  // Start new fetch and store promise
  const fetchPromise = (async () => {
    try {
      const transactions = await fetchTransactionsFromApi(startDate, endDate, accountId)
      console.log(`Fetched ${transactions.length} transactions from API`)
      const validated = transactionsResponseSchema.parse(transactions)
      console.log(`Validated ${validated.length} transactions`)
      
      // Update cache with data
      transactionsCache.set(cacheKey, {
        data: validated,
        timestamp: Date.now(),
        promise: null,
      })
      
      return validated
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
      console.error("Error details:", error instanceof Error ? error.message : error)
      
      // Cache empty array to prevent retry storms
      const emptyResult: Transaction[] = []
      transactionsCache.set(cacheKey, {
        data: emptyResult,
        timestamp: Date.now(),
        promise: null,
      })
      
      return emptyResult
    }
  })()
  
  // Store promise in cache
  transactionsCache.set(cacheKey, {
    data: cached?.data || null,
    timestamp: cached?.timestamp || now,
    promise: fetchPromise,
  })
  
  return fetchPromise
}
