"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

const kpis = [
  { label: "Total Value", value: "$187,650.45", change: "+5.7%", positive: true },
  { label: "1-Day P/L", value: "+$2,340.12", change: "+1.3%", positive: true },
  { label: "YTD Return", value: "+18.4%", change: "+2.1%", positive: true },
  { label: "Sharpe Ratio", value: "1.42", change: "+0.08", positive: true },
]

export function PortfolioKPIs() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="text-2xl font-bold tabular-nums text-foreground">{kpi.value}</p>
              <div className="flex items-center gap-1">
                {kpi.positive ? (
                  <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                )}
                <span
                  className={`text-xs font-medium tabular-nums ${
                    kpi.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {kpi.change}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
