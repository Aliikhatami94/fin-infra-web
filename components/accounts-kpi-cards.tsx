"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { MaskableValue } from "@/components/privacy-provider"
import { Wallet, CreditCard, TrendingUp, TrendingDown } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { createStaggeredCardVariants } from "@/lib/motion-variants"

interface AccountsKPICardsProps {
  totalCash: number
  totalCreditDebt: number
  totalInvestments: number
}

const generateSparklineData = (trend: number) => {
  const points = 7
  const data = []
  for (let i = 0; i < points; i++) {
    const value = 50 + Math.random() * 20 + (trend > 0 ? i * 2 : -i * 2)
    data.push(value)
  }
  return data
}

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

export function AccountsKPICards({ totalCash, totalCreditDebt, totalInvestments }: AccountsKPICardsProps) {
  const kpis = [
    {
      title: "Total Cash",
      value: totalCash,
      trend: 2.3,
      baselineValue: totalCash / 1.023,
      icon: Wallet,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
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
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-500/10",
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
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
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
          const sparklineData = generateSparklineData(kpi.trend)

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
                      <p className="text-2xl font-bold tracking-tight tabular-nums font-mono truncate">
                        <MaskableValue
                          value={`$${Math.abs(kpi.value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                          srLabel={`${kpi.title} value`}
                        />
                      </p>
                    </div>
                    <div className={`h-10 w-10 rounded-lg ${kpi.bgColor} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-5 w-5 ${kpi.color}`} />
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-xs cursor-help">
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
                        </div>
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
                    <Sparkline data={sparklineData} color={kpi.sparklineColor} />
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
