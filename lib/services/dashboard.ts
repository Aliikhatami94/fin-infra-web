import { kpis, recentActivities } from "@/lib/mock"
import { dashboardKpisResponseSchema, recentActivitiesResponseSchema } from "@/lib/schemas"
import type { KPI, RecentActivity } from "@/types/domain"

export function getDashboardKpis(): KPI[] {
  return dashboardKpisResponseSchema.parse(kpis)
}

export function getRecentActivities(): RecentActivity[] {
  return recentActivitiesResponseSchema.parse(recentActivities)
}
