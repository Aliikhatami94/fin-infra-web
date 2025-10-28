"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MaskableValue } from "@/components/privacy-provider"
import { TrendingUp, TrendingDown, Info, DollarSign, TrendingUpIcon, Activity, Target } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { motion } from "framer-motion"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { RiskMetricModal } from "@/components/risk-metric-modal"
import { KPIIcon } from "@/components/ui/kpi-icon"

type RiskMetricKey = "sharpe" | "beta" | "volatility"

interface KPI {
  label: string
  value: string
  change: string
  baselineValue: string
  positive: boolean
  tooltip: string
  icon: LucideIcon
  lastSynced: string
  source: string
}

const kpis: KPI[] = [
  {
    label: "Total Value",
    value: "$187,650.45",
    change: "+5.7%",
    baselineValue: "$177,520.30",
    positive: true,
    tooltip: "All-time return since account inception",
    icon: DollarSign,
    lastSynced: "Just now",
    source: "Live",
  },
  {
    label: "All-Time P/L",
    value: "+$24,650.45",
    change: "+15.1%",
    baselineValue: "$21,420.10",
    positive: true,
    tooltip: "Total profit/loss since you started investing",
    icon: TrendingUpIcon,
    lastSynced: "Just now",
    source: "Live",
  },
  {
    label: "Sharpe Ratio",
    value: "1.85",
    change: "+0.12",
    baselineValue: "1.73",
    positive: true,
    tooltip: "Risk-adjusted return metric. Higher is better (>1 is good, >2 is excellent)",
    icon: Target,
    lastSynced: "5 min ago",
    source: "Calculated",
  },
  {
    label: "Beta",
    value: "0.92",
    change: "-0.05",
    baselineValue: "0.97",
    positive: true,
    tooltip: "Volatility relative to market (SPY). <1 means less volatile than market",
    icon: Activity,
    lastSynced: "5 min ago",
    source: "Calculated",
  },
  {
    label: "Volatility",
    value: "14.2%",
    change: "-1.3%",
    baselineValue: "15.5%",
    positive: true,
    tooltip: "Standard deviation of returns. Lower is less risky",
    icon: Activity,
    lastSynced: "5 min ago",
    source: "Calculated",
  },
  {
    label: "YTD Return",
    value: "+18.4%",
    change: "+2.1%",
    baselineValue: "+16.3%",
    positive: true,
    tooltip: "Year-to-date return since January 1st",
    icon: TrendingUp,
    lastSynced: "Just now",
    source: "Live",
  },
]

const riskMetricLabelToKey: Record<string, RiskMetricKey> = {
  "Sharpe Ratio": "sharpe",
  Beta: "beta",
  Volatility: "volatility",
}

export function PortfolioKPIs() {
  const [selectedMetric, setSelectedMetric] = useState<RiskMetricKey | null>(null)

  return (
    <TooltipProvider>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon
          const metricKey = riskMetricLabelToKey[kpi.label]
          const isRiskMetric = metricKey !== undefined

          return (
            <motion.div key={index} {...createStaggeredCardVariants(index, 0)} className="h-full">
              <Card
                className={`card-standard card-lift h-full min-h-[280px] ${isRiskMetric ? "cursor-pointer" : ""}`}
                onClick={() => {
                  if (metricKey) {
                    setSelectedMetric(metricKey)
                  }
                }}
              >
                <CardContent className="flex flex-col h-full gap-3 p-6">
                  <div className="flex items-start justify-between gap-2">
                    <LastSyncBadge timestamp={kpi.lastSynced} source={kpi.source} />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        <p className="text-label-xs text-muted-foreground">{kpi.label}</p>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors"
                                aria-label={`More information about ${kpi.label}`}
                              >
                                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-label-xs font-normal max-w-xs">{kpi.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <KPIIcon icon={Icon} tone="info" />
                    </div>
                    <p className="text-kpi font-semibold font-tabular text-foreground">
                      <MaskableValue value={kpi.value} srLabel={`${kpi.label} value`} className="font-tabular" />
                    </p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="delta-chip text-delta font-medium rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors cursor-help"
                            aria-label={`${kpi.change} vs. last month`}
                          >
                            {kpi.positive ? (
                              <TrendingUp className="h-3 w-3 text-[var(--color-positive)]" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-[var(--color-negative)]" />
                            )}
                            <span
                              className={`text-delta font-medium font-tabular ${
                                kpi.positive ? "text-[var(--color-positive)]" : "text-[var(--color-negative)]"
                              }`}
                            >
                              <MaskableValue value={kpi.change} className="font-tabular" />
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-label-xs font-normal">
                            vs. last month: <span className="font-mono">{kpi.baselineValue}</span>
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
      <RiskMetricModal
        open={!!selectedMetric}
        onOpenChange={(open) => !open && setSelectedMetric(null)}
        metric={selectedMetric}
      />
    </TooltipProvider>
  )
}
