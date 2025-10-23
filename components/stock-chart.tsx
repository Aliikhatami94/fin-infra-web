"use client"

import { useState, useMemo, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import type { TooltipContentProps } from "recharts"
import { Button } from "@/components/ui/button"
import { AccessibleChart } from "@/components/accessible-chart"
import { currencySummaryFormatter, describeTimeSeries } from "@/lib/a11y"
import { formatCurrency } from "@/lib/format"

type Timeframe = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL"

interface StockChartPoint {
  time: string
  fullDate: string
  price: number
}

const generateChartData = (timeframe: Timeframe): StockChartPoint[] => {
  const basePrice = 178.5
  const currentPrice = 185.75

  switch (timeframe) {
    case "1D":
      // Intraday data with 30-minute intervals
      return Array.from({ length: 14 }, (_, i) => {
        const hour = Math.floor(i / 2) + 9
        const minute = (i % 2) * 30
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        const date = new Date()
        date.setHours(hour, minute, 0, 0)
        const progress = i / 13
        const price = basePrice + (currentPrice - basePrice) * progress + (Math.random() - 0.5) * 2
        return {
          time,
          fullDate: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          price: Number.parseFloat(price.toFixed(2)),
        }
      })

    case "1W":
      // 5 days of data
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
      return days.map((day, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (4 - i))
        const progress = i / 4
        const price = basePrice + (currentPrice - basePrice) * progress + (Math.random() - 0.5) * 3
        return {
          time: day,
          fullDate: date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
          price: Number.parseFloat(price.toFixed(2)),
        }
      })

    case "1M":
      // 4 weeks of data
      return Array.from({ length: 20 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (19 - i))
        const time = `${date.getMonth() + 1}/${date.getDate()}`
        const progress = i / 19
        const price = basePrice - 10 + (currentPrice - basePrice + 10) * progress + (Math.random() - 0.5) * 4
        return {
          time,
          fullDate: date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
          price: Number.parseFloat(price.toFixed(2)),
        }
      })

    case "3M":
      // 12 weeks of data
      return Array.from({ length: 12 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (11 - i) * 7)
        const time = `${date.getMonth() + 1}/${date.getDate()}`
        const progress = i / 11
        const price = basePrice - 20 + (currentPrice - basePrice + 20) * progress + (Math.random() - 0.5) * 5
        return {
          time,
          fullDate: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          price: Number.parseFloat(price.toFixed(2)),
        }
      })

    case "1Y":
      // 12 months of data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      return months.map((month, i) => {
        const date = new Date()
        date.setMonth(i)
        const progress = i / 11
        const price = basePrice - 40 + (currentPrice - basePrice + 40) * progress + (Math.random() - 0.5) * 8
        return {
          time: month,
          fullDate: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          price: Number.parseFloat(price.toFixed(2)),
        }
      })

    case "ALL":
      // 5 years of data
      return Array.from({ length: 20 }, (_, i) => {
        const year = 2020 + Math.floor(i / 4)
        const quarter = `Q${(i % 4) + 1}`
        const time = `${quarter} ${year}`
        const progress = i / 19
        const price = basePrice - 80 + (currentPrice - basePrice + 80) * progress + (Math.random() - 0.5) * 15
        return {
          time,
          fullDate: `${quarter} ${year}`,
          price: Number.parseFloat(price.toFixed(2)),
        }
      })

    default:
      return []
  }
}

type StockTooltipProps = TooltipContentProps<number, string>

const CustomTooltip = ({ active, payload }: StockTooltipProps) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0]?.payload as StockChartPoint | undefined
    const rawValue = payload[0]?.value
    const price = typeof rawValue === "number" ? rawValue : Number(rawValue ?? 0)

    return (
      <div className="rounded-lg border bg-background p-2.5 shadow-md">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">{dataPoint?.fullDate}</p>
          <p className="text-base font-semibold font-mono">${price.toFixed(2)}</p>
        </div>
      </div>
    )
  }
  return null
}

const timeframes: Timeframe[] = ["1D", "1W", "1M", "3M", "1Y", "ALL"]

export function StockChart() {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>("1D")
  const timeframeRefs = useRef<Array<HTMLButtonElement | null>>([])

  const chartData = useMemo(() => generateChartData(activeTimeframe), [activeTimeframe])
  const currentPrice = chartData[chartData.length - 1]?.price ?? 185.75
  const previousPrice = chartData[0]?.price ?? currentPrice
  const change = currentPrice - previousPrice
  const changePercent = previousPrice ? ((change / previousPrice) * 100).toFixed(2) : "0.00"
  const formattedCurrentPrice = formatCurrency(currentPrice, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const changeLabel = `${change >= 0 ? "Increase" : "Decrease"} of ${formatCurrency(Math.abs(change), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} (${changePercent}%)`
  const summary = useMemo(
    () =>
      describeTimeSeries({
        data: chartData,
        metric: "AAPL stock price",
        getLabel: (point) => point.fullDate ?? point.time,
        getValue: (point) => point.price,
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
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-semibold tracking-tight">AAPL</h3>
              <span className="text-sm text-muted-foreground">Apple Inc.</span>
            </div>
            <div className="flex items-baseline gap-2.5">
              <span
                className="text-3xl font-bold tracking-tight font-mono"
                aria-live="polite"
                aria-label={`Current AAPL price ${formattedCurrentPrice}`}
              >
                {formattedCurrentPrice}
              </span>
              <span
                className={`text-sm font-medium ${change >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"}`}
                role="status"
                aria-live="polite"
                aria-label={changeLabel}
              >
                {change >= 0 ? "+" : ""}$
                {Math.abs(change).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (
                {change >= 0 ? "+" : ""}
                {changePercent}%)
              </span>
            </div>
          </div>
          <div
            className="flex gap-0.5 bg-muted/50 rounded-lg p-0.5"
            role="radiogroup"
            aria-label="Select stock price timeframe"
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
                  tf === activeTimeframe ? "bg-background shadow-sm" : "hover:bg-background/50"
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
          title="AAPL stock price trend"
          description={summary}
          className="w-full h-[450px]"
          contentClassName="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.3} />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={["dataMin - 2", "dataMax + 2"]}
                tickFormatter={(value) => `$${value}`}
                width={50}
              />
              <Tooltip
                content={CustomTooltip}
                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1, strokeDasharray: "5 5" }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                fill="url(#colorPrice)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </AccessibleChart>
      </CardContent>
    </Card>
  )
}
