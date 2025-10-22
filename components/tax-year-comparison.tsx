"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react"

const comparisonData = {
  2025: {
    liability: 18450,
    capitalGains: 12340,
    dividends: 2850,
    paid: 16000,
  },
  2024: {
    liability: 16200,
    capitalGains: 9800,
    dividends: 2400,
    paid: 16200,
  },
}

export function TaxYearComparison() {
  const calculateChange = (current: number, previous: number) => {
    const change = current - previous
    const percentChange = ((change / previous) * 100).toFixed(1)
    return { change, percentChange, isIncrease: change > 0 }
  }

  const liabilityChange = calculateChange(comparisonData[2025].liability, comparisonData[2024].liability)
  const gainsChange = calculateChange(comparisonData[2025].capitalGains, comparisonData[2024].capitalGains)
  const dividendsChange = calculateChange(comparisonData[2025].dividends, comparisonData[2024].dividends)

  return (
    <Card className="card-standard card-lift">
      <CardHeader>
        <CardTitle>Tax Year Comparison: 2025 vs 2024</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Estimated Tax Liability</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1">
                <p className="text-xs text-muted-foreground">2024</p>
                <p className="text-2xl font-bold tabular-nums">${comparisonData[2024].liability.toLocaleString()}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-xs text-muted-foreground">2025</p>
                <p className="text-2xl font-bold tabular-nums">${comparisonData[2025].liability.toLocaleString()}</p>
              </div>
              <Badge
                variant="secondary"
                className={`${
                  liabilityChange.isIncrease
                    ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                    : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                }`}
              >
                {liabilityChange.isIncrease ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {liabilityChange.isIncrease ? "+" : ""}
                {liabilityChange.percentChange}%
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Capital Gains</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1">
                <p className="text-xs text-muted-foreground">2024</p>
                <p className="text-xl font-semibold tabular-nums">
                  ${comparisonData[2024].capitalGains.toLocaleString()}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-xs text-muted-foreground">2025</p>
                <p className="text-xl font-semibold tabular-nums">
                  ${comparisonData[2025].capitalGains.toLocaleString()}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={`${
                  gainsChange.isIncrease
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                }`}
              >
                {gainsChange.isIncrease ? "+" : ""}
                {gainsChange.percentChange}%
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Dividends</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1">
                <p className="text-xs text-muted-foreground">2024</p>
                <p className="text-xl font-semibold tabular-nums">${comparisonData[2024].dividends.toLocaleString()}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-xs text-muted-foreground">2025</p>
                <p className="text-xl font-semibold tabular-nums">${comparisonData[2025].dividends.toLocaleString()}</p>
              </div>
              <Badge
                variant="secondary"
                className={`${
                  dividendsChange.isIncrease
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                }`}
              >
                {dividendsChange.isIncrease ? "+" : ""}
                {dividendsChange.percentChange}%
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
