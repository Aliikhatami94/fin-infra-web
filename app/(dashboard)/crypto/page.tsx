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
import { Fuel, Plus } from "lucide-react"
import { ChartCardSkeleton } from "@/components/chart-skeleton"
import type { CryptoChartProps } from "@/components/crypto-chart"

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

  return (
    <>
      <div className="space-y-6 page-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-display font-semibold text-foreground">Crypto</h1>

          <div className="flex flex-wrap items-center gap-3">
            {/* Exchange filter chips */}
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

            {/* Network fees indicator */}
            <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
              <Fuel className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs">Gas: 25 gwei</span>
            </Badge>
          </div>
        </div>

        <CryptoKPIs />
        <CryptoAIInsights />
        <CryptoChart showStablecoins={showStablecoins} onToggleStablecoins={setShowStablecoins} />
        <ExchangeAnalytics selectedExchange={selectedExchange} />
        <CryptoTable selectedExchange={selectedExchange} showStablecoins={showStablecoins} />
        <CryptoRiskSection />
      </div>

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
