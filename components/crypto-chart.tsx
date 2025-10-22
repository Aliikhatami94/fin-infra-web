"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const data = [
  { date: "Jan", btc: 8500, eth: 3200, other: 2100, stablecoins: 500, transaction: null },
  { date: "Feb", btc: 9200, eth: 3800, other: 2400, stablecoins: 600, transaction: { type: "buy", amount: "$1,200" } },
  { date: "Mar", btc: 10100, eth: 4200, other: 2800, stablecoins: 700, transaction: null },
  { date: "Apr", btc: 11500, eth: 4800, other: 3200, stablecoins: 800, transaction: { type: "sell", amount: "$800" } },
  { date: "May", btc: 10800, eth: 4400, other: 2900, stablecoins: 750, transaction: null },
  { date: "Jun", btc: 12400, eth: 5100, other: 3400, stablecoins: 900, transaction: { type: "buy", amount: "$2,000" } },
]

const timeRanges = ["1D", "7D", "30D", "6M", "1Y", "All"]

export function CryptoChart() {
  const [selectedRange, setSelectedRange] = useState("30D")
  const [showStablecoins, setShowStablecoins] = useState(false)

  return (
    <Card className="card-standard">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Portfolio Value Over Time</CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch id="stablecoins" checked={showStablecoins} onCheckedChange={setShowStablecoins} />
              <Label htmlFor="stablecoins" className="text-sm">
                Show Stablecoins
              </Label>
            </div>
            <div className="flex flex-wrap gap-1">
              {timeRanges.map((range) => (
                <Button
                  key={range}
                  variant={selectedRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRange(range)}
                  className="h-8 px-3"
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <ResponsiveContainer width="100%" height={350} minWidth={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="text-sm font-semibold mb-2">{data.date}</p>
                        {payload.map((entry: any) => (
                          <div key={entry.name} className="flex items-center justify-between gap-4 text-xs">
                            <span style={{ color: entry.color }}>{entry.name}:</span>
                            <span className="font-semibold">${entry.value.toLocaleString()}</span>
                          </div>
                        ))}
                        {data.transaction && (
                          <div className="mt-2 pt-2 border-t text-xs">
                            <span className={data.transaction.type === "buy" ? "text-green-600" : "text-red-600"}>
                              {data.transaction.type === "buy" ? "Buy" : "Sell"}: {data.transaction.amount}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="btc"
                stackId="1"
                stroke="hsl(210, 100%, 60%)"
                fill="hsl(210, 100%, 60%)"
                fillOpacity={0.6}
                name="BTC"
              />
              <Area
                type="monotone"
                dataKey="eth"
                stackId="1"
                stroke="hsl(145, 70%, 55%)"
                fill="hsl(145, 70%, 55%)"
                fillOpacity={0.6}
                name="ETH"
              />
              {showStablecoins && (
                <Area
                  type="monotone"
                  dataKey="stablecoins"
                  stackId="1"
                  stroke="hsl(45, 90%, 55%)"
                  fill="hsl(45, 90%, 55%)"
                  fillOpacity={0.6}
                  name="Stablecoins"
                />
              )}
              <Area
                type="monotone"
                dataKey="other"
                stackId="1"
                stroke="hsl(280, 70%, 60%)"
                fill="hsl(280, 70%, 60%)"
                fillOpacity={0.6}
                name="Other"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
