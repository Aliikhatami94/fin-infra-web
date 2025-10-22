"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import type { TooltipContentProps } from "recharts"
import { Button } from "@/components/ui/button"

type Timeframe = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL"

interface NetWorthPoint {
  time: string
  fullDate: string
  value: number
}

const generateChartData = (timeframe: Timeframe): NetWorthPoint[] => {
  const baseNetWorth = 245000
  const currentNetWorth = 287500

  switch (timeframe) {
    case "1D":
      return Array.from({ length: 14 }, (_, i) => {
        const hour = Math.floor(i / 2) + 9
        const minute = (i % 2) * 30
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        const date = new Date()
        date.setHours(hour, minute, 0, 0)
        const progress = i / 13
        const value = baseNetWorth + (currentNetWorth - baseNetWorth) * progress + (Math.random() - 0.5) * 500
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
        const value = baseNetWorth + (currentNetWorth - baseNetWorth) * progress + (Math.random() - 0.5) * 800
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
        const value =
          baseNetWorth - 5000 + (currentNetWorth - baseNetWorth + 5000) * progress + (Math.random() - 0.5) * 1200
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
        const value =
          baseNetWorth - 15000 + (currentNetWorth - baseNetWorth + 15000) * progress + (Math.random() - 0.5) * 2000
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
        const value =
          baseNetWorth - 45000 + (currentNetWorth - baseNetWorth + 45000) * progress + (Math.random() - 0.5) * 3500
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
        const value =
          baseNetWorth - 120000 + (currentNetWorth - baseNetWorth + 120000) * progress + (Math.random() - 0.5) * 8000
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

type NetWorthTooltipProps = TooltipContentProps<number, string>

const CustomTooltip = ({ active, payload }: NetWorthTooltipProps) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0]?.payload as NetWorthPoint | undefined
    const rawValue = payload[0]?.value
    const value = typeof rawValue === "number" ? rawValue : Number(rawValue ?? 0)

    return (
      <div className="rounded-lg border bg-background p-2.5 shadow-md">
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

export function NetWorthChart() {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>("1M")

  const chartData = useMemo(() => generateChartData(activeTimeframe), [activeTimeframe])

  const currentValue = chartData[chartData.length - 1]?.value || 287500
  const previousValue = chartData[0]?.value || 245000
  const change = currentValue - previousValue
  const changePercent = ((change / previousValue) * 100).toFixed(2)

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1.5">
            <h3 className="text-xl font-semibold tracking-tight">Net Worth</h3>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-bold tracking-tight font-mono">
                ${currentValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
              <span
                className={`text-sm font-medium ${change >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"}`}
              >
                {change >= 0 ? "+" : ""}$
                {Math.abs(change).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} (
                {change >= 0 ? "+" : ""}
                {changePercent}%)
              </span>
            </div>
          </div>
          <div className="flex gap-0.5 bg-muted/50 rounded-lg p-0.5">
            {timeframes.map((tf) => (
              <Button
                key={tf}
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
        <div className="w-full h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
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
                domain={["dataMin - 5000", "dataMax + 5000"]}
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
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                fill="url(#colorNetWorth)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
