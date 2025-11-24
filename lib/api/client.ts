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
    credentials: 'include', // Always include cookies for OAuth session
  })

  if (!response.ok) {
    // Handle 401 Unauthorized - session expired or invalid
    if (response.status === 401) {
      // Clear auth token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
      }
      // Create a custom error that can be caught by components
      const error = new Error('Session expired. Please log in again.')
      error.name = 'AuthenticationError'
      throw error
    }
    
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
 * Portfolio metrics
 */
export async function fetchPortfolioMetrics() {
  return apiFetch<{
    total_value: number
    day_change: number
    day_change_percent: number
    total_return: number  // Still present for backward compat
    total_return_pct: number  // NEW: percentage value from backend (1972.82 not 19.7282)
    unrealized_pl: number  // NEW: dollar amount of unrealized P/L
    ytd_return: number
    mtd_return: number
    asset_allocation: Record<string, number>
  }>('/v0/portfolio/metrics')
}

/**
 * Portfolio history (time-series data for charts)
 */
export async function fetchPortfolioHistory(
  period: '1d' | '1w' | '1m' | '3m' | '6m' | '1y' | 'ytd' | 'all' = '1y',
  granularity: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily'
) {
  return apiFetch<{
    data: Array<{
      date: string
      portfolio_value: number
      cost_basis: number
      unrealized_pl: number
      total_return_pct: number
    }>
    period: string
    granularity: string
  }>(`/v0/portfolio/history?period=${period}&granularity=${granularity}`)
}

/**
 * Net worth history (time-series data for charts)
 */
export async function fetchNetWorthHistory(
  userId: string,
  period: '1d' | '1w' | '1m' | '3m' | '6m' | '1y' | 'ytd' | 'all' = '1y',
  granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
) {
  return apiFetch<{
    data: Array<{
      date: string
      net_worth: number
      assets: number
      liabilities: number
    }>
    period: string
    granularity: string
  }>(`/v0/dashboard/net-worth-history?user_id=${userId}&period=${period}&granularity=${granularity}`)
}

/**
 * Portfolio benchmark comparison
 */
export async function fetchPortfolioBenchmark(benchmark = 'SPY', period = '1y') {
  return apiFetch<{
    period: string
    benchmark: string
    portfolio_return: number
    benchmark_return: number
    alpha: number
    beta: number
    sharpe_ratio: number | null
    outperformance: number
  }>(`/v0/portfolio/benchmark?benchmark=${benchmark}&period=${period}`)
}

/**
 * Portfolio allocation
 */
export async function fetchPortfolioAllocation() {
  return apiFetch<{
    by_asset_class: {
      stocks: number
      bonds: number
      cash: number
      crypto: number
      real_estate: number
      other: number
    }
    target_allocation: Record<string, number>
    rebalancing_needed: boolean
    drift: number
  }>('/v0/portfolio/allocation')
}

/**
 * Investment Holdings
 * POST /investments/holdings
 * 
 * App auth: user_router (automatic via session)
 * Provider access: Auto-resolved from user's stored Plaid token
 */
export async function fetchInvestmentHoldings(accountIds?: string[]) {
  return apiFetch<Array<{
    account_id: string
    security: {
      security_id: string
      ticker_symbol: string | null
      name: string | null
      type: string
      sector: string | null
      close_price: number
      close_price_as_of: string | null
      currency: string
    }
    quantity: number
    institution_price: number
    institution_value: number
    cost_basis: number | null
    currency: string
    unrealized_gain_loss: number | null
    unrealized_gain_loss_percent: number | null
  }>>('/investments/holdings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      account_ids: accountIds,
    }),
  })
}

/**
 * Investment Transactions
 * POST /investments/transactions
 * 
 * App auth: user_router (automatic via session)
 * Provider access: Auto-resolved from user's stored Plaid token
 */

/**
 * Investment Accounts with aggregated holdings
 * POST /investments/accounts
 * 
 * App auth: user_router (automatic via session)
 * Provider access: Auto-resolved from user's stored Plaid token
 */
