"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, XAxis, YAxis, CartesianGrid, Line, ComposedChart, ReferenceLine, Label } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMemo, useState, useEffect } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { fetchActivityFeed } from "@/lib/api/client"
import { isMarketingMode } from "@/lib/marketingMode"
import { parseISO, format, startOfMonth, subMonths, differenceInMonths } from "date-fns"

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
    color: "hsl(var(--foreground))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--foreground))",
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
        // Fetch activity feed for the period (approximate days = months * 30)
        const days = months * 30
        const response = await fetchActivityFeed(days, 'banking')
        
        // Calculate cash flow by month from banking transactions
        const monthlyData = new Map<string, { income: number; expenses: number }>()
        
        // Initialize months
        const now = new Date()
        for (let i = 0; i < months; i++) {
          const monthDate = subMonths(startOfMonth(now), months - i - 1)
          const monthKey = format(monthDate, 'yyyy-MM')
          monthlyData.set(monthKey, { income: 0, expenses: 0 })
        }
        
        // Aggregate transactions by month
        response.activities.forEach((activity) => {
          if (!activity.date || !activity.amount) return
          
          const date = parseISO(activity.date)
          const monthKey = format(startOfMonth(date), 'yyyy-MM')
          
          if (!monthlyData.has(monthKey)) return
          
          const data = monthlyData.get(monthKey)!
          if (activity.amount > 0) {
            data.income += activity.amount
          } else {
            data.expenses += Math.abs(activity.amount)
          }
        })
        
        // Convert to array format
        const cashFlow: CashFlowPoint[] = []
        monthlyData.forEach((data, monthKey) => {
          cashFlow.push({
            month: format(parseISO(monthKey + '-01'), 'MMM'),
            income: data.income,
            expenses: data.expenses,
            net: data.income - data.expenses,
          })
        })
        
        setCashFlowData(cashFlow)
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">Cash Flow</CardTitle>
          <CardDescription className="text-sm">Income vs expenses with net cash flow trend</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px] h-9 text-xs font-medium">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6M">Last 6 Months</SelectItem>
            <SelectItem value="1Y">Last Year</SelectItem>
            <SelectItem value="ALL">All Time</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-2">
        {isLoading ? (
          <div className="flex h-[320px] items-center justify-center">
            <div className="text-muted-foreground">Loading cash flow data...</div>
          </div>
        ) : (
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <ComposedChart data={cashFlowData} margin={{ left: 0, right: 0, top: 20, bottom: 0 }} barGap={2} barCategoryGap="25%" className="text-foreground">
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.9} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.5} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0.25} />
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
              tickMargin={10}
              className="text-xs font-semibold text-muted-foreground"
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs font-semibold text-muted-foreground"
              tick={{ fill: "currentColor" }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              width={40}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  labelFormatter={(label) => `${label}`}
                  formatter={(value, name) => {
                    const label = name === "income" ? "Income" : "Expenses"
                    return [
                      <div key="value" className="flex items-center justify-between gap-4 w-full">
                        <span className="text-muted-foreground">{label}:</span>
                        <span className="font-semibold">${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    ]
                  }}
                />
              }
              cursor={false}
            />
            <ChartLegend 
              content={<ChartLegendContent className="gap-6" />} 
              verticalAlign="top" 
              height={40}
              wrapperStyle={{ paddingBottom: '10px' }}
            />
            <ReferenceLine y={averageIncome} strokeDasharray="5 5" strokeOpacity={0.4} strokeWidth={1.5} className="stroke-muted-foreground">
              <Label 
                value={`avg income $${(averageIncome / 1000).toFixed(1)}k`}
                position="insideTopLeft" 
                offset={5} 
                fill="currentColor"
                fontSize={10} 
                fontWeight={200}
                className="hidden sm:block text-muted-foreground" 
              />
            </ReferenceLine>
            <Bar dataKey="income" fill="url(#colorIncome)" radius={[8, 8, 0, 0]} maxBarSize={50} />
            <Bar dataKey="expenses" fill="url(#colorExpenses)" radius={[8, 8, 0, 0]} maxBarSize={50} />
          </ComposedChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
