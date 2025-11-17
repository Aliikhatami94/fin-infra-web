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
import { fetchPortfolioMetrics, fetchPortfolioHoldings, fetchPortfolioAllocation } from "@/lib/api/client"
import { getCurrentUserId } from "@/lib/auth/token"

const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_API_URL

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

  // For now, use mock data (portfolio endpoints not yet implemented in backend)
  // TODO: Remove this and uncomment API call once backend endpoints are ready
  return holdingsResponseSchema.parse(portfolioHoldings)

  /* Uncomment when backend portfolio endpoints are implemented:
  try {
    const data = await fetchPortfolioHoldings(userId)
    return holdingsResponseSchema.parse(data.holdings)
  } catch (error) {
    console.error('Failed to fetch portfolio holdings, falling back to mock:', error)
    return holdingsResponseSchema.parse(portfolioHoldings)
  }
  */
}
