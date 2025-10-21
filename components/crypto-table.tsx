"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

const cryptos = [
  { coin: "BTC", name: "Bitcoin", amount: 0.5, price: 45230.5, value: 22615.25, change24h: 9.2, exchange: "Coinbase" },
  { coin: "ETH", name: "Ethereum", amount: 5.2, price: 3150.8, value: 16384.16, change24h: 7.8, exchange: "Coinbase" },
  { coin: "SOL", name: "Solana", amount: 45, price: 98.5, value: 4432.5, change24h: -3.2, exchange: "Binance" },
  { coin: "AVAX", name: "Avalanche", amount: 120, price: 35.2, value: 4224, change24h: 5.4, exchange: "Binance" },
]

export function CryptoTable() {
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
                <th className="pb-3 font-medium">Coin</th>
                <th className="pb-3 font-medium text-right">Amount</th>
                <th className="pb-3 font-medium text-right">Price</th>
                <th className="pb-3 font-medium text-right">Value</th>
                <th className="pb-3 font-medium text-right">24h %</th>
                <th className="pb-3 font-medium">Exchange</th>
              </tr>
            </thead>
            <tbody>
              {cryptos.map((crypto) => (
                <tr key={crypto.coin} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{crypto.coin}</p>
                      <p className="text-xs text-muted-foreground">{crypto.name}</p>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <p className="text-sm tabular-nums text-foreground">{crypto.amount}</p>
                  </td>
                  <td className="py-4 text-right">
                    <p className="text-sm tabular-nums text-foreground">${crypto.price.toLocaleString()}</p>
                  </td>
                  <td className="py-4 text-right">
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                      ${crypto.value.toLocaleString()}
                    </p>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {crypto.change24h > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                      )}
                      <span
                        className={`text-sm font-medium tabular-nums ${
                          crypto.change24h > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {crypto.change24h > 0 ? "+" : ""}
                        {crypto.change24h}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <Badge variant="outline">{crypto.exchange}</Badge>
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
