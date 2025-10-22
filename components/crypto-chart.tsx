"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { TooltipContentProps } from "recharts"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"

interface CryptoDatum {
  date: string
  btc: number
  eth: number
  other: number
  stablecoins: number
  transaction: { type: "buy" | "sell"; amount: string } | null
}

const data: CryptoDatum[] = [
  { date: "Jan", btc: 8500, eth: 3200, other: 2100, stablecoins: 500, transaction: null },
  { date: "Feb", btc: 9200, eth: 3800, other: 2400, stablecoins: 600, transaction: { type: "buy", amount: "$1,200" } },
  { date: "Mar", btc: 10100, eth: 4200, other: 2800, stablecoins: 700, transaction: null },
  { date: "Apr", btc: 11500, eth: 4800, other: 3200, stablecoins: 800, transaction: { type: "sell", amount: "$800" } },
  { date: "May", btc: 10800, eth: 4400, other: 2900, stablecoins: 750, transaction: null },
  { date: "Jun", btc: 12400, eth: 5100, other: 3400, stablecoins: 900, transaction: { type: "buy", amount: "$2,000" } },
]

const timeRanges = ["1D", "7D", "30D", "6M", "1Y", "All"] as const

type TimeRange = (typeof timeRanges)[number]

interface CryptoChartProps {
  showStablecoins: boolean
  onToggleStablecoins: (value: boolean) => void
}

type CryptoTooltipProps = TooltipContentProps<number, string>

export function CryptoChart({ showStablecoins, onToggleStablecoins }: CryptoChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("30D")

  return (
    <Card className="card-standard">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Portfolio Value Over Time</CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch id="stablecoins" checked={showStablecoins} onCheckedChange={onToggleStablecoins} />
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
            <AnimatePresence mode="wait">
              <motion.div
                key={showStablecoins ? "with-stable" : "without-stable"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    content={({ active, payload }: CryptoTooltipProps) => {
                      if (active && payload && payload.length) {
                        const datum = payload[0]?.payload as CryptoDatum | undefined
                        if (!datum) {
                          return null
                        }

                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="text-sm font-semibold mb-2">{datum.date}</p>
                            {payload.map((entry) => {
                              if (!entry?.name) {
                                return null
                              }
                              const value = typeof entry.value === "number" ? entry.value : Number(entry.value ?? 0)
                              return (
                                <div key={entry.name} className="flex items-center justify-between gap-4 text-xs">
                                  <span style={{ color: entry.color ?? "inherit" }}>{entry.name}:</span>
                                  <span className="font-semibold">${value.toLocaleString()}</span>
                                </div>
                              )
                            })}
                            {datum.transaction && (
                              <div className="mt-2 pt-2 border-t text-xs">
                                <span className={datum.transaction.type === "buy" ? "text-green-600" : "text-red-600"}>
                                  {datum.transaction.type === "buy" ? "Buy" : "Sell"}: {datum.transaction.amount}
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
              </motion.div>
            </AnimatePresence>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
