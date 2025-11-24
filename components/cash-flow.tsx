"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, XAxis, YAxis, CartesianGrid, Line, ComposedChart, ReferenceLine, Label } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMemo, useState, useEffect } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { fetchCashFlowHistory } from "@/lib/api/client"
import { isMarketingMode } from "@/lib/marketingMode"

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
    color: "hsl(142, 71%, 45%)",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(0, 72%, 51%)",
  },
} satisfies ChartConfig

export function CashFlow() {
  const [timeRange, setTimeRange] = useState("1Y")
  const [cashFlowData, setCashFlowData] = useState<CashFlowPoint[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { averageIncome, averageExpenses } = useMemo(() => {
    if (!cashFlowData.length) return { averageIncome: 0, averageExpenses: 0 }
    const totalIncome = cashFlowData.reduce((sum, item) => sum + item.income, 0)
    const totalExpenses = cashFlowData.reduce((sum, item) => sum + item.expenses, 0)
    return {
      averageIncome: totalIncome / cashFlowData.length,
      averageExpenses: totalExpenses / cashFlowData.length,
    }
  }, [cashFlowData])

  // Fetch real cash flow data from backend
  useEffect(() => {
    const monthsMap: Record<string, number> = {
      "6M": 6,
      "1Y": 12,
      "ALL": 24,
    }
    const months = monthsMap[timeRange] || 12

    // Marketing mode: use mock data
    if (isMarketingMode()) {
      setCashFlowData(generateCashFlowData(months))
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetchCashFlowHistory(months)
        console.log('Cash flow data received:', response.data)
        setCashFlowData(response.data)
      } catch (error) {
        console.error("Failed to fetch cash flow history:", error)
        // Fallback to empty array if no banking connection
        setCashFlowData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  // Don't show chart if no data and not in marketing mode
  if (!isMarketingMode() && cashFlowData.length === 0 && !isLoading) {
    return null
  }

  return (
    <Card className="card-standard">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Cash Flow</CardTitle>
          <CardDescription>Income vs expenses with net cash flow trend</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6M">Last 6 Months</SelectItem>
            <SelectItem value="1Y">Last Year</SelectItem>
            <SelectItem value="ALL">All Time</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[280px] items-center justify-center">
            <div className="text-muted-foreground">Loading cash flow data...</div>
          </div>
        ) : (
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <ComposedChart data={cashFlowData} margin={{ left: 0, right: 0, top: 20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.4}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.4}/>
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="stroke-muted/10"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              className="text-[11px] font-medium"
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              className="text-[11px] font-medium"
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              width={35}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  labelFormatter={(label) => `${label}`}
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString()}`,
                    name === "income" ? "Income" : "Expenses"
                  ]}
                />
              }
              cursor={{ fill: "hsl(var(--muted)/0.2)" }}
            />
            <ChartLegend content={<ChartLegendContent />} verticalAlign="top" height={36}/>
            <ReferenceLine y={averageIncome} stroke="hsl(142, 71%, 45%)" strokeDasharray="3 3" strokeOpacity={0.4}>
              <Label value="avg income" position="insideBottomLeft" offset={10} fill="hsl(var(--muted-foreground))" fontSize={10} className="hidden sm:block" />
            </ReferenceLine>
            <Bar dataKey="income" fill="url(#colorIncome)" radius={[8, 8, 0, 0]} maxBarSize={60} />
            <Bar dataKey="expenses" fill="url(#colorExpenses)" radius={[8, 8, 0, 0]} maxBarSize={48} />
          </ComposedChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
