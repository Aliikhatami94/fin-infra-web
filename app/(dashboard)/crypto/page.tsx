"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { CryptoKPIs } from "@/components/crypto-kpis"
import { CryptoTable } from "@/components/crypto-table"
import { CryptoRiskSection } from "@/components/crypto-risk-section"
import { CryptoAIInsights } from "@/components/crypto-ai-insights"
import { ExchangeAnalytics } from "@/components/exchange-analytics"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  BadgePercent,
  Coins,
  Fuel,
  Layers3,
  Plus,
  ShieldCheck,
} from "lucide-react"
import { ChartCardSkeleton } from "@/components/chart-skeleton"
import type { CryptoChartProps } from "@/components/crypto-chart"
import { ErrorBoundary } from "@/components/error-boundary"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const CryptoChart = dynamic<CryptoChartProps>(
  () => import("@/components/crypto-chart").then((mod) => mod.CryptoChart),
  {
    ssr: false,
    loading: () => <ChartCardSkeleton title="Portfolio Value Over Time" contentHeight="h-[350px]" />,
  },
)

export default function CryptoPage() {
  const [selectedExchange, setSelectedExchange] = useState<"All" | "Coinbase" | "Binance">("All")
  const [showStablecoins, setShowStablecoins] = useState(false)
  const [groupBy, setGroupBy] = useState<"asset" | "exchange" | "staking">("asset")

  const handleStablecoinHover = () => {
    void import("@/components/crypto-table")
  }

  const groupByOptions: Array<{
    value: typeof groupBy
    label: string
    description: string
    icon: typeof Layers3
  }> = [
    {
      value: "asset",
      label: "By asset",
      description: "Coin level allocation",
      icon: Layers3,
    },
    {
      value: "exchange",
      label: "By exchange",
      description: "Wallet & custodian",
      icon: Coins,
    },
    {
      value: "staking",
      label: "By staking",
      description: "Yield vs. idle",
      icon: ShieldCheck,
    },
  ]

  return (
    <>
      {/* Sticky compact Header */}
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-3">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl md:text-2xl font-semibold text-foreground">Crypto</h1>
          </div>
        </div>
      </div>

      {/* Body */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10 py-6 space-y-6">
          {/* Exchange filter chips and gas indicator moved below header to reduce header height */}
          <div className="flex flex-wrap items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Exchange:</span>
                    {(["All", "Coinbase", "Binance"] as const).map((exchange) => (
                      <Button
                        key={exchange}
                        variant={selectedExchange === exchange ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedExchange(exchange)}
                        className="h-8"
                      >
                        {exchange}
                      </Button>
                    ))}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Filter table and chart by exchange</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
              <Fuel className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs">Gas: 25 gwei</span>
            </Badge>
          </div>

        <div
          className="flex flex-wrap items-center gap-2"
          role="toolbar"
          aria-label="Crypto grouping controls"
        >
          {groupByOptions.map((option) => {
            const Icon = option.icon
            const isActive = groupBy === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setGroupBy(option.value)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2 text-left shadow-xs transition",
                  "hover:border-primary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive
                    ? "border-primary/80 bg-primary/10 text-foreground"
                    : "border-border/80 bg-card/80 text-muted-foreground",
                )}
                aria-pressed={isActive}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")}
                  aria-hidden="true"
                />
                <span className="flex flex-col leading-tight">
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    {option.label}
                  </span>
                  <span className="text-[0.7rem] text-muted-foreground">
                    {option.description}
                  </span>
                </span>
              </button>
            )
          })}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-4 py-2 text-sm shadow-xs transition",
                    "hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    showStablecoins
                      ? "border-primary/80 bg-primary/10 text-foreground"
                      : "border-border/80 bg-card/80 text-muted-foreground",
                  )}
                  onMouseEnter={handleStablecoinHover}
                  onClick={() => setShowStablecoins((prev) => !prev)}
                  aria-pressed={showStablecoins}
                >
                  <BadgePercent className={cn("h-4 w-4", showStablecoins ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                  {showStablecoins ? "Stablecoins included" : "Stablecoins hidden"}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs font-medium">Toggle stablecoins</p>
                <p className="text-xs text-muted-foreground">USDT, USDC, DAI, etc.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

          <CryptoKPIs />
          <ErrorBoundary feature="Crypto insights">
            <CryptoAIInsights />
          </ErrorBoundary>
          <CryptoChart showStablecoins={showStablecoins} onToggleStablecoins={setShowStablecoins} />
          <ExchangeAnalytics selectedExchange={selectedExchange} />
          <CryptoTable
            selectedExchange={selectedExchange}
            showStablecoins={showStablecoins}
            groupBy={groupBy}
          />
          <CryptoRiskSection />
        </div>
      </motion.div>

      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-lg md:hidden z-50 h-14 w-14 p-0"
        aria-label="Buy crypto"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </>
  )
}
