"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Info, DollarSign, TrendingUpIcon, Activity, Target } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { motion } from "framer-motion"
import { createStaggeredCardVariants } from "@/lib/motion-variants"

const kpis = [
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

export function PortfolioKPIs() {
  return (
    <TooltipProvider>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <motion.div key={index} {...createStaggeredCardVariants(index, 0)}>
              <Card className="card-standard card-lift">
                <CardContent className="p-6 min-h-[140px] flex flex-col justify-between">
                  <div className="mb-2">
                    <LastSyncBadge timestamp={kpi.lastSynced} source={kpi.source} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs text-muted-foreground">{kpi.label}</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">{kpi.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold tabular-nums text-foreground">{kpi.value}</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-help">
                          {kpi.positive ? (
                            <TrendingUp className="h-3 w-3 text-[var(--color-positive)]" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-[var(--color-negative)]" />
                          )}
                          <span
                            className={`text-xs font-medium tabular-nums ${
                              kpi.positive ? "text-[var(--color-positive)]" : "text-[var(--color-negative)]"
                            }`}
                          >
                            {kpi.change}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          vs. last month: <span className="font-mono">{kpi.baselineValue}</span>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
