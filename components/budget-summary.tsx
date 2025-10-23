"use client"

import { useMemo } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, ArrowDown, ArrowUp, DollarSign, TrendingDown, Wallet } from "lucide-react"
import { motion } from "framer-motion"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useOnboardingState } from "@/hooks/use-onboarding-state"

const sparklineData = {
  budgeted: [6200, 6300, 6400, 6500, 6500, 6500, 6500],
  spent: [5200, 5400, 5600, 5700, 5800, 5820, 5840],
  remaining: [1000, 900, 800, 800, 700, 680, 660],
}

const baseSummary = [
  {
    label: "Total Budgeted",
    value: "$6,500",
    icon: DollarSign,
    actionable: true,
    color: "text-foreground",
    sparkline: sparklineData.budgeted,
  },
  {
    label: "Actual Spent",
    value: "$5,840",
    icon: TrendingDown,
    subtext: "5% vs. Last Month",
    trend: "down",
    color: "text-foreground",
    progress: 90,
    sparkline: sparklineData.spent,
  },
  {
    label: "Remaining",
    value: "$660",
    icon: Wallet,
    badge: "10% Remaining",
    color: "text-green-600 dark:text-green-400",
    sparkline: sparklineData.remaining,
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

  const summary = useMemo(() => {
    if (!persona) {
      return baseSummary
    }

    const customized = baseSummary.map((item) => ({ ...item }))

    if (persona.goalsFocus === "debt_paydown") {
      customized[0] = {
        ...customized[0],
        label: "Debt Paydown Budget",
        value: "$1,200",
        badge: "Snowball active",
        icon: TrendingDown,
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
      }
    } else if (persona.goalsFocus === "wealth_building") {
      customized[0] = {
        ...customized[0],
        label: "Auto-invest Budget",
        value: "$3,200",
        icon: DollarSign,
      }
    }

    if (persona.budgetingStyle === "automated") {
      customized[0] = { ...customized[0], actionable: false }
    }

    return customized
  }, [persona])

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {summary.map((item, index) => {
        const TrendIcon = item.trend === "down" ? ArrowDown : ArrowUp
        const Icon = item.icon
        return (
          <motion.div key={index} {...createStaggeredCardVariants(index, 0)}>
            <Card className="card-standard card-lift">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      {Icon && (
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                      <LastSyncBadge timestamp="3 min ago" source="Plaid" />
                    </div>
                    <div className="space-y-2">
                      <p className={`text-3xl font-bold tabular-nums tracking-tight ${item.color}`}>{item.value}</p>
                      {item.subtext && (
                        <div className="flex items-center gap-1.5 text-xs">
                          {item.trend && (
                            <TrendIcon
                              className={`h-3.5 w-3.5 ${item.trend === "down" ? "text-[var(--color-positive)]" : "text-[var(--color-negative)]"}`}
                            />
                          )}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span
                                  className={`font-medium ${item.trend === "down" ? "text-[var(--color-positive)]" : "text-[var(--color-negative)]"}`}
                                >
                                  {item.subtext}
                                </span>
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
                        <Badge variant="secondary" className="bg-green-500/10 text-[var(--color-positive)] border-0">
                          {item.badge}
                        </Badge>
                      )}
                      {item.sparkline && (
                        <div className="pt-2">
                          <Sparkline
                            data={item.sparkline}
                            color={
                              item.color.includes("green")
                                ? "var(--color-positive)"
                                : item.color.includes("red")
                                  ? "var(--color-negative)"
                                  : "hsl(var(--primary))"
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    {item.actionable ? (
                      <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-transparent">
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : item.progress !== undefined ? (
                      <div className="relative">
                        <svg className="h-14 w-14 -rotate-90">
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-muted/20"
                          />
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 24}`}
                            strokeDashoffset={`${2 * Math.PI * 24 * (1 - item.progress / 100)}`}
                            className={
                              item.progress > 100
                                ? "text-red-500"
                                : item.progress > 90
                                  ? "text-orange-500"
                                  : "text-green-500"
                            }
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold tabular-nums">{item.progress}%</span>
                        </div>
                      </div>
                    ) : null}
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
