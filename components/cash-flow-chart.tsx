"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bar,
  CartesianGrid,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Cell,
} from "recharts"
import type { TooltipContentProps } from "recharts"
import { Calendar, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const monthlyData: CashFlowDatum[] = [
  { month: "Jan", inflow: 8500, outflow: 6200, net: 2300 },
  { month: "Feb", inflow: 8500, outflow: 5800, net: 2700 },
  { month: "Mar", inflow: 9200, outflow: 6500, net: 2700 },
  { month: "Apr", inflow: 8500, outflow: 7100, net: 1400 },
  { month: "May", inflow: 8500, outflow: 6800, net: 1700 },
  { month: "Jun", inflow: 10200, outflow: 6400, net: 3800 },
  { month: "Jul", inflow: 8800, outflow: 6300, net: 2500, isProjection: true },
]

interface CashFlowDatum {
  month: string
  inflow: number
  outflow: number
  net: number
  isProjection?: boolean
}

type CashFlowTooltipProps = TooltipContentProps<number, string>

const CustomTooltip = ({ active, payload }: CashFlowTooltipProps) => {
  if (active && payload && payload.length) {
    const inflowPayload = payload.find((p) => p.dataKey === "inflow")?.value
    const outflowPayload = payload.find((p) => p.dataKey === "outflow")?.value
    const netPayload = payload.find((p) => p.dataKey === "net")?.value
    const inflow = typeof inflowPayload === "number" ? inflowPayload : Number(inflowPayload ?? 0)
    const outflow = typeof outflowPayload === "number" ? outflowPayload : Number(outflowPayload ?? 0)
    const net = typeof netPayload === "number" ? netPayload : Number(netPayload ?? 0)
    const dataPoint = payload[0]?.payload as CashFlowDatum | undefined
    const isProjection = dataPoint?.isProjection

    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-sm font-medium">{dataPoint?.month}</p>
          {isProjection && (
            <Badge variant="secondary" className="text-xs">
              Forecast
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm text-green-500">
            Inflow: ${inflow.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-orange-500">
            Outflow: ${outflow.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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

export interface CashFlowChartProps {
  onMonthClick?: (month: string | null) => void
  selectedMonth?: string | null
}

export function CashFlowChart({ onMonthClick, selectedMonth }: CashFlowChartProps) {
  const [period, setPeriod] = useState("month")
  const [account, setAccount] = useState("all")

  const historicalData = monthlyData.filter((d) => !d.isProjection)
  const avgNet = historicalData.reduce((sum, d) => sum + d.net, 0) / historicalData.length
  const projectionData = monthlyData.find((d) => d.isProjection)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CardTitle>Cash Flow Overview</CardTitle>
            <Select value={account} onValueChange={setAccount}>
              <SelectTrigger className="w-[160px] h-8 text-xs">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                <SelectItem value="checking">Checking Only</SelectItem>
                <SelectItem value="chase">Chase Total Checking</SelectItem>
                <SelectItem value="fidelity">Fidelity Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1 border rounded-md">
            <Button variant={period === "month" ? "default" : "ghost"} size="sm" onClick={() => setPeriod("month")}>
              Month
            </Button>
            <Button variant={period === "quarter" ? "default" : "ghost"} size="sm" onClick={() => setPeriod("quarter")}>
              Quarter
            </Button>
            <Button variant={period === "year" ? "default" : "ghost"} size="sm" onClick={() => setPeriod("year")}>
              Year
            </Button>
            <Button variant="ghost" size="sm">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {projectionData && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">July Forecast:</span> Net flow of $
              {projectionData.net.toLocaleString()} based on 6-month average
            </p>
          </div>
        )}
        {selectedMonth && (
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              Filtered: {selectedMonth}
            </Badge>
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => onMonthClick?.(null)}>
              Clear
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={CustomTooltip} cursor={{ fill: "transparent" }} />
            <Legend />
            <Bar
              dataKey="inflow"
              fill="hsl(142, 76%, 45%)"
              name="Inflow"
              radius={[4, 4, 0, 0]}
              onClick={(_, index) => onMonthClick?.(monthlyData[index].month)}
              cursor="pointer"
            >
              {monthlyData.map((entry, index) => {
                const dimmed = entry.isProjection ? 0.5 : selectedMonth && entry.month !== selectedMonth ? 0.3 : 1
                return <Cell key={`inflow-${index}`} opacity={dimmed} />
              })}
            </Bar>
            <Bar
              dataKey="outflow"
              fill="hsl(24, 95%, 53%)"
              name="Outflow"
              radius={[4, 4, 0, 0]}
              onClick={(_, index) => onMonthClick?.(monthlyData[index].month)}
              cursor="pointer"
            >
              {monthlyData.map((entry, index) => {
                const dimmed = entry.isProjection ? 0.5 : selectedMonth && entry.month !== selectedMonth ? 0.3 : 0.8
                return <Cell key={`outflow-${index}`} opacity={dimmed} />
              })}
            </Bar>
            <Line
              type="monotone"
              dataKey="net"
              stroke="hsl(210, 100%, 60%)"
              strokeWidth={3}
              name="Net Flow"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
