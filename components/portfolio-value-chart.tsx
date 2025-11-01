"use client"

import { useState, useMemo, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import type { TooltipContentProps } from "recharts"
import { Button } from "@/components/ui/button"
import { AccessibleChart } from "@/components/accessible-chart"
import { currencySummaryFormatter, describeTimeSeries } from "@/lib/a11y"
import { formatCurrency } from "@/lib/format"
import { LINE_CHART_COLORS, CHART_STYLES } from "@/lib/chart-colors"

type Timeframe = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL"

interface PortfolioValuePoint {
  time: string
  fullDate: string
  value: number
}

const generateChartData = (timeframe: Timeframe): PortfolioValuePoint[] => {
  const baseValue = 85000
  const currentValue = 98750

  switch (timeframe) {
    case "1D":
      return Array.from({ length: 14 }, (_, i) => {
        const hour = Math.floor(i / 2) + 9
        const minute = (i % 2) * 30
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        const date = new Date()
        date.setHours(hour, minute, 0, 0)
        const progress = i / 13
        const value = baseValue + (currentValue - baseValue) * progress + (Math.random() - 0.5) * 300
        return {
          time,
          fullDate: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          value: Number.parseFloat(value.toFixed(2)),
        }
      })

    case "1W":
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
      return days.map((day, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (4 - i))
        const progress = i / 4
        const value = baseValue + (currentValue - baseValue) * progress + (Math.random() - 0.5) * 500
        return {
          time: day,
          fullDate: date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
          value: Number.parseFloat(value.toFixed(2)),
        }
      })

    case "1M":
      return Array.from({ length: 20 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (19 - i))
        const time = `${date.getMonth() + 1}/${date.getDate()}`
        const progress = i / 19
        const value = baseValue - 3000 + (currentValue - baseValue + 3000) * progress + (Math.random() - 0.5) * 800
        return {
          time,
          fullDate: date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
          value: Number.parseFloat(value.toFixed(2)),
        }
      })

    case "3M":
      return Array.from({ length: 12 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (11 - i) * 7)
        const time = `${date.getMonth() + 1}/${date.getDate()}`
        const progress = i / 11
        const value = baseValue - 8000 + (currentValue - baseValue + 8000) * progress + (Math.random() - 0.5) * 1200
        return {
          time,
          fullDate: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          value: Number.parseFloat(value.toFixed(2)),
        }
      })

    case "1Y":
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      return months.map((month, i) => {
        const date = new Date()
        date.setMonth(i)
        const progress = i / 11
        const value = baseValue - 20000 + (currentValue - baseValue + 20000) * progress + (Math.random() - 0.5) * 2000
        return {
          time: month,
          fullDate: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          value: Number.parseFloat(value.toFixed(2)),
        }
      })

    case "ALL":
      return Array.from({ length: 20 }, (_, i) => {
        const year = 2020 + Math.floor(i / 4)
        const quarter = `Q${(i % 4) + 1}`
        const time = `${quarter} ${year}`
        const progress = i / 19
        const value = baseValue - 50000 + (currentValue - baseValue + 50000) * progress + (Math.random() - 0.5) * 4000
        return {
          time,
          fullDate: `${quarter} ${year}`,
          value: Number.parseFloat(value.toFixed(2)),
        }
      })

    default:
      return []
  }
}

type PortfolioTooltipProps = TooltipContentProps<number, string>

const CustomTooltip = ({ active, payload }: PortfolioTooltipProps) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0]?.payload as PortfolioValuePoint | undefined
    const rawValue = payload[0]?.value
    const value = typeof rawValue === "number" ? rawValue : Number(rawValue ?? 0)

    return (
      <div className="rounded-lg border bg-card p-2.5 shadow-md">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">{dataPoint?.fullDate}</p>
          <p className="text-base font-semibold font-mono">${value.toLocaleString()}</p>
        </div>
      </div>
    )
  }
  return null
}

const timeframes: Timeframe[] = ["1D", "1W", "1M", "3M", "1Y", "ALL"]

