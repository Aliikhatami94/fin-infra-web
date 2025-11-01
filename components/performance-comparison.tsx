"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts"
import type { TooltipProps } from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartGrid, ThemedAxis, TooltipCard } from "@/components/chart-kit"
import { LINE_CHART_COLORS, BAR_CHART_PRESETS } from "@/lib/chart-colors"

const performanceData = [
  { date: "Jan", portfolio: 100, spy: 100 },
  { date: "Feb", portfolio: 103, spy: 102 },
  { date: "Mar", portfolio: 107, spy: 104 },
  { date: "Apr", portfolio: 105, spy: 103 },
  { date: "May", portfolio: 110, spy: 106 },
  { date: "Jun", portfolio: 115, spy: 108 },
  { date: "Jul", portfolio: 118, spy: 110 },
  { date: "Aug", portfolio: 116, spy: 109 },
  { date: "Sep", portfolio: 120, spy: 111 },
  { date: "Oct", portfolio: 125, spy: 113 },
  { date: "Nov", portfolio: 128, spy: 115 },
  { date: "Dec", portfolio: 132, spy: 117 },
]

export function PerformanceComparison() {
  const [timeframe, setTimeframe] = useState("1Y")

  return (
    <Card className="card-standard">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Performance vs SPY</CardTitle>
          <Tabs value={timeframe} onValueChange={setTimeframe}>
            <TabsList className="h-8">
              <TabsTrigger value="1M" className="text-xs">
                1M
              </TabsTrigger>
              <TabsTrigger value="3M" className="text-xs">
                3M
              </TabsTrigger>
              <TabsTrigger value="6M" className="text-xs">
                6M
              </TabsTrigger>
              <TabsTrigger value="1Y" className="text-xs">
                1Y
              </TabsTrigger>
              <TabsTrigger value="ALL" className="text-xs">
                ALL
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <ResponsiveContainer width="100%" height={360} minWidth={320}>
            <AreaChart data={performanceData} margin={{ top: 12, right: 16, left: 0, bottom: 12 }}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BAR_CHART_PRESETS.performance.portfolio} stopOpacity={0.24} />
                  <stop offset="95%" stopColor={BAR_CHART_PRESETS.performance.portfolio} stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="spyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BAR_CHART_PRESETS.performance.benchmark} stopOpacity={0.24} />
                  <stop offset="95%" stopColor={BAR_CHART_PRESETS.performance.benchmark} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <ChartGrid />
              <ThemedAxis axis="x" dataKey="date" dy={8} />
              <ThemedAxis axis="y" tickFormatter={(value) => `${value}%`} />
              <Tooltip
                cursor={{ stroke: "hsl(var(--border))", strokeDasharray: "4 4", strokeWidth: 1 }}
                content={(props: TooltipProps<number, string>) => (
                  <TooltipCard
                    {...props}
                    labelFormatter={(label) => label}
                    valueFormatter={(value, _name) => `${value}%`}
                    footer={(payload) => {
                      if (!payload || payload.length < 2) return null
                      const portfolioValue = payload[0].value as number
                      const spyValue = payload[1].value as number
                      const outperformance = portfolioValue - spyValue
                      return (
                        <div className="flex items-center justify-between gap-3 pt-1 border-t border-border/50">
                          <span className="text-xs font-medium">Outperformance:</span>
                          <span className="text-sm font-semibold tabular-nums">
                            {outperformance >= 0 ? "+" : ""}{outperformance.toFixed(1)}%
                          </span>
                        </div>
                      )
                    }}
                  />
                )}
              />
              <Area
                type="monotone"
                dataKey="portfolio"
                stroke={BAR_CHART_PRESETS.performance.portfolio}
                strokeWidth={2}
                fill="url(#portfolioGradient)"
                fillOpacity={1}
                name="portfolio"
              />
              <Area
                type="monotone"
                dataKey="spy"
                stroke={BAR_CHART_PRESETS.performance.benchmark}
                strokeWidth={2}
                fill="url(#spyGradient)"
                fillOpacity={1}
                name="spy"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-600 dark:bg-blue-400" />
            <span className="text-sm text-muted-foreground">Your Portfolio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-600 dark:bg-green-400" />
            <span className="text-sm text-muted-foreground">S&P 500 (SPY)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
