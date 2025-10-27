"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MaskableValue } from "@/components/privacy-provider"
import {
  TrendingUp,
  TrendingDown,
  Info,
  Bitcoin,
  DollarSign,
  Coins,
  TrendingUpIcon,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { KPIIcon } from "@/components/ui/kpi-icon"

const kpis = [
  {
    label: "Total Crypto Value",
    value: "$24,580.32",
    change: "+8.4%",
    baselineValue: "$22,680.50",
    positive: true,
    tooltip: "Total value of all crypto holdings",
    icon: DollarSign,
    lastSynced: "Just now",
    source: "Live",
    sparkline: [19800, 20120, 20510, 21240, 22010, 23120, 24580],
  },
  {
    label: "BTC Dominance",
    value: "46.2%",
    change: "+2.1%",
    baselineValue: "44.1%",
    positive: true,
    tooltip: "Bitcoin's share of your total crypto portfolio",
    icon: Bitcoin,
    lastSynced: "Just now",
    source: "Live",
    sparkline: [41.8, 42.6, 43.1, 43.8, 44.2, 45.1, 46.2],
  },
  {
    label: "24h Change",
    value: "+$1,842.50",
    change: "+8.1%",
    baselineValue: "$22,737.82",
    positive: true,
    tooltip: "Total portfolio change in the last 24 hours",
    icon: TrendingUpIcon,
    lastSynced: "Just now",
    source: "Live",
    sparkline: [0, 240, 380, 760, 1020, 1540, 1842],
  },
  {
    label: "Top Asset Change",
    value: "BTC +9.2%",
    change: "+$2,340",
    baselineValue: "$25,384",
    positive: true,
    clickable: true,
    tooltip: "Your best performing asset in the last 24h",
    icon: Coins,
    lastSynced: "Just now",
    source: "Live",
    sparkline: [21500, 22150, 22420, 22880, 23210, 23640, 23890],
  },
]

const Sparkline = ({ data, positive }: { data: number[]; positive: boolean }) => {
  if (!data.length) return null

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
    <svg
      className="h-12 w-24"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      role="img"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "var(--color-positive)" : "var(--color-negative)"}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CryptoKPIs() {
  const router = useRouter()

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <motion.div key={index} {...createStaggeredCardVariants(index, 0)} className="h-full">
            <Card
              className={`card-standard card-lift h-full ${kpi.clickable ? "cursor-pointer" : ""}`}
              onClick={() => kpi.clickable && router.push("/crypto/btc")}
            >
              <CardContent className="p-6 min-h-[140px] flex h-full flex-col justify-between">
                <div className="mb-2">
                  <LastSyncBadge timestamp={kpi.lastSynced} source={kpi.source} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{kpi.label}</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button 
                              type="button"
                              className="inline-flex items-center justify-center rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors"
                              aria-label={`More information about ${kpi.label}`}
                            >
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{kpi.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <KPIIcon icon={Icon} tone="info" />
                  </div>
                  <p
                    className="text-2xl font-bold tabular-nums text-foreground"
                    aria-label={`${kpi.label} ${kpi.value}`}
                  >
                    <MaskableValue value={kpi.value} srLabel={`${kpi.label} value`} />
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors cursor-help"
                            aria-label={`${kpi.change} vs. yesterday`}
                          >
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
                              <MaskableValue value={kpi.change} />
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            vs. yesterday: <span className="font-mono">{kpi.baselineValue}</span>
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Sparkline data={kpi.sparkline} positive={kpi.positive} />
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
