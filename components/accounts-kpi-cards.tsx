"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { MaskableValue } from "@/components/privacy-provider"
import { Wallet, CreditCard, TrendingUp, TrendingDown } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { MicroSparkline } from "@/components/ui/micro-sparkline"
import { KPIIcon } from "@/components/ui/kpi-icon"
import type { SemanticTone } from "@/lib/color-utils"

interface AccountsKPICardsProps {
  totalCash: number
  totalCreditDebt: number
  totalInvestments: number
}

const createSparklineSeries = (currentValue: number, baselineValue: number) => {
  const totalPoints = 30
  const delta = currentValue - baselineValue
  const amplitude = Math.abs(delta) * 0.2

  return Array.from({ length: totalPoints }, (_, index) => {
    const progress = index / (totalPoints - 1)
    const base = baselineValue + delta * progress
    const wave = Math.sin(progress * Math.PI * 2) * amplitude * 0.25
    const value = base + wave
    return Number(value.toFixed(2))
  })
}

export function AccountsKPICards({ totalCash, totalCreditDebt, totalInvestments }: AccountsKPICardsProps) {
  const kpis: Array<{
    title: string
    value: number
    trend: number
    baselineValue: number
    icon: LucideIcon
    tone: SemanticTone
    sparklineColor: string
    lastSynced: string
    source: string
  }> = [
    {
      title: "Total Cash",
      value: totalCash,
      trend: 2.3,
      baselineValue: totalCash / 1.023,
      icon: Wallet,
      tone: "info",
      sparklineColor: "rgb(37, 99, 235)",
      lastSynced: "3 min ago",
      source: "Plaid",
    },
    {
      title: "Total Credit Debt",
      value: totalCreditDebt,
      trend: -1.2,
      baselineValue: totalCreditDebt / 0.988,
      icon: CreditCard,
      tone: "negative",
      sparklineColor: "rgb(220, 38, 38)",
      lastSynced: "3 min ago",
      source: "Plaid",
    },
    {
      title: "Total Investments",
      value: totalInvestments,
      trend: 5.1,
      baselineValue: totalInvestments / 1.051,
      icon: TrendingUp,
      tone: "positive",
      sparklineColor: "rgb(22, 163, 74)",
      lastSynced: "5 min ago",
      source: "Teller",
    },
  ]

  return (
    <TooltipProvider>
      <div className="grid gap-4 md:grid-cols-3">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon
          const sparklineData = createSparklineSeries(kpi.value, kpi.baselineValue)

          return (
            <motion.div key={kpi.title} {...createStaggeredCardVariants(index, 0)}>
              <Card className="card-standard card-lift">
                <CardContent className="p-6 min-h-[140px] flex flex-col justify-between">
                  <div className="mb-2">
                    <LastSyncBadge timestamp={kpi.lastSynced} source={kpi.source} />
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{kpi.title}</p>
                      <p className="text-2xl font-bold tracking-tight tabular-nums font-mono break-words">
                        <MaskableValue
                          value={`$${Math.abs(kpi.value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                          srLabel={`${kpi.title} value`}
                        />
                      </p>
                    </div>
                    <KPIIcon icon={Icon} tone={kpi.tone} />
                  </div>
                  <div className="flex items-end justify-between">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors cursor-help text-xs"
                          aria-label={`${kpi.trend > 0 ? '+' : ''}${kpi.trend}% vs. last month`}
                        >
                          {kpi.trend > 0 ? (
                            <TrendingUp className="h-3 w-3 text-[var(--color-positive)]" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-[var(--color-negative)]" />
                          )}
                          <span
                            className={`font-medium ${kpi.trend > 0 ? "text-[var(--color-positive)]" : "text-[var(--color-negative)]"}`}
                          >
                            {kpi.trend > 0 ? "+" : ""}
                            {kpi.trend}%
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          vs. last month:{" "}
                          <span className="font-mono">
                            ${Math.abs(kpi.baselineValue).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <MicroSparkline
                      data={sparklineData}
                      color={kpi.sparklineColor}
                      ariaLabel={`${kpi.title} 30-day trend sparkline`}
                      className="h-9 w-24"
                    />
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
