/**
 * Portfolio service with API integration
 * 
 * Provides portfolio data with fallback to mock data during development.
 * Set NEXT_PUBLIC_API_URL to enable real API integration.
 * Marketing mode (?marketing=1) always uses mock data regardless of environment.
 */

import { portfolioHoldings } from "@/lib/mock"
import { holdingsResponseSchema } from "@/lib/schemas"
import type { Holding } from "@/types/domain"
import { isMarketingMode } from "@/lib/marketingMode"
import { fetchPortfolioMetrics as _fetchPortfolioMetrics, fetchPortfolioHoldings as _fetchPortfolioHoldings, fetchPortfolioAllocation as _fetchPortfolioAllocation, fetchPortfolioBenchmark as _fetchPortfolioBenchmark } from "@/lib/api/client"
import { getCurrentUserId } from "@/lib/auth/token"
import type { LucideIcon } from "lucide-react"
import { DollarSign, TrendingUpIcon, Activity, Target, TrendingUp } from "lucide-react"

const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_API_URL

// Cache duration: 30 seconds (matches backend TTL)
const CACHE_DURATION = 30 * 1000

// Cache for portfolio data with promise deduplication
let metricsCache: { 
  data: any | null; 
  timestamp: number; 
  promise: Promise<any> | null 
} = {
  data: null,
  timestamp: 0,
  promise: null,
}

let benchmarkCache: { 
  data: any | null; 
  timestamp: number; 
  promise: Promise<any> | null 
} = {
  data: null,
  timestamp: 0,
  promise: null,
}

/**
 * Portfolio KPI structure
 */
export interface PortfolioKPI {
  label: string
  value: string
  change: string
  baselineValue: string
  positive: boolean
  tooltip: string
  icon: LucideIcon
  lastSynced: string
  source: string
}

export async function getPortfolioHoldings(): Promise<Holding[]> {
  // Marketing mode: Always use mock data
  if (typeof window !== 'undefined' && isMarketingMode()) {
    return holdingsResponseSchema.parse(portfolioHoldings)
  }

  // Use mock data if API not configured or user not authenticated
  const userId = getCurrentUserId()
  if (USE_MOCK_DATA || !userId) {
    return holdingsResponseSchema.parse(portfolioHoldings)
  }

  // Fetch real holdings from investment API
  try {
    const { fetchInvestmentHoldings } = await import('@/lib/api/client')
    const holdingsData = await fetchInvestmentHoldings()
    
    // Transform API response to match Holding type
    const holdings = holdingsData.map(h => ({
      symbol: h.security.ticker_symbol || h.security.security_id,
      name: h.security.name || 'Unknown',
      shares: h.quantity,
      price: h.institution_price,
      value: h.institution_value,
      change: h.unrealized_gain_loss || 0,
      changePercent: h.unrealized_gain_loss_percent || 0,
      costBasis: h.cost_basis || h.institution_value,
      sector: h.security.sector || 'Other',
      assetType: h.security.type as any || 'equity',
    }))
    
    return holdingsResponseSchema.parse(holdings)
  } catch (error) {
    console.error('Failed to fetch portfolio holdings, falling back to mock:', error)
    return holdingsResponseSchema.parse(portfolioHoldings)
  }
}

/**
 * Get relative time string (e.g., "5s ago", "2 min ago")
 */
