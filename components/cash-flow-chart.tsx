"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, CartesianGrid, Line, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

const monthlyData = [
  { month: "Jan", inflow: 8500, outflow: 6200, net: 2300 },
  { month: "Feb", inflow: 8500, outflow: 5800, net: 2700 },
  { month: "Mar", inflow: 9200, outflow: 6500, net: 2700 },
  { month: "Apr", inflow: 8500, outflow: 7100, net: 1400 },
  { month: "May", inflow: 8500, outflow: 6800, net: 1700 },
  { month: "Jun", inflow: 10200, outflow: 6400, net: 3800 },
]

export function CashFlowChart() {
  const [period, setPeriod] = useState("month")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cash Flow</CardTitle>
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="quarter">Quarter</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
            <Bar dataKey="inflow" fill="oklch(0.55 0.12 145)" name="Inflow" />
            <Bar dataKey="outflow" fill="oklch(0.58 0.18 25)" name="Outflow" />
            <Line type="monotone" dataKey="net" stroke="oklch(0.4 0.1 250)" strokeWidth={2} name="Net" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