export async function fetchInvestmentAccounts() {
  return apiFetch<Array<{
    account_id: string
    name: string
    type: string
    subtype: string | null
    balances: {
      current: number
      available: number | null
    }
    holdings: any[]
    total_value?: number
    total_cost_basis?: number
    total_unrealized_gain_loss?: number
  }>>('/investments/accounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  })
}

/**
 * Portfolio Asset Allocation
 * POST /investments/allocation
 * 
 * App auth: user_router (automatic via session)
 * Provider access: Auto-resolved from user's stored Plaid token
 */
export async function fetchInvestmentAllocation(accountIds?: string[]) {
  return apiFetch<{
    by_type: Record<string, number>
    by_sector: Record<string, number>
    total_value: number
  }>('/investments/allocation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      account_ids: accountIds,
    }),
  })
}

/**
 * Security Details
 * POST /investments/securities
 * 
 * App auth: user_router (automatic via session)
 * Provider access: Auto-resolved from user's stored Plaid token
 */
export async function fetchInvestmentSecurities(securityIds: string[]) {
  return apiFetch<Array<{
    security_id: string
    cusip: string | null
    isin: string | null
    ticker_symbol: string | null
    name: string | null
    type: string
    sector: string | null
    close_price: number
    close_price_as_of: string | null
    currency: string
  }>>('/investments/securities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      security_ids: securityIds,
    }),
  })
}

/**
 * Investment Transactions
 * POST /investments/transactions
 * 
 * App auth: user_router (automatic via session)
 * Provider access: Auto-resolved from user's stored Plaid token
 */
export async function fetchInvestmentTransactions(startDate: string, endDate: string, accountIds?: string[]) {
  return apiFetch<Array<{
    transaction_id: string
    account_id: string
    security: {
      security_id: string
      ticker_symbol: string | null
      name: string | null
      type: string
    }
    date: string
    name: string
    type: 'buy' | 'sell' | 'dividend' | 'cash' | 'fee' | 'transfer' | 'cancel'
    subtype: string | null
    quantity: string
    amount: string
    price: string | null
    fees: string | null
    currency: string
    unofficial_currency_code: string | null
  }>>('/investments/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      start_date: startDate,
      end_date: endDate,
      account_ids: accountIds,
    }),
  })
}

/**
 * Transactions summary
 */
export async function fetchTransactionsSummary(days = 30) {
  return apiFetch<{
    period_days: number
    start_date: string
    end_date: string
    total_spending: number
    total_income: number
    net_cash_flow: number
    transaction_count: number
    average_transaction: number
    top_categories: Array<{ category: string; amount: number }>
  }>(`/v0/transactions/summary?days=${days}`)
}

/**
 * Cash flow history (monthly breakdown)
 */
export async function fetchCashFlowHistory(months = 12) {
  return apiFetch<{
    data: Array<{
      month: string
      income: number
      expenses: number
      net: number
    }>
    period_months: number
  }>(`/v0/transactions/cash-flow-history?months=${months}`)
}

/**
 * Activity Feed - Unified timeline of all financial activities
 * GET /v0/activity/feed
 * 
 * Returns merged banking and investment transactions in chronological order.
 */
export async function fetchActivityFeed(days = 30, types?: 'banking' | 'investment' | 'banking,investment') {
  const params = new URLSearchParams({ days: days.toString() })
  if (types) {
    params.append('types', types)
  }
  
  return apiFetch<{
    activities: Array<{
      id: string
      type: 'banking' | 'investment'
      date: string
      amount: number
      description: string
      account_id: string
      currency: string
      // Banking-specific
      category?: string[]
      merchant_name?: string
      pending?: boolean
      // Investment-specific
      transaction_type?: string
      security_symbol?: string
      security_name?: string
      quantity?: number
      price?: number
      fees?: number
    }>
    total_count: number
    date_range: {
      start_date: string
      end_date: string
    }
  }>(`/v0/activity/feed?${params.toString()}`)
}

/**
 * Recent Activity - Quick access to latest activities
 * GET /v0/activity/recent
 * 
 * Convenience endpoint for dashboard widgets.
 */
export async function fetchRecentActivity(limit = 20) {
  return apiFetch<{
    activities: Array<{
      id: string
      type: 'banking' | 'investment'
      date: string
      amount: number
      description: string
      account_id: string
      currency: string
      // Banking-specific
      category?: string[]
      merchant_name?: string
      pending?: boolean
      // Investment-specific
      transaction_type?: string
      security_symbol?: string
      security_name?: string
      quantity?: number
      price?: number
      fees?: number
    }>
    total_count: number
    date_range: {
      start_date: string
      end_date: string
    }
  }>(`/v0/activity/recent?limit=${limit}`)
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