function getRelativeTime(timestamp: string): string {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  
  if (diffSeconds < 30) return `${diffSeconds}s ago`
  if (diffSeconds < 60) return 'just now'
  
  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hr ago`
  
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

/**
 * Format currency value
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format percentage value
 */
function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

/**
 * Format ratio value
 */
function formatRatio(value: number, decimals = 2): string {
  return value.toFixed(decimals)
}

/**
 * Get cached portfolio metrics with promise deduplication
 */
async function getCachedMetrics(): Promise<any> {
  const userId = getCurrentUserId()
  if (!userId) return null
  
  const now = Date.now()
  
  // Return cached data if fresh
  if (metricsCache.data && (now - metricsCache.timestamp) < CACHE_DURATION) {
    return metricsCache.data
  }
  
  // If fetch already in progress, await it (prevents duplicate calls)
  if (metricsCache.promise) {
    return metricsCache.promise
  }
  
  // Start new fetch and store promise
  const fetchPromise = (async () => {
    try {
      const data = await _fetchPortfolioMetrics()
      
      // Update cache with data
      metricsCache = {
        data,
        timestamp: Date.now(),
        promise: null,
      }
      
      return data
    } catch (error) {
      console.error("Failed to fetch portfolio metrics:", error)
      
      // Cache null to prevent retry storms
      metricsCache = {
        data: null,
        timestamp: Date.now(),
        promise: null,
      }
      
      return null
    }
  })()
  
  // Store promise in cache
  metricsCache.promise = fetchPromise
  
  return fetchPromise
}

/**
 * Get cached portfolio benchmark with promise deduplication
 */
async function getCachedBenchmark(): Promise<any> {
  const userId = getCurrentUserId()
  if (!userId) return null
  
  const now = Date.now()
  
  // Return cached data if fresh
  if (benchmarkCache.data && (now - benchmarkCache.timestamp) < CACHE_DURATION) {
    return benchmarkCache.data
  }
  
  // If fetch already in progress, await it (prevents duplicate calls)
  if (benchmarkCache.promise) {
    return benchmarkCache.promise
  }
  
  // Start new fetch and store promise
  const fetchPromise = (async () => {
    try {
      const data = await _fetchPortfolioBenchmark()
      
      // Update cache with data
      benchmarkCache = {
        data,
        timestamp: Date.now(),
        promise: null,
      }
      
      return data
    } catch (error) {
      console.error("Failed to fetch portfolio benchmark:", error)
      
      // Cache null to prevent retry storms
      benchmarkCache = {
        data: null,
        timestamp: Date.now(),
        promise: null,
      }
      
      return null
    }
  })()
  
  // Store promise in cache
  benchmarkCache.promise = fetchPromise
  
  return fetchPromise
}

/**
 * Calculate portfolio KPIs from real backend data
 */
async function calculateRealKPIs(): Promise<PortfolioKPI[]> {
  const [metrics, benchmark] = await Promise.all([
    getCachedMetrics(),
    getCachedBenchmark(),
  ])
  
  const now = new Date().toISOString()
  const syncTime = getRelativeTime(now)
  
  // If no data available or all zeros, return empty array to show placeholder
  if (!metrics || metrics.total_value === 0) {
    console.log('No portfolio data from backend, showing placeholder')
    return []
  }
  
  const kpis: PortfolioKPI[] = []
  
  // Total Value KPI
  if (metrics.total_value !== undefined) {
    const dayChangePercent = metrics.day_change_percent || 0
    kpis.push({
      label: "Total Value",
      value: formatCurrency(metrics.total_value),
      change: formatPercent(dayChangePercent),
      baselineValue: formatCurrency(metrics.total_value - (metrics.day_change || 0)),
      positive: dayChangePercent >= 0,
      tooltip: "Current market value of all investment accounts",
      icon: DollarSign,
      lastSynced: syncTime,
      source: "Live",
    })
  }
  
  // All-Time P/L KPI
  if (metrics.total_return !== undefined) {
    const returnPercent = (metrics.total_return || 0) * 100
    kpis.push({
      label: "All-Time P/L",
      value: formatCurrency(metrics.total_value * (metrics.total_return || 0)),
      change: formatPercent(returnPercent),
      baselineValue: formatCurrency(metrics.total_value),
      positive: returnPercent >= 0,
      tooltip: "Total profit/loss since you started investing",
      icon: TrendingUpIcon,
      lastSynced: syncTime,
      source: "Live",
    })
  }
  
  // Sharpe Ratio KPI (from benchmark data)
  if (benchmark?.sharpe_ratio !== undefined) {
    const sharpeRatio = benchmark.sharpe_ratio
    kpis.push({
      label: "Sharpe Ratio",
      value: formatRatio(sharpeRatio),
      change: sharpeRatio >= 1.5 ? "+Good" : sharpeRatio >= 1.0 ? "+Fair" : "Low",
      baselineValue: "1.0",
      positive: sharpeRatio >= 1.0,
      tooltip: "Risk-adjusted return metric. Higher is better (>1 is good, >2 is excellent)",
      icon: Target,
      lastSynced: syncTime,
      source: "Calculated",
    })
  }
  
  // Beta KPI (from benchmark data)
  if (benchmark?.beta !== undefined) {
    const beta = benchmark.beta
    kpis.push({
      label: "Beta",
      value: formatRatio(beta),
      change: beta < 1 ? "-Less volatile" : "+More volatile",
      baselineValue: "1.0",
      positive: beta <= 1.0,
      tooltip: "Volatility relative to market (SPY). <1 means less volatile than market",
      icon: Activity,
      lastSynced: syncTime,
      source: "Calculated",
    })
  }
  
  // YTD Return KPI
  if (metrics.ytd_return !== undefined) {
    const ytdPercent = (metrics.ytd_return || 0) * 100
    const mtdPercent = (metrics.mtd_return || 0) * 100
    kpis.push({
      label: "YTD Return",
      value: formatPercent(ytdPercent),
      change: formatPercent(mtdPercent),
      baselineValue: formatPercent(ytdPercent - mtdPercent),
      positive: ytdPercent >= 0,
      tooltip: "Year-to-date return since January 1st",
      icon: TrendingUp,
      lastSynced: syncTime,
      source: "Live",
    })
  }
  
  return kpis
}

/**
 * Get portfolio KPIs (real or mock data)
 */
export async function getPortfolioKPIs(): Promise<PortfolioKPI[]> {
  if (isMarketingMode()) {
    // Return mock data for marketing mode
    return [
      {
        label: "Total Value",
        value: "$187,650.45",
        change: "+5.7%",
        baselineValue: "$177,520.30",
        positive: true,
        tooltip: "Current market value of all investment accounts",
        icon: DollarSign,
        lastSynced: "just now",
        source: "Live",
      },
      {
        label: "All-Time P/L",
        value: "+$24,650.45",
        change: "+15.1%",
        baselineValue: "$21,420.10",
        positive: true,
        tooltip: "Total profit/loss since you started investing",
        icon: TrendingUpIcon,
        lastSynced: "just now",
        source: "Live",
      },
      {
        label: "Sharpe Ratio",
        value: "1.85",
        change: "+Good",
        baselineValue: "1.73",
        positive: true,
        tooltip: "Risk-adjusted return metric. Higher is better (>1 is good, >2 is excellent)",
        icon: Target,
        lastSynced: "5 min ago",
        source: "Calculated",
      },
      {
        label: "Beta",
        value: "0.92",
        change: "-Less volatile",
        baselineValue: "0.97",
        positive: true,
        tooltip: "Volatility relative to market (SPY). <1 means less volatile than market",
        icon: Activity,
        lastSynced: "5 min ago",
        source: "Calculated",
      },
      {
        label: "Volatility",
        value: "14.2%",
        change: "-1.3%",
        baselineValue: "15.5%",
        positive: true,
        tooltip: "Standard deviation of returns. Lower is less risky",
        icon: Activity,
        lastSynced: "5 min ago",
        source: "Calculated",
      },
      {
        label: "YTD Return",
        value: "+18.4%",
        change: "+2.1%",
        baselineValue: "+16.3%",
        positive: true,
        tooltip: "Year-to-date return since January 1st",
        icon: TrendingUp,
        lastSynced: "just now",
        source: "Live",
      },
    ]
  }
  
  try {
    return await calculateRealKPIs()
  } catch (error) {
    console.error("Failed to load portfolio KPIs:", error)
    return []
  }
}
