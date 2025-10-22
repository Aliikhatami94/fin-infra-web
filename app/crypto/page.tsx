"use client"

import { useState } from "react"
import { CryptoKPIs } from "@/components/crypto-kpis"
import { CryptoChart } from "@/components/crypto-chart"
import { CryptoTable } from "@/components/crypto-table"
import { CryptoRiskSection } from "@/components/crypto-risk-section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Fuel } from "lucide-react"

export default function CryptoPage() {
  const [selectedExchange, setSelectedExchange] = useState<"All" | "Coinbase" | "Binance">("All")

  return (
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
      <CryptoChart />
      <CryptoTable selectedExchange={selectedExchange} />
      <CryptoRiskSection />
    </div>
  )
}
