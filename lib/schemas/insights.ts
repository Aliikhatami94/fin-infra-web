import { z } from "zod"

import type { InsightFeedItem, InsightDataPoint, OverviewInsight } from "@/types/domain"
import { iconSchema } from "./accounts"

const insightVariantValues = ["spending", "investment", "goals", "alert"] as const

export const insightDataPointSchema: z.ZodType<InsightDataPoint> = z.object({
  label: z.string(),
  value: z.string(),
  highlight: z.boolean().optional(),
})

export const overviewInsightSchema: z.ZodType<OverviewInsight> = z.object({
  id: z.number(),
  type: z.string(),
  icon: iconSchema,
  title: z.string(),
  description: z.string(),
  color: z.string(),
  bgColor: z.string(),
  borderColor: z.string(),
  progress: z.number(),
  isPinned: z.boolean(),
})

export const overviewInsightsResponseSchema = overviewInsightSchema.array()

export const insightFeedItemSchema: z.ZodType<InsightFeedItem> = z.object({
  id: z.number(),
  type: z.string(),
  icon: iconSchema,
  title: z.string(),
  description: z.string(),
  category: z.string(),
  variant: z.enum(insightVariantValues),
  trend: z.number().optional(),
  isPinned: z.boolean().optional(),
  dataPoints: insightDataPointSchema.array().optional(),
  explanation: z.string().optional(),
})

export const insightFeedResponseSchema = insightFeedItemSchema.array()
