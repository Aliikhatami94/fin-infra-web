/**
 * API client for fin-api backend
 * 
 * Handles all HTTP requests to the fin-api backend with proper error handling,
 * authentication, and type safety.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * Base fetch wrapper with error handling and authentication
 */
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`
  
  // Get auth token from localStorage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  }
  
  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || `API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Dashboard KPIs
 */
export async function fetchDashboardKpis(userId: string) {
  return apiFetch<{
    net_worth: {
      value: number
      change: number
      change_percent: number
      trend: 'up' | 'down' | 'neutral'
    }
    cash_flow: {
      income: number
      expenses: number
      net: number
      period_days: number
    }
    savings_rate: {
      rate: number
      target: number
      status: 'on_track' | 'below_target' | 'unknown'
    }
  }>(`/v0/dashboard/kpis?user_id=${userId}`)
}

/**
 * Dashboard summary
 */
export async function fetchDashboardSummary(userId: string) {
  return apiFetch<{
    accounts: Record<string, number>
    insights: Array<{
      id: string
      type: string
      priority: string
      title: string
      description: string
    }>
    budget_status: any
    goals: any[]
  }>(`/v0/dashboard/summary?user_id=${userId}`)
}

/**
 * Insights feed
 */
export async function fetchInsightsFeed(userId: string, limit = 20, includeRead = false) {
  return apiFetch<{
    insights: Array<{
      id: string
      type: string
      priority: string
      title: string
      description: string
      action: string | null
      created_at: string | null
    }>
    count: number
    sources: string[]
  }>(`/v0/insights/feed?user_id=${userId}&limit=${limit}&include_read=${includeRead}`)
}

/**
 * Insights summary
 */
export async function fetchInsightsSummary(userId: string) {
  return apiFetch<{
    by_priority: Record<string, number>
    by_category: Record<string, number>
    highlights: Array<{
      category: string
      count: number
      priority: string
    }>
    total_unread: number
  }>(`/v0/insights/summary?user_id=${userId}`)
}

/**
 * Portfolio metrics
 */
export async function fetchPortfolioMetrics(userId: string, accounts?: string[]) {
  const params = new URLSearchParams({ user_id: userId })
  if (accounts) {
    accounts.forEach(acc => params.append('accounts', acc))
  }
  
  return apiFetch<{
    total_value: number
    day_change: number
    day_change_percent: number
    total_return: number
    ytd_return: number
    mtd_return: number
    asset_allocation: Record<string, number>
  }>(`/v0/portfolio/metrics?${params}`)
}

/**
 * Portfolio benchmark comparison
 */
export async function fetchPortfolioBenchmark(
  userId: string,
  benchmark = 'SPY',
  period = '1y'
) {
  return apiFetch<{
    portfolio_return: number
    benchmark_return: number
    alpha: number
    beta: number
    sharpe_ratio: number
    period: string
  }>(`/v0/portfolio/benchmark?user_id=${userId}&benchmark=${benchmark}&period=${period}`)
}

/**
 * Portfolio holdings
 */
export async function fetchPortfolioHoldings(userId: string) {
  return apiFetch<{
    holdings: Array<{
      symbol: string
      name: string
      quantity: number
      cost_basis: number
      current_price: number
      market_value: number
      gain_loss: number
      gain_loss_percent: number
      weight: number
    }>
    total_value: number
    total_cost_basis: number
    total_gain_loss: number
  }>(`/v0/portfolio/holdings?user_id=${userId}`)
}

/**
 * Portfolio allocation
 */
export async function fetchPortfolioAllocation(userId: string) {
  return apiFetch<{
    by_asset_class: Array<{
      class: string
      value: number
      percent: number
    }>
    by_sector: Array<{
      sector: string
      value: number
      percent: number
    }>
  }>(`/v0/portfolio/allocation?user_id=${userId}`)
}

/**
 * Banking connection status
 */
export async function fetchBankingConnectionStatus(userId: string) {
  return apiFetch<{
    user_id: string
    connections: Record<string, {
      connected_at: string
      is_healthy: boolean
      error_message: string | null
      last_synced: string | null
    }>
  }>(`/v0/banking-connection/status?user_id=${userId}`)
}

/**
 * Connect Plaid account
 */
export async function connectPlaid(accessToken: string, itemId: string) {
  return apiFetch<{
    success: boolean
    provider: string
    connected_at: string
  }>('/v0/banking-connection/plaid', {
    method: 'POST',
    body: JSON.stringify({
      access_token: accessToken,
      item_id: itemId,
    }),
  })
}

/**
 * Connect Teller account
 */
export async function connectTeller(accessToken: string, enrollmentId: string) {
  return apiFetch<{
    success: boolean
    provider: string
    connected_at: string
  }>('/v0/banking-connection/teller', {
    method: 'POST',
    body: JSON.stringify({
      access_token: accessToken,
      enrollment_id: enrollmentId,
    }),
  })
}

/**
 * Disconnect banking provider
 */
export async function disconnectProvider(provider: string) {
  return apiFetch<{
    success: boolean
    provider: string
    disconnected_at: string
  }>(`/v0/banking-connection/${provider}`, {
    method: 'DELETE',
  })
}

/**
 * Health check
 */
export async function healthCheck() {
  return apiFetch<{
    status: string
    timestamp: string
  }>('/v0/status/health')
}
