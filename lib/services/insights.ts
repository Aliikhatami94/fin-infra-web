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

export function getOverviewInsights(): OverviewInsight[] {
  return overviewInsightsResponseSchema.parse(overviewInsights)
}

export function getInsightsFeed(): InsightFeedItem[] {
  return insightFeedResponseSchema.parse(insightsFeed)
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
