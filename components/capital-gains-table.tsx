"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const gains = [
  { asset: "AAPL", type: "Long-term", gain: 4250, date: "Dec 15, 2024", holdingPeriod: "18 months" },
  { asset: "MSFT", type: "Long-term", gain: 8200, date: "Nov 22, 2024", holdingPeriod: "24 months" },
  { asset: "GOOGL", type: "Short-term", gain: -850, date: "Dec 5, 2024", holdingPeriod: "8 months" },
  { asset: "TSLA", type: "Short-term", gain: 2100, date: "Dec 1, 2024", holdingPeriod: "6 months" },
]

export function CapitalGainsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Realized Gains & Losses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">Asset</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium text-right">Gain/Loss</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Holding Period</th>
              </tr>
            </thead>
            <tbody>
              {gains.map((gain, index) => (
                <tr key={index} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-4">
                    <p className="text-sm font-semibold text-foreground">{gain.asset}</p>
                  </td>
                  <td className="py-4">
                    <Badge variant={gain.type === "Long-term" ? "default" : "secondary"}>{gain.type}</Badge>
                  </td>
                  <td className="py-4 text-right">
                    <p
                      className={`text-sm font-semibold tabular-nums ${
                        gain.gain > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {gain.gain > 0 ? "+" : ""}${gain.gain.toLocaleString()}
                    </p>
                  </td>
                  <td className="py-4">
                    <p className="text-sm text-muted-foreground">{gain.date}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-sm text-muted-foreground">{gain.holdingPeriod}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
