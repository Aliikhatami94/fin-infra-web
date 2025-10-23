"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Info, Bitcoin, DollarSign, Coins, TrendingUpIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { createStaggeredCardVariants } from "@/lib/motion-variants"

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
  },
]

export function CryptoKPIs() {
  const router = useRouter()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <motion.div key={index} {...createStaggeredCardVariants(index, 0)}>
            <Card
              className={`card-standard ${kpi.clickable ? "cursor-pointer card-lift" : ""}`}
              onClick={() => kpi.clickable && router.push("/crypto/btc")}
            >
              <CardContent className="p-6 min-h-[140px] flex flex-col justify-between">
                <div className="mb-2">
                  <LastSyncBadge timestamp={kpi.lastSynced} source={kpi.source} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{kpi.label}</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{kpi.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p
                    className="text-2xl font-bold tabular-nums text-foreground"
                    aria-label={`${kpi.label} ${kpi.value}`}
                  >
                    {kpi.value}
                  </p>
                  <TooltipProvider>
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
                          vs. yesterday: <span className="font-mono">{kpi.baselineValue}</span>
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
  )
}
