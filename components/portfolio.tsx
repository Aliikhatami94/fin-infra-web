"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const holdings = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 50, avgPrice: 178.5, currentPrice: 185.75, change: 4.06 },
  { symbol: "MSFT", name: "Microsoft Corp.", shares: 30, avgPrice: 380.2, currentPrice: 385.5, change: 1.39 },
  { symbol: "GOOGL", name: "Alphabet Inc.", shares: 25, avgPrice: 138.9, currentPrice: 142.3, change: 2.45 },
  { symbol: "TSLA", name: "Tesla Inc.", shares: 15, avgPrice: 245.8, currentPrice: 238.5, change: -2.97 },
]

export function Portfolio() {
  const totalValue = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0)
  const totalCost = holdings.reduce((sum, h) => sum + h.shares * h.avgPrice, 0)
  const totalGain = totalValue - totalCost
  const totalGainPercent = ((totalGain / totalCost) * 100).toFixed(2)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">Portfolio</CardTitle>
            <p className="text-sm text-muted-foreground">Total Holdings</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-3xl font-bold tracking-tight font-mono">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p
              className={`text-sm font-semibold ${Number.parseFloat(totalGainPercent) >= 0 ? "text-success" : "text-destructive"}`}
            >
              {Number.parseFloat(totalGainPercent) >= 0 ? "+" : ""}
              {totalGainPercent}% ($
              {totalGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {holdings.map((holding) => {
            const value = holding.shares * holding.currentPrice
            const cost = holding.shares * holding.avgPrice
            const gain = value - cost
            const allocation = (value / totalValue) * 100

            return (
              <div key={holding.symbol} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold text-sm border border-border">
                      {holding.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-base">{holding.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        {holding.shares} shares · ${holding.currentPrice}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold font-mono text-base">
                      ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center justify-end gap-1">
                      {holding.change >= 0 ? (
                        <TrendingUp className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                      )}
                      <p className={`text-sm font-medium ${holding.change >= 0 ? "text-success" : "text-destructive"}`}>
                        {holding.change >= 0 ? "+" : ""}
                        {holding.change}%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Portfolio allocation</span>
                    <span className="font-medium">{allocation.toFixed(1)}%</span>
                  </div>
                  <Progress value={allocation} className="h-1.5" />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
