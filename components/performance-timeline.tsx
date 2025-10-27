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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const BENCHMARKS = {
  SPY: { label: "S&P 500 (SPY)", drift: 280, volatility: 900, color: "hsl(210, 16%, 55%)" },
  QQQ: { label: "Nasdaq 100 (QQQ)", drift: 340, volatility: 1100, color: "hsl(271, 91%, 65%)" },
  VT: { label: "Global Market (VT)", drift: 230, volatility: 750, color: "hsl(25, 95%, 60%)" },
} as const

type BenchmarkKey = keyof typeof BENCHMARKS

type TimelinePoint = {
  index: number
  date: string
  portfolio: number
  planned: number
} & Record<BenchmarkKey, number>

const generateData = (days: number): TimelinePoint[] => {
  const data: TimelinePoint[] = []
  let actual = 100000
  let planned = 98000
  const benchmarkState = Object.fromEntries(
    (Object.keys(BENCHMARKS) as BenchmarkKey[]).map((key) => [key, 100000]),
  ) as Record<BenchmarkKey, number>

  const now = Date.now()
  
  for (let i = 0; i < days; i++) {
    actual += (Math.random() - 0.45) * 1000
    planned += 320
    
    // Calculate date going backwards from now
    const dateMs = now - (days - i - 1) * 24 * 60 * 60 * 1000
    const date = new Date(dateMs)
    
    const point: TimelinePoint = {
      index: i,
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      portfolio: actual,
      planned,
      SPY: benchmarkState.SPY,
      QQQ: benchmarkState.QQQ,
      VT: benchmarkState.VT,
    }

    for (const key of Object.keys(BENCHMARKS) as BenchmarkKey[]) {
      const { drift, volatility } = BENCHMARKS[key]
      benchmarkState[key] += drift + (Math.random() - 0.5) * volatility
      point[key] = benchmarkState[key]
    }

    data.push(point)
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
  const [benchmark, setBenchmark] = useState<BenchmarkKey | null>(null)
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
          <div className="flex flex-wrap items-center gap-2">
            {latestPoint && (
              <Badge variant={planDelta >= 0 ? "secondary" : "outline"} className="hidden sm:inline-flex text-xs">
                {planDelta >= 0 ? "Ahead of plan" : "Behind plan"}
              </Badge>
            )}
            <Select
              value={benchmark ?? undefined}
              onValueChange={(value) => setBenchmark(value as BenchmarkKey)}
            >
              <SelectTrigger size="sm" aria-label="Overlay benchmark">
                <SelectValue placeholder="Overlay benchmark" />
              </SelectTrigger>
              <SelectContent align="end">
                {(Object.keys(BENCHMARKS) as BenchmarkKey[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {BENCHMARKS[key].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {benchmark && (
              <Button variant="ghost" size="sm" onClick={() => setBenchmark(null)}>
                Clear overlay
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={data} 
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
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
                domain={['dataMin - 5000', 'dataMax + 5000']}
              />
              <Tooltip
                cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '3 3' }}
                animationDuration={150}
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) {
                    return null
                  }
                  
                  // Get the data directly from the payload
                  const dataPoint = payload[0].payload as TimelinePoint
                  
                  return (
                    <div className="rounded-lg border bg-card p-3 shadow-sm">
                      <p className="text-xs text-muted-foreground mb-1">{dataPoint.date}</p>
                      <p className="text-sm font-medium">
                        Portfolio: ${Number(dataPoint.portfolio).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Plan: ${Number(dataPoint.planned).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      {benchmark && dataPoint[benchmark] != null && (
                        <p className="text-sm text-muted-foreground">
                          {BENCHMARKS[benchmark].label}: ${Number(dataPoint[benchmark]).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      )}
                    </div>
                  )
                }}
              />
              <Area
                type="monotone"
                dataKey="portfolio"
                stroke="hsl(210, 100%, 60%)"
                strokeWidth={2}
                fill="url(#portfolioGradient)"
                activeDot={{ r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
              />
              <Line
                type="monotone"
                dataKey="planned"
                stroke="hsl(210, 16%, 65%)"
                strokeWidth={1.5}
                strokeDasharray="6 4"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
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
              {benchmark && (
                <Line
                  type="monotone"
                  dataKey={benchmark}
                  stroke={BENCHMARKS[benchmark].color}
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground space-y-3">
            <p>{summary}</p>
            {benchmark && (
              <div className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: BENCHMARKS[benchmark].color }}
                  aria-hidden
                />
                <span>
                  Comparing against <span className="font-medium text-foreground">{BENCHMARKS[benchmark].label}</span> overlay.
                </span>
              </div>
            )}
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
