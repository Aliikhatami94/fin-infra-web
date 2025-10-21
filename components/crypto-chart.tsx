"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { date: "Jan", btc: 8500, eth: 3200, other: 2100 },
  { date: "Feb", btc: 9200, eth: 3800, other: 2400 },
  { date: "Mar", btc: 10100, eth: 4200, other: 2800 },
  { date: "Apr", btc: 11500, eth: 4800, other: 3200 },
  { date: "May", btc: 10800, eth: 4400, other: 2900 },
  { date: "Jun", btc: 12400, eth: 5100, other: 3400 },
]

export function CryptoChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Value Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="btc"
              stackId="1"
              stroke="oklch(0.4 0.1 250)"
              fill="oklch(0.4 0.1 250)"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="eth"
              stackId="1"
              stroke="oklch(0.55 0.12 145)"
              fill="oklch(0.55 0.12 145)"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="other"
              stackId="1"
              stroke="oklch(0.58 0.18 25)"
              fill="oklch(0.58 0.18 25)"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
