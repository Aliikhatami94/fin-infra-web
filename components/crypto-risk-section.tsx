"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Info, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { SEMANTIC_COLORS, CHART_STYLES } from "@/lib/chart-colors"

const riskData = [
  { name: "Low Risk (BTC, ETH, Stablecoins)", value: 42, color: SEMANTIC_COLORS.positive },
  { name: "Medium Risk (Large-cap Altcoins)", value: 35, color: SEMANTIC_COLORS.warning },
  { name: "High Risk (Small-cap/DeFi)", value: 23, color: SEMANTIC_COLORS.negative },
]

export function CryptoRiskSection() {
  const router = useRouter()

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="card-standard">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Risk Allocation
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie 
                data={riskData} 
                cx="50%" 
                cy="50%" 
                innerRadius={60} 
                outerRadius={90} 
                paddingAngle={CHART_STYLES.pie.paddingAngle} 
                dataKey="value"
                stroke="transparent"
                strokeWidth={CHART_STYLES.pie.strokeWidth}
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border rounded-lg p-3 shadow-lg">
                        <p className="text-sm font-semibold">{payload[0].name}</p>
                        <p className="text-lg font-bold">{payload[0].value}%</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {riskData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="card-standard">
        <CardHeader>
          <CardTitle>Tax & Compliance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground mb-1">Tax Season Reminder</p>
              <p className="text-xs text-muted-foreground mb-3">
                You have realized gains that may be subject to capital gains tax. Review your transactions and download
                tax reports.
              </p>
              <Button size="sm" variant="outline" onClick={() => router.push("/taxes")}>
                View Tax Reports
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-foreground">DeFi Holdings</p>
                <p className="text-xs text-muted-foreground">Staked & LP positions</p>
              </div>
              <p className="text-lg font-bold text-foreground">$2,450</p>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-foreground">NFT Portfolio</p>
                <p className="text-xs text-muted-foreground">Floor value estimate</p>
              </div>
              <p className="text-lg font-bold text-foreground">$1,280</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
