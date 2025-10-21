"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Line } from "recharts"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const generateData = () => {
  const data = []
  let value = 100000
  for (let i = 0; i < 365; i++) {
    value += (Math.random() - 0.45) * 1000
    data.push({
      date: new Date(2024, 0, i + 1).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      portfolio: value,
      benchmark: 100000 + i * 300,
    })
  }
  return data
}

export function PerformanceTimeline() {
  const [showBenchmark, setShowBenchmark] = useState(false)
  const data = generateData()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Performance Timeline</CardTitle>
          <Button
            variant={showBenchmark ? "default" : "outline"}
            size="sm"
            onClick={() => setShowBenchmark(!showBenchmark)}
          >
            Compare to SPY
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(210, 100%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(210, 100%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                interval={60}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-card p-3 shadow-sm">
                        <p className="text-xs text-muted-foreground">{payload[0].payload.date}</p>
                        <p className="text-sm font-medium">Portfolio: ${payload[0].value?.toLocaleString()}</p>
                        {showBenchmark && payload[1] && (
                          <p className="text-sm text-muted-foreground">SPY: ${payload[1].value?.toLocaleString()}</p>
                        )}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="portfolio"
                stroke="hsl(210, 100%, 60%)"
                strokeWidth={2}
                fill="url(#portfolioGradient)"
              />
              {showBenchmark && (
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  stroke="hsl(0, 0%, 60%)"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
