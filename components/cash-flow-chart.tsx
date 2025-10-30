"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bar,
  CartesianGrid,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  Cell,
} from "recharts"
import { TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { currencySummaryFormatter, describeTimeSeries } from "@/lib/a11y"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const monthlyData: CashFlowDatum[] = [
  { month: "Jan", inflow: 8500, outflow: 6200, net: 2300 },
  { month: "Feb", inflow: 8500, outflow: 5800, net: 2700 },
  { month: "Mar", inflow: 9200, outflow: 6500, net: 2700 },
  { month: "Apr", inflow: 8500, outflow: 7100, net: 1400 },
  { month: "May", inflow: 8500, outflow: 6800, net: 1700 },
  { month: "Jun", inflow: 10200, outflow: 6400, net: 3800 },
  { month: "Jul", inflow: 8800, outflow: 6300, net: 2500, isProjection: true },
]

const chartConfig = {
  inflow: {
    label: "Income",
    theme: {
      light: "hsl(142, 71%, 45%)",
      dark: "hsl(142, 76%, 55%)",
    },
  },
  outflow: {
    label: "Expenses",
    theme: {
      light: "hsl(0, 72%, 51%)",
      dark: "hsl(0, 72%, 60%)",
    },
  },
  net: {
    label: "Net",
    theme: {
      light: "hsl(221, 83%, 53%)",
      dark: "hsl(221, 83%, 65%)",
    },
  },
} satisfies ChartConfig

interface CashFlowDatum {
  month: string
  inflow: number
  outflow: number
  net: number
  isProjection?: boolean
}

export interface CashFlowChartProps {
  onMonthClick?: (month: string | null) => void
  selectedMonth?: string | null
}

export function CashFlowChart({ onMonthClick, selectedMonth }: CashFlowChartProps) {
  const [period, setPeriod] = useState("month")
  const [account, setAccount] = useState("all")
  const [visibleSeries, setVisibleSeries] = useState<string[]>(["inflow", "outflow", "net"])

  const historicalData = monthlyData.filter((d) => !d.isProjection)
  const _avgNet = historicalData.reduce((sum, d) => sum + d.net, 0) / historicalData.length
  const projectionData = monthlyData.find((d) => d.isProjection)
  const _chartSummary = useMemo(() => {
    const summary = describeTimeSeries({
      data: monthlyData,
      metric: "Monthly net cash flow",
      getLabel: (point) => `${point.month}${point.isProjection ? " (forecast)" : ""}`,
      getValue: (point) => point.net,
      formatValue: currencySummaryFormatter,
    })

    const segments: string[] = []
    if (visibleSeries.includes("inflow")) segments.push("inflows")
    if (visibleSeries.includes("outflow")) segments.push("outflows")
    if (visibleSeries.includes("net")) segments.push("net trend")
    return `${summary} Showing ${segments.join(", ")}.`
  }, [visibleSeries])

  const toggleSeries = (series: string) => {
    setVisibleSeries((current) => {
      const isActive = current.includes(series)
      if (isActive && current.length === 1) {
        return current
      }
      return isActive ? current.filter((item) => item !== series) : [...current, series]
    })
  }

  return (
    <Card className="card-standard overflow-hidden">
      <CardHeader className="pb-2 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">Cash Flow</CardTitle>
          
          {/* Series Toggle - Checkbox Style */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => toggleSeries("inflow")}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className={`h-3.5 w-3.5 rounded border-2 flex items-center justify-center transition-colors ${
                visibleSeries.includes("inflow") 
                  ? "bg-emerald-500 border-emerald-500" 
                  : "border-muted-foreground/30 bg-transparent"
              }`}>
                {visibleSeries.includes("inflow") && (
                  <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`hidden sm:inline font-medium ${visibleSeries.includes("inflow") ? "text-foreground" : "text-muted-foreground"}`}>
                Income
              </span>
            </button>
            
            <button
              onClick={() => toggleSeries("outflow")}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className={`h-3.5 w-3.5 rounded border-2 flex items-center justify-center transition-colors ${
                visibleSeries.includes("outflow") 
                  ? "bg-red-500 border-red-500" 
                  : "border-muted-foreground/30 bg-transparent"
              }`}>
                {visibleSeries.includes("outflow") && (
                  <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`hidden sm:inline font-medium ${visibleSeries.includes("outflow") ? "text-foreground" : "text-muted-foreground"}`}>
                Expenses
              </span>
            </button>
            
            <button
              onClick={() => toggleSeries("net")}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className={`h-3.5 w-3.5 rounded border-2 flex items-center justify-center transition-colors ${
                visibleSeries.includes("net") 
                  ? "bg-blue-500 border-blue-500" 
                  : "border-muted-foreground/30 bg-transparent"
              }`}>
                {visibleSeries.includes("net") && (
                  <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`hidden sm:inline font-medium ${visibleSeries.includes("net") ? "text-foreground" : "text-muted-foreground"}`}>
                Net
              </span>
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Period Toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-card/30 p-1">
            <Button 
              variant={period === "month" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setPeriod("month")}
              className="h-7 px-2.5 text-xs"
            >
              Month
            </Button>
            <Button 
              variant={period === "quarter" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setPeriod("quarter")}
              className="h-7 px-2.5 text-xs"
            >
              Quarter
            </Button>
            <Button 
              variant={period === "year" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setPeriod("year")}
              className="h-7 px-2.5 text-xs"
            >
              Year
            </Button>
          </div>

          {/* Account Filter */}
          <Select value={account} onValueChange={setAccount}>
            <SelectTrigger className="w-[130px] h-7 text-xs border-border/60 bg-card/30">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Accounts</SelectItem>
              <SelectItem value="checking" className="text-xs">Checking</SelectItem>
              <SelectItem value="chase" className="text-xs">Chase</SelectItem>
              <SelectItem value="fidelity" className="text-xs">Fidelity</SelectItem>
            </SelectContent>
          </Select>

          {/* Projection Badge */}
          {projectionData && (
            <Badge variant="outline" className="text-xs px-2 py-0.5 gap-1 bg-blue-500/5 border-blue-500/20">
              <TrendingUp className="h-3 w-3 text-blue-500" />
              <span className="hidden sm:inline text-muted-foreground">Forecast</span>
            </Badge>
          )}

          {/* Selected Month Badge */}
          {selectedMonth && (
            <>
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {selectedMonth}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs" 
                onClick={() => onMonthClick?.(null)}
              >
                Clear
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
          {/* Chart - Ultra Compact */}
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <ComposedChart data={monthlyData} margin={{ left: -10, right: 5, top: 5, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.7}/>
                </linearGradient>
                <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="2 4"
                vertical={false}
                stroke="currentColor"
                className="stroke-muted/5"
                horizontal={true}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                className="text-[10px] text-muted-foreground"
                stroke="currentColor"
                tick={{ fontSize: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                className="text-[10px] text-muted-foreground"
                stroke="currentColor"
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                width={35}
                tick={{ fontSize: 10 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[180px]"
                    labelFormatter={(value, payload) => {
                      const dataPoint = (payload as Record<string, unknown>[])?.[0]?.payload as CashFlowDatum | undefined
                      return (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{String(value)}</span>
                          {dataPoint?.isProjection && (
                            <Badge variant="secondary" className="h-4 text-[10px] px-1">
                              Forecast
                            </Badge>
                          )}
                        </div>
                      )
                    }}
                    formatter={(value, name) => {
                      const displayName = name === "inflow" ? "Income" : name === "outflow" ? "Expenses" : "Net"
                      return [
                        <span key="value" className="font-medium">${Number(value).toLocaleString()}</span>,
                        <span key="name" className="text-muted-foreground">{displayName}</span>
                      ]
                    }}
                  />
                }
                cursor={false}
              />
              
              {visibleSeries.includes("inflow") && (
                <Bar
                  dataKey="inflow"
                  fill="url(#colorInflow)"
                  radius={[4, 4, 0, 0]}
                  onClick={(_, index) => onMonthClick?.(monthlyData[index].month)}
                  cursor="pointer"
                  maxBarSize={28}
                >
                  {monthlyData.map((entry, index) => {
                    const dimmed = entry.isProjection ? 0.4 : selectedMonth && entry.month !== selectedMonth ? 0.2 : 1
                    return <Cell key={`inflow-${index}`} opacity={dimmed} />
                  })}
                </Bar>
              )}
              
              {visibleSeries.includes("outflow") && (
                <Bar
                  dataKey="outflow"
                  fill="url(#colorOutflow)"
                  radius={[4, 4, 0, 0]}
                  onClick={(_, index) => onMonthClick?.(monthlyData[index].month)}
                  cursor="pointer"
                  maxBarSize={28}
                >
                  {monthlyData.map((entry, index) => {
                    const dimmed = entry.isProjection ? 0.4 : selectedMonth && entry.month !== selectedMonth ? 0.2 : 1
                    return <Cell key={`outflow-${index}`} opacity={dimmed} />
                  })}
                </Bar>
              )}
              
              {visibleSeries.includes("net") && (
                <Line
                  type="monotone"
                  dataKey="net"
                  stroke="hsl(221, 83%, 53%)"
                  strokeWidth={2}
                  dot={{
                    fill: "hsl(221, 83%, 53%)",
                    strokeWidth: 0,
                    r: 3,
                  }}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: "hsl(var(--background))",
                    fill: "hsl(221, 83%, 53%)",
                  }}
                />
              )}
            </ComposedChart>
          </ChartContainer>
      </CardContent>
    </Card>
  )
}
