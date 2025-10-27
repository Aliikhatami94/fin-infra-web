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
import { Calendar, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { currencySummaryFormatter, describeTimeSeries } from "@/lib/a11y"
import { formatCurrency } from "@/lib/format"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
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
  const avgNet = historicalData.reduce((sum, d) => sum + d.net, 0) / historicalData.length
  const projectionData = monthlyData.find((d) => d.isProjection)
  const chartSummary = useMemo(() => {
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
    <Card className="card-standard">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CardTitle>Cash Flow Overview</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Select value={account} onValueChange={setAccount}>
                      <SelectTrigger className="w-[160px] h-8 text-xs">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Accounts</SelectItem>
                        <SelectItem value="checking">Checking Only</SelectItem>
                        <SelectItem value="chase">Chase Total Checking</SelectItem>
                        <SelectItem value="fidelity">Fidelity Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Filter this chart only</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-xs text-muted-foreground">Group by:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 border rounded-md">
                    <Button variant={period === "month" ? "default" : "ghost"} size="sm" onClick={() => setPeriod("month")}>
                      Month
                    </Button>
                    <Button variant={period === "quarter" ? "default" : "ghost"} size="sm" onClick={() => setPeriod("quarter")}>
                      Quarter
                    </Button>
                    <Button variant={period === "year" ? "default" : "ghost"} size="sm" onClick={() => setPeriod("year")}>
                      Year
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Chart aggregation only</p>
                  <p className="text-xs text-muted-foreground">Time range set in top bar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        {projectionData && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">July Forecast:</span> Net flow of $
              {projectionData.net.toLocaleString()} based on 6-month average
            </p>
          </div>
        )}
        {selectedMonth && (
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              Filtered: {selectedMonth}
            </Badge>
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => onMonthClick?.(null)}>
              Clear
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Series Toggle Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2">Show:</span>
            <Button
              variant={visibleSeries.includes("inflow") ? "secondary" : "outline"}
              size="sm"
              onClick={() => toggleSeries("inflow")}
              className="h-7 text-xs gap-1.5"
            >
              <div className="h-2 w-2 rounded-full bg-[hsl(142,71%,45%)] dark:bg-[hsl(142,76%,55%)]" />
              Income
            </Button>
            <Button
              variant={visibleSeries.includes("outflow") ? "secondary" : "outline"}
              size="sm"
              onClick={() => toggleSeries("outflow")}
              className="h-7 text-xs gap-1.5"
            >
              <div className="h-2 w-2 rounded-full bg-[hsl(0,72%,51%)] dark:bg-[hsl(0,72%,60%)]" />
              Expenses
            </Button>
            <Button
              variant={visibleSeries.includes("net") ? "secondary" : "outline"}
              size="sm"
              onClick={() => toggleSeries("net")}
              className="h-7 text-xs gap-1.5"
            >
              <div className="h-2 w-2 rounded-full bg-[hsl(221,83%,53%)] dark:bg-[hsl(221,83%,65%)]" />
              Net
            </Button>
          </div>

          {/* Chart */}
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <ComposedChart data={monthlyData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-inflow)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-inflow)" stopOpacity={0.6}/>
                </linearGradient>
                <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-outflow)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-outflow)" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="stroke-muted/20"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                className="text-[11px]"
                stroke="currentColor"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                className="text-[11px]"
                stroke="currentColor"
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                width={45}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[180px]"
                    labelFormatter={(value, payload) => {
                      const dataPoint = (payload as any)?.[0]?.payload as CashFlowDatum | undefined
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
                  radius={[8, 8, 0, 0]}
                  onClick={(_, index) => onMonthClick?.(monthlyData[index].month)}
                  cursor="pointer"
                  maxBarSize={40}
                >
                  {monthlyData.map((entry, index) => {
                    const dimmed = entry.isProjection ? 0.5 : selectedMonth && entry.month !== selectedMonth ? 0.2 : 1
                    return <Cell key={`inflow-${index}`} opacity={dimmed} />
                  })}
                </Bar>
              )}
              
              {visibleSeries.includes("outflow") && (
                <Bar
                  dataKey="outflow"
                  fill="url(#colorOutflow)"
                  radius={[8, 8, 0, 0]}
                  onClick={(_, index) => onMonthClick?.(monthlyData[index].month)}
                  cursor="pointer"
                  maxBarSize={40}
                >
                  {monthlyData.map((entry, index) => {
                    const dimmed = entry.isProjection ? 0.5 : selectedMonth && entry.month !== selectedMonth ? 0.2 : 1
                    return <Cell key={`outflow-${index}`} opacity={dimmed} />
                  })}
                </Bar>
              )}
              
              {visibleSeries.includes("net") && (
                <Line
                  type="monotone"
                  dataKey="net"
                  stroke="var(--color-net)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-net)",
                    strokeWidth: 0,
                    r: 3,
                  }}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: "hsl(var(--background))",
                    fill: "var(--color-net)",
                  }}
                />
              )}
            </ComposedChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
