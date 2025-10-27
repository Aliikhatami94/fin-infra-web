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
    label: "Inflow",
    theme: {
      light: "hsl(142, 76%, 36%)",
      dark: "hsl(142, 71%, 45%)",
    },
  },
  outflow: {
    label: "Outflow",
    theme: {
      light: "hsl(24, 95%, 53%)",
      dark: "hsl(24, 95%, 60%)",
    },
  },
  net: {
    label: "Net Flow",
    theme: {
      light: "hsl(217, 91%, 60%)",
      dark: "hsl(217, 91%, 65%)",
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
          <div className="flex flex-wrap gap-2">
            <Button
              variant={visibleSeries.includes("inflow") ? "default" : "outline"}
              size="sm"
              onClick={() => toggleSeries("inflow")}
              className="text-xs"
            >
              <div className="mr-2 h-3 w-3 rounded-full bg-[hsl(142,76%,36%)] dark:bg-[hsl(142,71%,45%)]" />
              Inflow
            </Button>
            <Button
              variant={visibleSeries.includes("outflow") ? "default" : "outline"}
              size="sm"
              onClick={() => toggleSeries("outflow")}
              className="text-xs"
            >
              <div className="mr-2 h-3 w-3 rounded-full bg-[hsl(24,95%,53%)] dark:bg-[hsl(24,95%,60%)]" />
              Outflow
            </Button>
            <Button
              variant={visibleSeries.includes("net") ? "default" : "outline"}
              size="sm"
              onClick={() => toggleSeries("net")}
              className="text-xs"
            >
              <div className="mr-2 h-3 w-3 rounded-full bg-[hsl(217,91%,60%)] dark:bg-[hsl(217,91%,65%)]" />
              Net Flow
            </Button>
          </div>

          {/* Chart */}
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <ComposedChart data={monthlyData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-muted"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value, payload) => {
                      const dataPoint = (payload as any)?.[0]?.payload as CashFlowDatum | undefined
                      return (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{String(value)}</span>
                          {dataPoint?.isProjection && (
                            <Badge variant="secondary" className="text-xs">
                              Forecast
                            </Badge>
                          )}
                        </div>
                      )
                    }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              
              {visibleSeries.includes("inflow") && (
                <Bar
                  dataKey="inflow"
                  fill="var(--color-inflow)"
                  radius={[6, 6, 0, 0]}
                  onClick={(_, index) => onMonthClick?.(monthlyData[index].month)}
                  cursor="pointer"
                >
                  {monthlyData.map((entry, index) => {
                    const dimmed = entry.isProjection ? 0.6 : selectedMonth && entry.month !== selectedMonth ? 0.3 : 1
                    return <Cell key={`inflow-${index}`} opacity={dimmed} />
                  })}
                </Bar>
              )}
              
              {visibleSeries.includes("outflow") && (
                <Bar
                  dataKey="outflow"
                  fill="var(--color-outflow)"
                  radius={[6, 6, 0, 0]}
                  onClick={(_, index) => onMonthClick?.(monthlyData[index].month)}
                  cursor="pointer"
                >
                  {monthlyData.map((entry, index) => {
                    const dimmed = entry.isProjection ? 0.6 : selectedMonth && entry.month !== selectedMonth ? 0.3 : 0.85
                    return <Cell key={`outflow-${index}`} opacity={dimmed} />
                  })}
                </Bar>
              )}
              
              {visibleSeries.includes("net") && (
                <Line
                  type="monotone"
                  dataKey="net"
                  stroke="var(--color-net)"
                  strokeWidth={2.5}
                  dot={{
                    fill: "var(--color-net)",
                    r: 4,
                    strokeWidth: 2,
                    stroke: "hsl(var(--background))",
                  }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
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
