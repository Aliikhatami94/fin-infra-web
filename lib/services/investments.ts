/**
 * Investment service with real Plaid Investment API integration
 * 
 * Provides investment holdings, transactions, accounts, allocation, and securities
 * from user's connected investment accounts (401k, IRA, brokerage).
 */

import { 
  fetchInvestmentHoldings, 
  fetchInvestmentTransactions, 
  fetchInvestmentAccounts,
  fetchInvestmentAllocation,
  fetchInvestmentSecurities 
} from "@/lib/api/client"
import { isMarketingMode } from "@/lib/marketingMode"
import { getCurrentUserId } from "@/lib/auth/token"

const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_API_URL

/**
 * Get investment holdings with security details
 */
export async function getInvestmentHoldings(accountIds?: string[]) {
  // Marketing mode: Return empty for now (can add mock data later)
  if (typeof window !== 'undefined' && isMarketingMode()) {
    return []
  }

  // Check authentication
  const userId = getCurrentUserId()
  if (USE_MOCK_DATA || !userId) {
    return []
  }

  try {
    return await fetchInvestmentHoldings(accountIds)
  } catch (error) {
    console.error('Failed to fetch investment holdings:', error)
    return []
  }
}

/**
 * Get investment transactions (buy, sell, dividend, etc.)
 */
export async function getInvestmentTransactions(
  startDate: string,
  endDate: string,
  accountIds?: string[]
) {
  // Marketing mode: Return empty for now
  if (typeof window !== 'undefined' && isMarketingMode()) {
    return []
  }

  // Check authentication
  const userId = getCurrentUserId()
  if (USE_MOCK_DATA || !userId) {
    return []
  }

  try {
    return await fetchInvestmentTransactions(startDate, endDate, accountIds)
  } catch (error) {
    console.error('Failed to fetch investment transactions:', error)
    return []
  }
}

/**
 * Get investment accounts with aggregated holdings
 */
export async function getInvestmentAccounts() {
  // Marketing mode: Return empty for now
  if (typeof window !== 'undefined' && isMarketingMode()) {
    return []
  }

  // Check authentication
  const userId = getCurrentUserId()
  if (USE_MOCK_DATA || !userId) {
    return []
  }

  try {
    return await fetchInvestmentAccounts()
  } catch (error) {
    console.error('Failed to fetch investment accounts:', error)
    return []
  }
}

/**
 * Get portfolio asset allocation
 */
export async function getInvestmentAllocation(accountIds?: string[]) {
  // Marketing mode: Return empty for now
  if (typeof window !== 'undefined' && isMarketingMode()) {
    return { by_type: {}, by_sector: {}, total_value: 0 }
  }

  // Check authentication
  const userId = getCurrentUserId()
  if (USE_MOCK_DATA || !userId) {
    return { by_type: {}, by_sector: {}, total_value: 0 }
  }

  try {
    return await fetchInvestmentAllocation(accountIds)
  } catch (error) {
    console.error('Failed to fetch investment allocation:', error)
    return { by_type: {}, by_sector: {}, total_value: 0 }
  }
}

/**
 * Get security details by IDs
 */
export async function getInvestmentSecurities(securityIds: string[]) {
  // Marketing mode: Return empty for now
  if (typeof window !== 'undefined' && isMarketingMode()) {
    return []
  }

  // Check authentication
  const userId = getCurrentUserId()
  if (USE_MOCK_DATA || !userId) {
    return []
  }

  try {
    return await fetchInvestmentSecurities(securityIds)
  } catch (error) {
    console.error('Failed to fetch investment securities:', error)
    return []
  }
}

/**
 * Calculate portfolio metrics from holdings
 */
export function calculatePortfolioMetrics(holdings: any[]) {
  const totalValue = holdings.reduce((sum, h) => sum + h.institution_value, 0)
  const totalCostBasis = holdings.reduce((sum, h) => sum + (h.cost_basis || 0), 0)
  const totalGainLoss = holdings.reduce((sum, h) => sum + (h.unrealized_gain_loss || 0), 0)
  
  return {
    totalValue,
    totalCostBasis,
    totalGainLoss,
    totalGainLossPercent: totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0,
    holdingsCount: holdings.length,
  }
}
