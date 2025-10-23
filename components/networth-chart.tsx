"use client"

import { useMemo, useState } from "react"
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts"
import type { TooltipProps } from "recharts"

import { ChartContainer, ChartGrid, ThemedAxis, TooltipCard } from "@/components/chart-kit"

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

const timeframes: Timeframe[] = ["1D", "1W", "1M", "3M", "1Y", "ALL"]

type NetWorthTooltipProps = TooltipProps<number, string>

export function NetWorthChart() {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>("1M")

  const chartData = useMemo(() => generateChartData(activeTimeframe), [activeTimeframe])

  const currentValue = chartData[chartData.length - 1]?.value || 287500
  const previousValue = chartData[0]?.value || 245000
  const change = currentValue - previousValue
  const changePercent = previousValue === 0 ? 0 : (change / previousValue) * 100

  return (
    <ChartContainer
      title="Net Worth"
      description="Track how your net worth has changed over time."
      timeRanges={timeframes}
      selectedRange={activeTimeframe}
      onRangeChange={(value) => setActiveTimeframe(value as Timeframe)}
      unitLabel="USD"
      actions={
        <div className="flex flex-col items-start sm:items-end">
          <span className="text-3xl font-bold tracking-tight text-foreground">
            ${currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          <span
            className={
              change >= 0
                ? "text-sm font-medium text-emerald-600 dark:text-emerald-500"
                : "text-sm font-medium text-rose-600 dark:text-rose-500"
            }
          >
            {change >= 0 ? "+" : "-"}${Math.abs(change).toLocaleString(undefined, { maximumFractionDigits: 0 })} (
            {change >= 0 ? "+" : "-"}
            {Math.abs(changePercent).toFixed(2)}%)
          </span>
        </div>
      }
    >
      <div className="h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 12, right: 16, left: 0, bottom: 12 }}>
            <defs>
              <linearGradient id="networth-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.24} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <ChartGrid />
            <ThemedAxis axis="x" dataKey="time" dy={8} />
            <ThemedAxis
              axis="y"
              domain={["dataMin - 5000", "dataMax + 5000"]}
              tickFormatter={(value) => `$${(Number(value) / 1000).toFixed(0)}k`}
            />
            <Tooltip
              cursor={{ stroke: "hsl(var(--border))", strokeDasharray: "4 4", strokeWidth: 1 }}
              content={(props: NetWorthTooltipProps) => (
                <TooltipCard
                  {...props}
                  labelFormatter={(label) => label}
                  valueFormatter={(value) => `$${Number(value ?? 0).toLocaleString()}`}
                />
              )}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              fill="url(#networth-fill)"
              name="Net worth"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  )
}
