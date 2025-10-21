"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const allocationData = {
  assetClass: [
    { name: "Stocks", value: 65, color: "hsl(var(--chart-1))" },
    { name: "Bonds", value: 20, color: "hsl(var(--chart-2))" },
    { name: "Cash", value: 10, color: "hsl(var(--chart-3))" },
    { name: "Crypto", value: 5, color: "hsl(var(--chart-4))" },
  ],
  sector: [
    { name: "Technology", value: 35, color: "hsl(var(--chart-1))" },
    { name: "Healthcare", value: 25, color: "hsl(var(--chart-2))" },
    { name: "Finance", value: 20, color: "hsl(var(--chart-3))" },
    { name: "Consumer", value: 15, color: "hsl(var(--chart-4))" },
    { name: "Other", value: 5, color: "hsl(var(--chart-5))" },
  ],
}

export function AllocationChart() {
  const [view, setView] = useState<"assetClass" | "sector">("assetClass")
  const data = allocationData[view]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Portfolio Allocation</CardTitle>
          <Tabs value={view} onValueChange={(v) => setView(v as any)}>
            <TabsList className="h-8">
              <TabsTrigger value="assetClass" className="text-xs">
                Asset Class
              </TabsTrigger>
              <TabsTrigger value="sector" className="text-xs">
                Sector
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="h-48 w-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-card p-2 shadow-sm">
                          <div className="text-sm font-medium">{payload[0].name}</div>
                          <div className="text-xs text-muted-foreground">{payload[0].value}%</div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-mono font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
