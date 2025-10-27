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
      light: "hsl(142, 71%, 45%)",
      dark: "hsl(142, 76%, 55%)",
    },
  },
  expenses: {
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
          <ComposedChart data={cashFlowData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0.6}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-expenses)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-expenses)" stopOpacity={0.6}/>
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
                  className="w-[160px]"
                  formatter={(value, name) => {
                    const displayName = name === "income" ? "Income" : name === "expenses" ? "Expenses" : "Net"
                    return [
                      <span className="font-medium">${Number(value).toLocaleString()}</span>,
                      <span className="text-muted-foreground">{displayName}</span>
                    ]
                  }}
                />
              }
              cursor={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income" fill="url(#colorIncome)" radius={[8, 8, 0, 0]} maxBarSize={40} />
            <Bar dataKey="expenses" fill="url(#colorExpenses)" radius={[8, 8, 0, 0]} maxBarSize={40} />
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
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
