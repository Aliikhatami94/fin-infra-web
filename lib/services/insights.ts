/**
 * Insights service with API integration
 * 
 * Provides insights data with fallback to mock data during development.
 * Set NEXT_PUBLIC_API_URL to enable real API integration.
 * Marketing mode (?marketing=1) always uses mock data regardless of environment.
 */

import {
  budgetInsights,
  cashFlowInsights,
  cryptoInsights,
  goalsInsights,
  insightsFeed,
  overviewInsights,
  portfolioInsights,
} from "@/lib/mock"
import {
  documentInsightsResponseSchema,
  insightFeedResponseSchema,
  overviewInsightsResponseSchema,
} from "@/lib/schemas"
import type { DocumentInsight, InsightFeedItem, OverviewInsight } from "@/types/domain"
import { isMarketingMode } from "@/lib/marketingMode"
import { fetchInsightsFeed, fetchInsightsSummary } from "@/lib/api/client"
import { getCurrentUserId } from "@/lib/auth/token"

const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_API_URL

export function getOverviewInsights(): OverviewInsight[] {
  return overviewInsightsResponseSchema.parse(overviewInsights)
}

export async function getInsightsFeed(): Promise<InsightFeedItem[]> {
  // Marketing mode: Always use mock data
  if (typeof window !== 'undefined' && isMarketingMode()) {
    return insightFeedResponseSchema.parse(insightsFeed)
  }

  // Use mock data if API not configured
  if (USE_MOCK_DATA) {
    return insightFeedResponseSchema.parse(insightsFeed)
  }

  try {
    const data = await fetchInsightsFeed(DEMO_USER_ID, 50, true)
    // TODO: Transform API response to InsightFeedItem[] format
    // For now, fall back to mock data
    return insightFeedResponseSchema.parse(insightsFeed)
  } catch (error) {
    console.error('Failed to fetch insights feed, falling back to mock:', error)
    return insightFeedResponseSchema.parse(insightsFeed)
  }
}

export function getCashFlowInsights(): DocumentInsight[] {
  return documentInsightsResponseSchema.parse(cashFlowInsights)
}

export function getBudgetInsights(): DocumentInsight[] {
  return documentInsightsResponseSchema.parse(budgetInsights)
}

export function getGoalsInsights(): DocumentInsight[] {
  return documentInsightsResponseSchema.parse(goalsInsights)
}

export function getCryptoInsights(): DocumentInsight[] {
  return documentInsightsResponseSchema.parse(cryptoInsights)
}

export function getPortfolioInsights(): DocumentInsight[] {
  return documentInsightsResponseSchema.parse(portfolioInsights)
}
