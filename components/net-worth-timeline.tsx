"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useState, useMemo, useEffect } from "react"
import { useDateRange } from "@/components/date-range-provider"
import { LINE_CHART_COLORS, CHART_STYLES } from "@/lib/chart-colors"
import { fetchNetWorthHistory } from "@/lib/api/client"
import { isMarketingMode } from "@/lib/marketingMode"

type NetWorthPoint = {
  index: number
  date: string
  netWorth: number
  assets: number
  liabilities: number
}

const generateMockData = (days: number): NetWorthPoint[] => {
  const data: NetWorthPoint[] = []
  let netWorth = 100000
  let assets = 120000
  let liabilities = 20000

  const now = Date.now()
  
  for (let i = 0; i < days; i++) {
    // Simulate gradual growth with some volatility
    netWorth += (Math.random() - 0.4) * 800 + 150
    assets += (Math.random() - 0.4) * 900 + 180
    liabilities += (Math.random() - 0.5) * 100
    
    // Calculate date going backwards from now
    const dateMs = now - (days - i - 1) * 24 * 60 * 60 * 1000
    const date = new Date(dateMs)
    
    data.push({
      index: i,
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      netWorth,
      assets,
      liabilities,
    })
  }
  return data
}

export function NetWorthTimeline() {
  const { dateRange } = useDateRange()
  const [historyData, setHistoryData] = useState<NetWorthPoint[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Fetch real net worth history from backend
  useEffect(() => {
    // Marketing mode: show mock data
    if (isMarketingMode()) {
      return
    }

    const periodMap: Record<typeof dateRange, Parameters<typeof fetchNetWorthHistory>[0]> = {
      "1D": "1d",
      "5D": "1w",
      "1M": "1m",
      "6M": "6m",
      YTD: "ytd",
      "1Y": "1y",
      ALL: "all",
    }

    const fetchData = async () => {
      setIsLoading(true)
      setHasError(false)
      try {
        const response = await fetchNetWorthHistory(periodMap[dateRange], "daily")
        
        // Transform backend data to chart format
        const transformedData: NetWorthPoint[] = response.data.map((point, index) => {
          const date = new Date(point.date)
          
          return {
            index,
            date: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            netWorth: point.net_worth,
            assets: point.assets,
            liabilities: point.liabilities,
          }
        })
        
        setHistoryData(transformedData)
      } catch (error) {
        console.error("Failed to fetch net worth history:", error)
        setHasError(true)
        setHistoryData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  // Marketing mode: show mock data
  const data = useMemo(() => {
    if (isMarketingMode()) {
      const daysMap = {
        "1D": 1,
        "5D": 5,
        "1M": 30,
        "6M": 180,
        YTD: Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)),
        "1Y": 365,
        ALL: 730,
      }
      return generateMockData(daysMap[dateRange])
    }
    return historyData || []
  }, [dateRange, historyData])

  // Don't show chart if:
  // 1. Not in marketing mode AND
  // 2. (Loading, error, or insufficient data - need at least 7 days)
  if (!isMarketingMode()) {
    if (isLoading || hasError || !historyData || historyData.length < 7) {
      return null
    }
  }

  const stats = useMemo(() => {
    if (data.length === 0) return null
    
    const current = data[data.length - 1]
    const previous = data[0]
    const change = current.netWorth - previous.netWorth
    const changePercent = ((change / previous.netWorth) * 100).toFixed(2)
    
    return {
      current: current.netWorth,
      change,
      changePercent,
      isPositive: change >= 0,
    }
  }, [data])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Net Worth</h2>
      <Card className="border-border/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Net Worth Over Time</CardTitle>
          {stats && (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                ${stats.current.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
              <span className={`text-sm ${stats.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stats.isPositive ? '+' : ''}{stats.changePercent}%
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={LINE_CHART_COLORS.primary.stroke} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={LINE_CHART_COLORS.primary.stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="rounded-lg border bg-card p-3 shadow-sm">
                        <p className="text-xs text-muted-foreground mb-2">{data.date}</p>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground">
                            Net Worth: ${data.netWorth.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Assets: ${data.assets.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Liabilities: ${data.liabilities.toLocaleString('en-US', { minimumFractionDigits: 0 })}
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
                stroke={LINE_CHART_COLORS.primary.stroke}
                strokeWidth={2}
                fill="url(#netWorthGradient)"
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  )
}
