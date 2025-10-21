"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Star } from "lucide-react"

const watchlist = [
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 495.2, change: 3.45 },
  { symbol: "AMD", name: "Advanced Micro Devices", price: 148.75, change: -1.2 },
  { symbol: "META", name: "Meta Platforms", price: 382.5, change: 2.15 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 152.3, change: 1.8 },
  { symbol: "NFLX", name: "Netflix Inc.", price: 485.9, change: -0.65 },
]

export function Watchlist() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Watchlist</CardTitle>
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {watchlist.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Star className="h-4 w-4" />
                </Button>
                <div>
                  <p className="font-medium">{stock.symbol}</p>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${stock.price}</p>
                <p className={`text-sm ${stock.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
