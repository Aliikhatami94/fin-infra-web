"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bar, CartesianGrid, Line, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { Calendar } from "lucide-react"

const monthlyData = [
  { month: "Jan", inflow: 8500, outflow: 6200, net: 2300 },
  { month: "Feb", inflow: 8500, outflow: 5800, net: 2700 },
  { month: "Mar", inflow: 9200, outflow: 6500, net: 2700 },
  { month: "Apr", inflow: 8500, outflow: 7100, net: 1400 },
  { month: "May", inflow: 8500, outflow: 6800, net: 1700 },
  { month: "Jun", inflow: 10200, outflow: 6400, net: 3800 },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const inflow = payload.find((p: any) => p.dataKey === "inflow")?.value || 0
    const outflow = payload.find((p: any) => p.dataKey === "outflow")?.value || 0
    const net = payload.find((p: any) => p.dataKey === "net")?.value || 0

    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium mb-2">{payload[0].payload.month}</p>
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

export function CashFlowChart() {
  const [period, setPeriod] = useState("month")
  const [account, setAccount] = useState("all")

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
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
            <Legend />
            <Bar dataKey="inflow" fill="hsl(142, 76%, 45%)" name="Inflow" radius={[4, 4, 0, 0]} />
            <Bar dataKey="outflow" fill="hsl(24, 95%, 53%)" name="Outflow" radius={[4, 4, 0, 0]} opacity={0.8} />
            <Line type="monotone" dataKey="net" stroke="hsl(210, 100%, 60%)" strokeWidth={3} name="Net Flow" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
