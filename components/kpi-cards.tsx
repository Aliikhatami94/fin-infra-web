"use client"

import { useMemo } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { MaskableValue } from "@/components/privacy-provider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LastSyncBadge } from "@/components/last-sync-badge"
import Link from "next/link"
import { motion } from "framer-motion"
import { createStaggeredCardVariants, cardHoverVariants } from "@/lib/motion-variants"
import { getValueColor, getValueBgColor } from "@/lib/color-utils"
import { getDashboardKpis } from "@/lib/services"
import { useOnboardingState } from "@/hooks/use-onboarding-state"

const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
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
    <svg className="w-20 h-10" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function KPICards() {
  const { state, hydrated } = useOnboardingState()
  const kpis = useMemo(() => getDashboardKpis(hydrated ? state.persona : undefined), [hydrated, state.persona])

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi, index) => {
        const trendValue = kpi.trend === "up" ? 1 : kpi.trend === "down" ? -1 : 0

        return (
          <TooltipProvider key={kpi.label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={kpi.href}>
                  <motion.div {...createStaggeredCardVariants(index, 0)} {...cardHoverVariants}>
                    <Card className="cursor-pointer card-standard card-lift">
                      <CardContent className="p-6 min-h-[140px] flex flex-col justify-between">
                        <div className="mb-2">
                          <LastSyncBadge timestamp={kpi.lastSynced} source={kpi.source} />
                        </div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="space-y-1 flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">{kpi.label}</p>
                            <p className="text-2xl font-bold font-mono tabular-nums truncate">
                              <MaskableValue value={kpi.value} srLabel={`${kpi.label} value`} />
                            </p>
                          </div>
                          <div
                            className={cn(
                              "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                              getValueBgColor(trendValue),
                            )}
                          >
                            <kpi.icon className={cn("h-5 w-5", getValueColor(trendValue))} />
                          </div>
                        </div>
                        <div className="flex items-end justify-between">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 text-xs cursor-help">
                                {kpi.trend === "up" ? (
                                  <TrendingUp className={cn("h-3 w-3", getValueColor(trendValue))} />
                                ) : (
                                  <TrendingDown className={cn("h-3 w-3", getValueColor(trendValue))} />
                                )}
                                <span className={cn(getValueColor(trendValue))}>
                                  <MaskableValue value={kpi.change} srLabel={`${kpi.label} change`} />
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                vs. last month: <span className="font-mono">{kpi.baselineValue}</span>
                              </p>
                            </TooltipContent>
                          </Tooltip>
                          <Sparkline data={kpi.sparkline} color={getValueColor(trendValue)} />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Click to view details • Last synced: {kpi.lastSynced}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}
    </div>
  )
}
