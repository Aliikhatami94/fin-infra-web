"use client"

import { useMemo, useState } from "react"
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts"
import type { TooltipProps } from "recharts"

import { ChartContainer, ChartGrid, ThemedAxis, TooltipCard } from "@/components/chart-kit"
import { SwitchField } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface CryptoDatum {
  date: string
  btc: number
  eth: number
  other: number
  stablecoins: number
  transaction: { type: "buy" | "sell"; amount: string } | null
}

const data: CryptoDatum[] = [
  { date: "Jan", btc: 8500, eth: 3200, other: 2100, stablecoins: 500, transaction: null },
  { date: "Feb", btc: 9200, eth: 3800, other: 2400, stablecoins: 600, transaction: { type: "buy", amount: "$1,200" } },
  { date: "Mar", btc: 10100, eth: 4200, other: 2800, stablecoins: 700, transaction: null },
  { date: "Apr", btc: 11500, eth: 4800, other: 3200, stablecoins: 800, transaction: { type: "sell", amount: "$800" } },
  { date: "May", btc: 10800, eth: 4400, other: 2900, stablecoins: 750, transaction: null },
  { date: "Jun", btc: 12400, eth: 5100, other: 3400, stablecoins: 900, transaction: { type: "buy", amount: "$2,000" } },
]

const timeRanges = ["1D", "7D", "30D", "6M", "1Y", "All"] as const

type TimeRange = (typeof timeRanges)[number]

const series = [
  { key: "btc", name: "BTC", color: "var(--chart-1)" },
  { key: "eth", name: "ETH", color: "var(--chart-2)" },
  { key: "other", name: "Other", color: "var(--chart-3)" },
  { key: "stablecoins", name: "Stablecoins", color: "var(--chart-4)" },
] as const

export interface CryptoChartProps {
  showStablecoins: boolean
  onToggleStablecoins: (value: boolean) => void
}

type ChartTooltipProps = TooltipProps<number, string>

export function CryptoChart({ showStablecoins, onToggleStablecoins }: CryptoChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("30D")

  const filteredSeries = useMemo(() => {
    if (showStablecoins) return series
    return series.filter((entry) => entry.key !== "stablecoins")
  }, [showStablecoins])

  return (
    <ChartContainer
      title="Portfolio Value Over Time"
      description="Monitor total crypto value and compare asset classes across time horizons."
      timeRanges={timeRanges}
      selectedRange={selectedRange}
      onRangeChange={(value) => setSelectedRange(value as TimeRange)}
      unitLabel="USD"
      actions={
        <SwitchField
          id="stablecoins-toggle"
          label="Show stablecoins"
          layout="inline"
          checked={showStablecoins}
          onCheckedChange={onToggleStablecoins}
        />
      }
    >
      <div className="w-full overflow-x-auto">
        <ResponsiveContainer width="100%" height={360} minWidth={320}>
          <AreaChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 12 }}>
            <defs>
              {series.map((entry) => (
                <linearGradient key={entry.key} id={`crypto-${entry.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`hsl(${entry.color})`} stopOpacity={0.24} />
                  <stop offset="95%" stopColor={`hsl(${entry.color})`} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <ChartGrid />
            <ThemedAxis axis="x" dataKey="date" dy={8} />
            <ThemedAxis axis="y" tickFormatter={(value) => `$${Number(value / 1000).toFixed(0)}k`} />
            <Tooltip
              cursor={{ stroke: "hsl(var(--border))", strokeDasharray: "4 4", strokeWidth: 1 }}
              content={(props: ChartTooltipProps) => (
                <TooltipCard
                  {...props}
                  labelFormatter={(label) => label}
                  valueFormatter={(value, name) => `$${Number(value ?? 0).toLocaleString()}`}
                  footer={(payload) => {
                    const datum = (payload as any)?.[0]?.payload as CryptoDatum | undefined
                    if (!datum?.transaction) return null
                    const isBuy = datum.transaction.type === "buy"
                    return (
                      <div className="flex items-center justify-between gap-3">
                        <span>{isBuy ? "Recent buy" : "Recent sell"}</span>
                        <span
                          className={cn(
                            "font-semibold tabular-nums",
                            isBuy ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
                          )}
                        >
                          {datum.transaction.amount}
                        </span>
                      </div>
                    )
                  }}
                />
              )}
            />
            {filteredSeries.map((entry) => (
              <Area
                key={entry.key}
                type="monotone"
                dataKey={entry.key}
                stackId="1"
                stroke={`hsl(${entry.color})`}
                fill={`url(#crypto-${entry.key})`}
                fillOpacity={1}
                name={entry.name}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  )
}
