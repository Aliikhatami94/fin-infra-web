"use client"

import { type ComponentType, type SVGProps, useMemo } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, ArrowDown, ArrowUp, DollarSign, TrendingDown, Wallet } from "lucide-react"
import { motion } from "framer-motion"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useOnboardingState } from "@/hooks/use-onboarding-state"
import { useDateRange } from "@/components/date-range-provider"

// Generate realistic sparkline data based on timeline
const generateSparklineData = (timeline: string, baseValue: number, trend: "up" | "down" | "stable") => {
  const dataPoints: Record<string, number> = {
    "1D": 24, // 24 hours
    "5D": 5, // 5 days
    "1M": 30, // 30 days
    "6M": 26, // 26 weeks
    "YTD": 12, // 12 months (max)
    "1Y": 12, // 12 months
    "ALL": 12, // 12 months
  }
  
  const points = dataPoints[timeline] || 7
  const data: number[] = []
  
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1)
    let value = baseValue
    
    if (trend === "up") {
      value = baseValue * (0.95 + progress * 0.1) // 5% variation up
    } else if (trend === "down") {
      value = baseValue * (1.05 - progress * 0.1) // 5% variation down
    } else {
      // stable with minor fluctuations
      value = baseValue * (0.98 + Math.random() * 0.04)
    }
    
    data.push(Math.round(value))
  }
  
  return data
}

// Scale a monthly base value to the selected timeline (mock logic)
function scaleForTimeline(timeline: string): number {
  switch (timeline) {
    case "1D":
      return 1 / 30 // approx one day of a month
    case "5D":
      return 5 / 30 // approx five days of a month
    case "1M":
      return 1
    case "6M":
      return 6
    case "YTD": {
      const now = new Date()
      // months elapsed in current year
      return now.getMonth() + 1
    }
    case "1Y":
      return 12
    case "ALL":
      return 36 // assume 3 years for mock data
    default:
      return 1
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    value,
  )
}

type SummaryItem = {
  label: string
  value: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  color?: string
  sparkline?: number[]
  sparklineTrend?: "up" | "down" | "stable"
  baseValue?: number
  subtext?: string
  trend?: "up" | "down"
  progress?: number
  badge?: string
  actionable?: boolean
}

const baseSummary: SummaryItem[] = [
  {
    label: "Total Budgeted",
    value: "$6,500",
    icon: DollarSign,
    actionable: true,
    color: "text-foreground",
    sparklineTrend: "stable",
    baseValue: 6500,
  },
  {
    label: "Actual Spent",
    value: "$5,840",
    icon: TrendingDown,
    subtext: "5% vs. Last Month",
    trend: "down",
    color: "text-foreground",
    progress: 90,
    sparklineTrend: "up",
    baseValue: 5840,
  },
  {
    label: "Remaining",
    value: "$660",
    icon: Wallet,
    badge: "10% Remaining",
    color: "text-green-600 dark:text-green-400",
    sparklineTrend: "down",
    baseValue: 660,
  },
]

