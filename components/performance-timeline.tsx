"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, ReferenceDot } from "recharts"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useDateRange } from "@/components/date-range-provider"
import { usePersona } from "@/components/persona-provider"
import { summarizeTimelinePerformance } from "@/lib/insights/service"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock } from "lucide-react"

const generateData = (days: number) => {
  const data = []
  let actual = 100000
  let planned = 98000
  for (let i = 0; i < days; i++) {
    actual += (Math.random() - 0.45) * 1000
    planned += 320
    data.push({
      date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      portfolio: actual,
      planned,
      benchmark: 100000 + i * 300,
    })
  }
  return data
}

const milestoneBlueprint = [
  {
    id: "safety",
    fraction: 0.25,
    label: "Emergency fund halfway",
    annotation: "Cash buffer cleared the $50k mark",
  },
  {
    id: "debt",
    fraction: 0.55,
    label: "Debt payoff gain",
    annotation: "Autopay acceleration saved 3 months",
  },
  {
    id: "growth",
    fraction: 0.85,
    label: "Portfolio outpaces plan",
    annotation: "Investments beat the 12M target",
  },
]

export function PerformanceTimeline() {
  const [showBenchmark, setShowBenchmark] = useState(false)
  const { dateRange } = useDateRange()
  const { persona } = usePersona()

  const data = useMemo(() => {
    const daysMap = {
      "1D": 1,
      "5D": 5,
      "1M": 30,
      "6M": 180,
      YTD: Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)),
      "1Y": 365,
      ALL: 730,
    }
    return generateData(daysMap[dateRange])
  }, [dateRange])

  const milestones = useMemo(() => {
    if (!data.length) return []
    return milestoneBlueprint.map((milestone) => {
      const index = Math.min(data.length - 1, Math.max(0, Math.round((data.length - 1) * milestone.fraction)))
      const point = data[index]
      const achieved = point.portfolio >= point.planned
      return {
        ...milestone,
        index,
        point,
        achieved,
      }
    })
  }, [data])

  const summary = useMemo(() => {
    const points = data.map((point) => ({ actual: point.portfolio, planned: point.planned }))
    return summarizeTimelinePerformance({
      points,
      persona,
      milestoneHits: milestones.filter((milestone) => milestone.achieved).length,
    })
  }, [data, milestones, persona])

  const latestPoint = data.at(-1)
  const planDelta = latestPoint ? latestPoint.portfolio - latestPoint.planned : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Performance Timeline</CardTitle>
          <div className="flex items-center gap-2">
            {latestPoint && (
              <Badge variant={planDelta >= 0 ? "secondary" : "outline"} className="hidden sm:inline-flex text-xs">
                {planDelta >= 0 ? "Ahead of plan" : "Behind plan"}
              </Badge>
            )}
            <Button
              variant={showBenchmark ? "default" : "outline"}
              size="sm"
              onClick={() => setShowBenchmark(!showBenchmark)}
            >
              {showBenchmark ? "Hide SPY" : "Compare to SPY"}
            </Button>
          </div>
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
                interval={Math.floor(data.length / 6)}
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
                    const portfolioValue = payload.find((item) => item.dataKey === "portfolio")?.value
                    const plannedValue = payload.find((item) => item.dataKey === "planned")?.value
                    const benchmarkValue = payload.find((item) => item.dataKey === "benchmark")?.value
                    return (
                      <div className="rounded-lg border bg-card p-3 shadow-sm">
                        <p className="text-xs text-muted-foreground mb-1">{payload[0].payload.date}</p>
                        <p className="text-sm font-medium">
                          Portfolio: ${Number(portfolioValue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Plan: ${Number(plannedValue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        {showBenchmark && benchmarkValue != null && (
                          <p className="text-sm text-muted-foreground">
                            SPY: ${Number(benchmarkValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </p>
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
              <Line
                type="monotone"
                dataKey="planned"
                stroke="hsl(210, 16%, 65%)"
                strokeWidth={1.5}
                strokeDasharray="6 4"
                dot={false}
              />
              {milestones.map((milestone) => (
                <ReferenceDot
                  key={milestone.id}
                  x={milestone.point.date}
                  y={milestone.point.planned}
                  r={milestone.achieved ? 6 : 5}
                  fill={milestone.achieved ? "hsl(142, 76%, 45%)" : "hsl(var(--muted-foreground))"}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                />
              ))}
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
        <div className="mt-4 grid gap-4 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
            {summary}
          </div>
          <div className="space-y-2">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-start gap-2 text-xs">
                {milestone.achieved ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                ) : (
                  <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-foreground">{milestone.label}</p>
                  <p className="text-muted-foreground">{milestone.annotation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
