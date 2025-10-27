"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, XAxis, YAxis, CartesianGrid, Line, ComposedChart } from "recharts"
import { useDateRange } from "@/components/date-range-provider"
import { useMemo } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

interface CashFlowPoint {
  month: string
  income: number
  expenses: number
  net: number
}

const generateCashFlowData = (months: number): CashFlowPoint[] => {
  const data: CashFlowPoint[] = []
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  for (let i = 0; i < months; i++) {
    const monthIndex = (new Date().getMonth() - months + i + 1 + 12) % 12
    const income = 8000 + Math.random() * 2000
    const expenses = 5000 + Math.random() * 1500
    data.push({
      month: monthNames[monthIndex],
      income,
      expenses,
      net: income - expenses,
    })
  }
  return data
}

const chartConfig = {
  income: {
    label: "Income",
    theme: {
      light: "hsl(142, 76%, 36%)",
      dark: "hsl(142, 71%, 45%)",
    },
  },
  expenses: {
    label: "Expenses",
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

export function CashFlow() {
  const { dateRange } = useDateRange()

  const cashFlowData = useMemo(() => {
    const monthsMap = {
      "1D": 1,
      "5D": 1,
      "1M": 1,
      "6M": 6,
      YTD: Math.ceil((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 30)),
      "1Y": 12,
      ALL: 24,
    }
    return generateCashFlowData(monthsMap[dateRange])
  }, [dateRange])

  return (
    <Card className="card-standard">
      <CardHeader>
        <CardTitle>Cash Flow</CardTitle>
        <CardDescription>Income vs expenses with net cash flow trend</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <ComposedChart data={cashFlowData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
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
              content={<ChartTooltipContent formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]} />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[6, 6, 0, 0]} opacity={0.85} />
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
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
