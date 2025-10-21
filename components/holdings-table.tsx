"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

const holdings = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    qty: 150,
    value: 28500,
    pl: 4250,
    plPercent: 17.5,
    weight: 15.2,
    account: "Fidelity",
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corp.",
    qty: 100,
    value: 42000,
    pl: 8200,
    plPercent: 24.3,
    weight: 22.4,
    account: "Fidelity",
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    qty: 80,
    value: 11200,
    pl: -850,
    plPercent: -7.1,
    weight: 6.0,
    account: "Fidelity",
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    qty: 50,
    value: 12750,
    pl: 2100,
    plPercent: 19.7,
    weight: 6.8,
    account: "Robinhood",
  },
  {
    ticker: "AMZN",
    name: "Amazon.com Inc.",
    qty: 75,
    value: 13500,
    pl: 1850,
    plPercent: 15.9,
    weight: 7.2,
    account: "Fidelity",
  },
]

export function HoldingsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">Ticker</th>
                <th className="pb-3 font-medium">Quantity</th>
                <th className="pb-3 font-medium text-right">Value</th>
                <th className="pb-3 font-medium text-right">P/L</th>
                <th className="pb-3 font-medium text-right">Weight</th>
                <th className="pb-3 font-medium">Account</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => (
                <tr key={holding.ticker} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{holding.ticker}</p>
                      <p className="text-xs text-muted-foreground">{holding.name}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="text-sm tabular-nums text-foreground">{holding.qty}</p>
                  </td>
                  <td className="py-4 text-right">
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                      ${holding.value.toLocaleString()}
                    </p>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <p
                        className={`text-sm font-semibold tabular-nums ${
                          holding.pl > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {holding.pl > 0 ? "+" : ""}${holding.pl.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1">
                        {holding.plPercent > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                        )}
                        <span
                          className={`text-xs tabular-nums ${
                            holding.plPercent > 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {holding.plPercent > 0 ? "+" : ""}
                          {holding.plPercent}%
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <p className="text-sm tabular-nums text-foreground">{holding.weight}%</p>
                  </td>
                  <td className="py-4">
                    <Badge variant="outline">{holding.account}</Badge>
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
