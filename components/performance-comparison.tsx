"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Brush, CartesianGrid } from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="spyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `${value}%`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-card p-3 shadow-lg">
                        <p className="text-xs text-muted-foreground mb-2">{payload[0].payload.date}</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs font-medium">Portfolio:</span>
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                              {payload[0].value}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs font-medium">SPY:</span>
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">
                              {payload[1].value}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 pt-1 border-t">
                            <span className="text-xs font-medium">Outperformance:</span>
                            <span className="text-sm font-bold text-foreground">
                              +{((payload[0].value as number) - (payload[1].value as number)).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="portfolio"
                stroke="hsl(217, 91%, 60%)"
                strokeWidth={2}
                fill="url(#portfolioGradient)"
                name="Portfolio"
              />
              <Area
                type="monotone"
                dataKey="spy"
                stroke="hsl(142, 76%, 45%)"
                strokeWidth={2}
                fill="url(#spyGradient)"
                name="SPY"
              />
              <Brush dataKey="date" height={30} stroke="hsl(var(--primary))" />
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
