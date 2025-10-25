import { z } from "zod"

import type {
  ActivityAction,
  ActivityType,
  DashboardPersona,
  KPI,
  KPIQuickAction,
  KPIQuickActionIntent,
  RecentActivity,
} from "@/types/domain"
import { iconSchema } from "./accounts"

const buttonVariantSchema = z.enum(["default", "destructive", "outline", "secondary", "ghost", "link"])

const activityTypeSchema: z.ZodType<ActivityType> = z.custom<ActivityType>(
  (value) => typeof value === "string" && value.length > 0,
  {
    message: "Expected activity type string",
  },
)

export const activityActionSchema: z.ZodType<ActivityAction> = z.object({
  label: z.string(),
  variant: buttonVariantSchema,
})

export const recentActivitySchema: z.ZodType<RecentActivity> = z.object({
  id: z.number(),
  type: activityTypeSchema,
  category: z.string(),
  description: z.string(),
  amount: z.number().nullable(),
  date: z.string(),
  dateGroup: z.string(),
  icon: iconSchema,
  color: z.string(),
  actions: z.array(activityActionSchema),
})

const personaSchema: z.ZodType<DashboardPersona> = z.enum([
  "wealth_builder",
  "debt_destroyer",
  "stability_seeker",
])

const kpiQuickActionIntentSchema: z.ZodType<KPIQuickActionIntent> = z.enum([
  "navigate",
  "plan-adjust",
])

export const kpiQuickActionSchema: z.ZodType<KPIQuickAction> = z.object({
  label: z.string(),
  href: z.string().optional(),
  description: z.string().optional(),
  intent: kpiQuickActionIntentSchema.optional(),
  disabled: z.boolean().optional(),
  tooltip: z.string().optional(),
})

export const kpiSchema: z.ZodType<KPI> = z.object({
  label: z.string(),
  value: z.string(),
  change: z.string(),
  baselineValue: z.string(),
  trend: z.enum(["up", "down", "flat"]),
  sparkline: z.array(z.number()),
  icon: iconSchema,
  lastSynced: z.string(),
  source: z.string(),
  href: z.string(),
  urgency: z.enum(["low", "medium", "high"]).optional(),
  personas: z.array(personaSchema).optional(),
  narrative: z.string().optional(),
  quickActions: z.array(kpiQuickActionSchema).optional(),
})

export const dashboardKpisResponseSchema = z.array(kpiSchema)
export const recentActivitiesResponseSchema = z.array(recentActivitySchema)
