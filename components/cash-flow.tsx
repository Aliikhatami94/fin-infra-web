"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const cashFlowData = [
  { month: "Jan", income: 8500, expenses: 5200 },
  { month: "Feb", income: 8500, expenses: 5800 },
  { month: "Mar", income: 9200, expenses: 5400 },
  { month: "Apr", income: 8500, expenses: 6100 },
  { month: "May", income: 8500, expenses: 5300 },
  { month: "Jun", income: 10200, expenses: 5900 },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium mb-2">{payload[0].payload.month}</p>
        <div className="space-y-1">
          <p className="text-sm" style={{ color: "hsl(142, 76%, 45%)" }}>
            Income: ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Expenses: ${payload[1].value.toLocaleString()}</p>
        </div>
      </div>
    )
  }
  return null
}

export function CashFlow() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow</CardTitle>
        <CardDescription>Income vs expenses over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={cashFlowData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
            <Bar dataKey="income" fill="hsl(142, 76%, 45%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="hsl(24, 95%, 53%)" radius={[4, 4, 0, 0]} opacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