function Sparkline({ data, color = "hsl(var(--primary))" }: { data: number[]; color?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg width="80" height="24" className="opacity-60">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BudgetSummary() {
  const { state, hydrated } = useOnboardingState()
  const persona = hydrated ? state.persona : undefined
  const { dateRange } = useDateRange()

  const summary: SummaryItem[] = useMemo(() => {
    let items: SummaryItem[]
    
    if (!persona) {
      items = baseSummary.map(item => ({ ...item }))
    } else {
      const customized = baseSummary.map((item) => ({ ...item }))

      if (persona.goalsFocus === "debt_paydown") {
        customized[0] = {
          ...customized[0],
          label: "Debt Paydown Budget",
          value: "$1,200",
          badge: "Snowball active",
          icon: TrendingDown,
          baseValue: 1200,
        }
        customized[1] = {
          ...customized[1],
          subtext: "$300 extra vs. plan",
          trend: "down",
        }
      } else if (persona.goalsFocus === "financial_stability") {
        customized[2] = {
          ...customized[2],
          label: "Emergency Buffer",
          value: "$18,660",
          badge: "7.5 months",
          baseValue: 18660,
        }
      } else if (persona.goalsFocus === "wealth_building") {
        customized[0] = {
          ...customized[0],
          label: "Auto-invest Budget",
          value: "$3,200",
          icon: DollarSign,
          baseValue: 3200,
        }
      }

      if (persona.budgetingStyle === "automated") {
        customized[0] = { ...customized[0], actionable: false }
      }

      items = customized
    }

    // Generate timeline-scaled values and sparklines
    const scale = scaleForTimeline(dateRange)
    return items.map(item => {
      const base = item.baseValue ?? 0
      const scaled = Math.max(0, Math.round(base * scale))
      return {
        ...item,
        value: formatCurrency(scaled),
        sparkline:
          item.sparklineTrend !== undefined
            ? generateSparklineData(dateRange, scaled, item.sparklineTrend)
            : undefined,
      }
    })
  }, [persona, dateRange])

  // Get timeline label for sparkline
  const timelineLabel = useMemo(() => {
    const labels: Record<string, string> = {
      "1D": "24-hour trend",
      "5D": "5-day trend",
      "1M": "30-day trend",
      "6M": "6-month trend",
      "YTD": "Year-to-date trend",
      "1Y": "1-year trend",
      "ALL": "All-time trend",
    }
    return labels[dateRange] || "Trend"
  }, [dateRange])

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
      {summary.map((item, index) => {
        const TrendIcon = item.trend === "down" ? ArrowDown : ArrowUp
        const Icon = item.icon
        const progressValue = item.progress ?? 0
        const progressState =
          item.progress === undefined
            ? null
            : progressValue > 110
              ? "critical"
              : progressValue > 100
                ? "over"
                : progressValue >= 90
                  ? "near"
                  : "under"
        const progressColorClass =
          progressState === "over" || progressState === "critical"
            ? "text-[var(--color-negative)]"
            : progressState === "near"
              ? "text-orange-500 dark:text-orange-400"
              : "text-[var(--color-positive)]"
        const progressStatusLabel =
          progressState === "over" || progressState === "critical"
            ? "over budget"
            : progressState === "near"
              ? "nearing budget limit"
              : "under budget"
        return (
          <motion.div key={index} className="h-full" {...createStaggeredCardVariants(index, 0)}>
            <Card className="card-standard card-lift h-full">
              <CardContent className="flex h-full flex-col justify-between p-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    {Icon && (
                      <div className="rounded-lg bg-primary/10 p-2.5">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                  </div>
                  <LastSyncBadge timestamp="3 min ago" source="Plaid" className="flex-shrink-0" />
                </div>
                
                {/* Main Content */}
                <div className="space-y-4 flex-1">
                  <div className="flex items-end justify-between gap-4 min-h-[124px]">
                    <div className="space-y-2 flex-1">
                      <p className={`text-3xl font-bold tabular-nums tracking-tight ${item.color}`}>{item.value}</p>
                      {item.subtext && (
                        <div className="flex items-center gap-1.5 text-xs">
                          {item.trend && (
                            <TrendIcon
                              className={`h-3.5 w-3.5 ${
                                item.trend === "down"
                                  ? "text-[var(--color-positive)]"
                                  : "text-[var(--color-negative)]"
                              }`}
                            />
                          )}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors cursor-help"
                                  aria-label={`${item.subtext} trend details`}
                                >
                                  <span
                                    className={`font-medium ${
                                      item.trend === "down"
                                        ? "text-[var(--color-positive)]"
                                        : "text-[var(--color-negative)]"
                                    }`}
                                  >
                                    {item.subtext}
                                  </span>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Last Month: $6,150</p>
                                <p className="text-xs">This Month: $5,840</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                      {item.badge && (
                        <Badge variant="secondary" className="border-0 bg-green-500/10 text-[var(--color-positive)]">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      {item.actionable ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Button variant="outline" size="sm" className="h-9 w-9 p-0" disabled>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Coming soon - Auto-invest configuration</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : item.progress !== undefined ? (
                        <div
                          className="relative"
                          role="img"
                          aria-label={`${item.label} is ${progressValue}% complete, ${progressStatusLabel}.`}
                          data-progress-state={progressState ?? undefined}
                        >
                          <svg className="h-16 w-16 -rotate-90" aria-hidden="true">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="5"
                              fill="none"
                              className="text-muted/20"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="5"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 28}`}
                              strokeDashoffset={`${2 * Math.PI * 28 * (1 - item.progress / 100)}`}
                              className={progressColorClass}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-bold tabular-nums">{item.progress}%</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Sparkline at bottom - always show with consistent spacing */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground">{timelineLabel}</span>
                      {item.sparkline && (
                        <Sparkline
                          data={item.sparkline}
                          color={
                            item.color?.includes("green")
                              ? "var(--color-positive)"
                              : item.color?.includes("red")
                                ? "var(--color-negative)"
                                : "hsl(var(--primary))"
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
