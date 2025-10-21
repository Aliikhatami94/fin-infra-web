"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const trades = [
  { time: "15:59:45", price: 185.75, amount: 120, type: "buy" },
  { time: "15:59:42", price: 185.7, amount: 85, type: "sell" },
  { time: "15:59:38", price: 185.72, amount: 200, type: "buy" },
  { time: "15:59:35", price: 185.68, amount: 150, type: "sell" },
  { time: "15:59:30", price: 185.7, amount: 95, type: "buy" },
]

export function RecentTrades() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground">
            <div>Time</div>
            <div className="text-right">Price</div>
            <div className="text-right">Amount</div>
          </div>
          {trades.map((trade, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-muted-foreground">{trade.time}</div>
              <div className={`text-right font-mono ${trade.type === "buy" ? "text-success" : "text-destructive"}`}>
                ${trade.price}
              </div>
              <div className="text-right font-mono">{trade.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
