"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const bids = [
  { price: 185.7, amount: 1250, total: 232125 },
  { price: 185.65, amount: 890, total: 165229 },
  { price: 185.6, amount: 2100, total: 389760 },
  { price: 185.55, amount: 1560, total: 289458 },
  { price: 185.5, amount: 3200, total: 593600 },
]

const asks = [
  { price: 185.8, amount: 980, total: 182084 },
  { price: 185.85, amount: 1450, total: 269483 },
  { price: 185.9, amount: 2300, total: 427570 },
  { price: 185.95, amount: 1100, total: 204545 },
  { price: 186.0, amount: 2800, total: 520800 },
]

export function OrderBook() {
  return (
    <Card className="card-standard">
      <CardHeader>
        <CardTitle>Order Book</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Bids */}
          <div>
            <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground mb-2">
              <div>Price</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Total</div>
            </div>
            <div className="space-y-1">
              {bids.map((bid, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-success font-mono">${bid.price}</div>
                  <div className="text-right font-mono">{bid.amount}</div>
                  <div className="text-right text-muted-foreground font-mono">${bid.total.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Asks */}
          <div>
            <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground mb-2">
              <div>Price</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Total</div>
            </div>
            <div className="space-y-1">
              {asks.map((ask, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-destructive font-mono">${ask.price}</div>
                  <div className="text-right font-mono">{ask.amount}</div>
                  <div className="text-right text-muted-foreground font-mono">${ask.total.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
