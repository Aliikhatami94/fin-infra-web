/**
 * Dashboard service with API integration
 * 
 * Provides dashboard data with fallback to mock data during development.
 * Set NEXT_PUBLIC_API_URL to enable real API integration.
 * Marketing mode (?marketing=1) always uses mock data regardless of environment.
 */

import { kpis, recentActivities, personaKpiExtras, personaKpiPriorities } from "@/lib/mock"
import { dashboardKpisResponseSchema, recentActivitiesResponseSchema } from "@/lib/schemas"
import type { KPI, OnboardingPersona, RecentActivity } from "@/types/domain"
import { fetchDashboardKpis } from "@/lib/api/client"
import { isMarketingMode } from "@/lib/marketingMode"

const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === 'development'
const DEMO_USER_ID = "demo_user" // TODO: Get from auth context

/**
 * Get dashboard KPIs with optional persona filtering
 */
export async function getDashboardKpis(persona?: OnboardingPersona): Promise<KPI[]> {
  // Marketing mode: Always use mock data for demos/screenshots
  if (typeof window !== 'undefined' && isMarketingMode()) {
    return getDashboardKpisMock(persona)
  }

  // Use mock data if API not configured
  if (USE_MOCK_DATA) {
    return getDashboardKpisMock(persona)
  }

  try {
    // Fetch real data from API
    const data = await fetchDashboardKpis(DEMO_USER_ID)
    
    // Transform API response to KPI format
    const apiKpis: KPI[] = [
      {
        label: "Net Worth",
        value: formatCurrency(data.net_worth.value),
        change: formatPercent(data.net_worth.change_percent),
        baselineValue: formatCurrency(data.net_worth.value - data.net_worth.change),
        trend: data.net_worth.trend as 'up' | 'down' | 'flat',
        sparkline: generateSparkline(data.net_worth.value, data.net_worth.change_percent),
        icon: "DollarSign" as any, // TODO: Import lucide-react icons
        lastSynced: "Just now",
        source: "API",
        href: "/dashboard/accounts",
        quickActions: [
          { label: "See details", href: "/dashboard/accounts" },
        ],
      },
      {
        label: "Cash Flow",
        value: formatCurrency(data.cash_flow.net),
        change: data.cash_flow.net > 0 ? "+Positive" : "Negative",
        baselineValue: formatCurrency(Math.abs(data.cash_flow.income + data.cash_flow.expenses)),
        trend: data.cash_flow.net > 0 ? 'up' : 'down' as const,
        sparkline: generateSparkline(data.cash_flow.net, 5),
        icon: "TrendingUp" as any, // TODO: Import lucide-react icons
        lastSynced: "Just now",
        source: "API",
        href: "/dashboard/cash-flow",
        quickActions: [
          { label: "View breakdown", href: "/dashboard/cash-flow" },
        ],
      },
      {
        label: "Savings Rate",
        value: formatPercent(data.savings_rate.rate),
        change: data.savings_rate.status === 'on_track' ? "On track" : "Below target",
        baselineValue: formatPercent(data.savings_rate.target),
        trend: data.savings_rate.status === 'on_track' ? 'up' : 'down' as const,
        sparkline: generateSparkline(data.savings_rate.rate * 100, 2),
        icon: "PiggyBank" as any, // TODO: Import lucide-react icons
        lastSynced: "Just now",
        source: "API",
        href: "/dashboard/budget",
        quickActions: [
          { label: "Adjust budget", href: "/dashboard/budget" },
        ],
      },
    ]

    return apiKpis
  } catch (error) {
    console.error('Failed to fetch dashboard KPIs, falling back to mock data:', error)
    return getDashboardKpisMock(persona)
  }
}

/**
 * Mock data implementation (original function)
 */
function getDashboardKpisMock(persona?: OnboardingPersona): KPI[] {
  const base = dashboardKpisResponseSchema.parse(kpis)
  if (!persona) return base

  const priorities = personaKpiPriorities[persona.goalsFocus] ?? []
  const prioritized = base.filter((kpi) => priorities.includes(kpi.label))
  const remainder = base.filter((kpi) => !priorities.includes(kpi.label))
  const extras = personaKpiExtras[persona.goalsFocus] ?? []

  const ordered = [...prioritized, ...extras, ...remainder]
  const limit = Math.max(base.length, ordered.length)
  return ordered.slice(0, limit)
}

/**
 * Get recent activities (mock only for now)
 */
export function getRecentActivities(): RecentActivity[] {
  return recentActivitiesResponseSchema.parse(recentActivities)
}

/**
 * Helper functions
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value: number): string {
  return `${value > 0 ? '+' : ''}${(value * 100).toFixed(1)}%`
}

function generateSparkline(value: number, changePercent: number): number[] {
  // Generate simple sparkline data based on value and change
  const points = 10
  const start = value / (1 + changePercent / 100)
  const step = (value - start) / points
  return Array.from({ length: points }, (_, i) => start + (step * i))
}