export function PortfolioValueChart() {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>("1M")
  const timeframeRefs = useRef<Array<HTMLButtonElement | null>>([])

  const chartData = useMemo(() => generateChartData(activeTimeframe), [activeTimeframe])

  const currentValue = chartData[chartData.length - 1]?.value || 98750
  const previousValue = chartData[0]?.value || 85000
  const change = currentValue - previousValue
  const changePercent = ((change / previousValue) * 100).toFixed(2)
  const formattedCurrentValue = formatCurrency(currentValue, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  const changeLabel = `${change >= 0 ? "Increase" : "Decrease"} of ${formatCurrency(Math.abs(change), {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} (${changePercent}%)`
  const summary = useMemo(
    () =>
      describeTimeSeries({
        data: chartData,
        metric: "Portfolio value",
        getLabel: (point) => point.fullDate ?? point.time,
        getValue: (point) => point.value,
        formatValue: currencySummaryFormatter,
      }),
    [chartData],
  )

  const handleTimeframeKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return
    }

    event.preventDefault()
    const currentIndex = timeframes.findIndex((tf) => tf === activeTimeframe)
    const direction = event.key === "ArrowRight" ? 1 : -1
    const nextIndex = (currentIndex + direction + timeframes.length) % timeframes.length
    const nextValue = timeframes[nextIndex]

    setActiveTimeframe(nextValue)
    timeframeRefs.current[nextIndex]?.focus()
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1.5">
            <h3 className="text-xl font-semibold tracking-tight">Portfolio Value</h3>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-bold tracking-tight font-mono" aria-live="polite" aria-label={`Current portfolio value ${formattedCurrentValue}`}>
                {formattedCurrentValue}
              </span>
              <span
                className={`text-sm font-medium ${change >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"}`}
                role="status"
                aria-live="polite"
                aria-label={changeLabel}
              >
                {change >= 0 ? "+" : ""}$
                {Math.abs(change).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} (
                {change >= 0 ? "+" : ""}
                {changePercent}%)
              </span>
            </div>
          </div>
          <div
            className="flex gap-0.5 bg-muted/50 rounded-lg p-0.5"
            role="radiogroup"
            aria-label="Select portfolio value timeframe"
            onKeyDown={handleTimeframeKeyDown}
          >
            {timeframes.map((tf, index) => (
              <Button
                key={tf}
                ref={(node) => {
                  timeframeRefs.current[index] = node
                }}
                role="radio"
                aria-checked={tf === activeTimeframe}
                variant={tf === activeTimeframe ? "secondary" : "ghost"}
                size="sm"
                className={`h-8 px-3 text-xs font-medium ${
                  tf === activeTimeframe ? "bg-card shadow-sm" : "hover:bg-card/60"
                }`}
                onClick={() => setActiveTimeframe(tf)}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        <AccessibleChart
          title="Portfolio value trend"
          description={summary}
          className="w-full h-[450px]"
          contentClassName="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={LINE_CHART_COLORS.primary.fill} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={LINE_CHART_COLORS.primary.fill} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray={CHART_STYLES.grid.strokeDasharray}
                stroke={CHART_STYLES.grid.stroke}
                vertical={CHART_STYLES.grid.vertical}
                opacity={CHART_STYLES.grid.opacity}
              />
              <XAxis
                dataKey="time"
                stroke={CHART_STYLES.axis.stroke}
                fontSize={CHART_STYLES.axis.fontSize}
                tick={{ fill: CHART_STYLES.axis.fill }}
                tickLine={CHART_STYLES.axis.tickLine}
                axisLine={CHART_STYLES.axis.axisLine}
                tickMargin={CHART_STYLES.axis.tickMargin}
                dy={10}
              />
              <YAxis
                stroke={CHART_STYLES.axis.stroke}
                fontSize={CHART_STYLES.axis.fontSize}
                tick={{ fill: CHART_STYLES.axis.fill }}
                tickLine={CHART_STYLES.axis.tickLine}
                axisLine={CHART_STYLES.axis.axisLine}
                tickMargin={CHART_STYLES.axis.tickMargin}
                domain={["dataMin - 2000", "dataMax + 2000"]}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                width={50}
              />
              <Tooltip
                content={CustomTooltip}
                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1, strokeDasharray: "5 5" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={LINE_CHART_COLORS.primary.stroke}
                strokeWidth={CHART_STYLES.line.strokeWidth}
                fill="url(#colorPortfolio)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </AccessibleChart>
      </CardContent>
    </Card>
  )
}
