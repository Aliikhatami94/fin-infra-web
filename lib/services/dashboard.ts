import { kpis, personaKpiExtras, personaKpiPriorities, recentActivities } from "@/lib/mock"
import { dashboardKpisResponseSchema, recentActivitiesResponseSchema } from "@/lib/schemas"
import type { KPI, OnboardingPersona, RecentActivity } from "@/types/domain"

export function getDashboardKpis(persona?: OnboardingPersona): KPI[] {
  const base = dashboardKpisResponseSchema.parse(kpis)

  if (!persona) {
    return base
  }

  const priorities = personaKpiPriorities[persona.goalsFocus] ?? []
  const prioritized = base.filter((kpi) => priorities.includes(kpi.label))
  const remainder = base.filter((kpi) => !priorities.includes(kpi.label))
  const extras = personaKpiExtras[persona.goalsFocus] ?? []

  const ordered = [...prioritized, ...extras, ...remainder]
  const limit = Math.max(base.length, ordered.length)

  return ordered.slice(0, limit)
}

export function getRecentActivities(): RecentActivity[] {
  return recentActivitiesResponseSchema.parse(recentActivities)
}
