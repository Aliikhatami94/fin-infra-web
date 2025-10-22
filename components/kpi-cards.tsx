"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Wallet, CreditCard, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { MaskableValue } from "@/components/privacy-provider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LastSyncBadge } from "@/components/last-sync-badge"
import Link from "next/link"
import { motion } from "framer-motion"
import { createStaggeredCardVariants, cardHoverVariants } from "@/lib/motion-variants"
import { getValueColor, getValueBgColor } from "@/lib/color-utils"

const kpis = [
  {
    label: "Net Worth",
    value: "$487,234",
    change: "+12.4%",
    baselineValue: "$433,120",
    trend: "up",
    sparkline: [45, 52, 48, 55, 58, 62, 65, 68, 72, 75],
    icon: DollarSign,
    lastSynced: "2 minutes ago",
    source: "Plaid",
  },
  {
    label: "Investable Assets",
    value: "$324,891",
    change: "+8.2%",
    baselineValue: "$300,234",
    trend: "up",
    sparkline: [30, 35, 32, 38, 42, 45, 48, 52, 55, 58],
    icon: Wallet,
    lastSynced: "2 minutes ago",
    source: "Plaid",
  },
  {
    label: "Cash Available",
    value: "$52,180",
    change: "-2.1%",
    baselineValue: "$53,300",
    trend: "down",
    sparkline: [60, 58, 55, 54, 52, 50, 48, 47, 45, 44],
    icon: DollarSign,
    lastSynced: "5 minutes ago",
    source: "Teller",
  },
  {
    label: "Debt Balance",
    value: "$18,500",
    change: "-5.3%",
    baselineValue: "$19,540",
    trend: "down",
    sparkline: [25, 24, 23, 22, 20, 19, 18, 17, 16, 15],
    icon: CreditCard,
    lastSynced: "1 hour ago",
    source: "Plaid",
  },
  {
    label: "Today's P/L",
    value: "+$2,847",
    change: "+1.8%",
    baselineValue: "$2,797",
    trend: "up",
    sparkline: [0, 2, 1, 3, 5, 4, 6, 7, 8, 9],
    icon: Activity,
    lastSynced: "Just now",
    source: "Live",
  },
  {
    label: "Credit Score",
    value: "785",
    change: "+12 pts",
    baselineValue: "773",
    trend: "up",
    sparkline: [70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
    icon: Activity,
    lastSynced: "1 week ago",
    source: "Experian",
  },
]

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
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi, index) => (
        <TooltipProvider key={kpi.label}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={kpi.label === "Net Worth" ? "/net-worth-detail" : "#"}>
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
                            getValueBgColor(kpi.trend),
                          )}
                        >
                          <kpi.icon className={cn("h-5 w-5", getValueColor(kpi.trend))} />
                        </div>
                      </div>
                      <div className="flex items-end justify-between">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 text-xs cursor-help">
                              {kpi.trend === "up" ? (
                                <TrendingUp className={cn("h-3 w-3", getValueColor(kpi.trend))} />
                              ) : (
                                <TrendingDown className={cn("h-3 w-3", getValueColor(kpi.trend))} />
                              )}
                              <span className={cn(getValueColor(kpi.trend))}>
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
                        <Sparkline data={kpi.sparkline} color={getValueColor(kpi.trend)} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Last synced: {kpi.lastSynced}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}
