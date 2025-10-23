"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { AccessibleChart } from "@/components/accessible-chart"
import { describeTimeSeries, currencySummaryFormatter } from "@/lib/a11y"
import { cn } from "@/lib/utils"

export interface NetWorthPoint {
  date: string
  netWorth: number
  assets: number
  liabilities: number
}

interface NetWorthHistoryChartProps {
  data: NetWorthPoint[]
  className?: string
}

export function NetWorthHistoryChart({ data, className }: NetWorthHistoryChartProps) {
  const summary = describeTimeSeries({
    data,
    metric: "Net worth",
    getLabel: (point) => point.date,
    getValue: (point) => point.netWorth,
    formatValue: currencySummaryFormatter,
  })

  return (
    <AccessibleChart
      title="Net worth trend"
      description={summary}
      className={cn("h-96", className)}
      contentClassName="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
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
            tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-card p-3 shadow-sm">
                    <p className="text-xs text-muted-foreground mb-2">{payload[0].payload.date}</p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Net Worth: ${payload[0].value?.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Assets: ${payload[0].payload.assets.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        Liabilities: ${payload[0].payload.liabilities.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="netWorth"
            stroke="hsl(210, 100%, 60%)"
            strokeWidth={2}
            fill="url(#netWorthGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </AccessibleChart>
  )
}
