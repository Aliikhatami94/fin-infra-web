"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from "recharts"
import type { TooltipContentProps } from "recharts"
import { useDateRange } from "@/components/date-range-provider"
import { useMemo } from "react"

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

type CashFlowTooltipProps = TooltipContentProps<number, string>

const CustomTooltip = ({ active, payload }: CashFlowTooltipProps) => {
  if (active && payload && payload.length) {
    const incomePayload = payload.find((item) => item.dataKey === "income")?.value
    const expensePayload = payload.find((item) => item.dataKey === "expenses")?.value
    const income = typeof incomePayload === "number" ? incomePayload : Number(incomePayload ?? 0)
    const expenses = typeof expensePayload === "number" ? expensePayload : Number(expensePayload ?? 0)
    const dataPoint = payload[0]?.payload as CashFlowPoint | undefined
    if (!dataPoint) {
      return null
    }
    const net = income - expenses

    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium mb-2">{dataPoint.month}</p>
        <div className="space-y-1">
          <p className="text-sm" style={{ color: "hsl(142, 76%, 45%)" }}>
            Income: ${income.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-muted-foreground">
            Expenses: ${expenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm font-semibold pt-1 border-t mt-2">
            Net: ${net.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    )
  }
  return null
}

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
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow</CardTitle>
        <CardDescription>Income vs expenses with net cash flow trend</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={cashFlowData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={CustomTooltip} cursor={{ fill: "transparent" }} />
            <Bar dataKey="income" fill="hsl(142, 76%, 45%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="hsl(24, 95%, 53%)" radius={[4, 4, 0, 0]} opacity={0.7} />
            <Line
              type="monotone"
              dataKey="net"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2}
              dot={{ fill: "hsl(217, 91%, 60%)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
