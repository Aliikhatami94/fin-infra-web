"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TradePanel() {
  const [orderType, setOrderType] = useState<"market" | "limit">("market")

  return (
    <Card className="card-standard">
      <CardHeader>
        <CardTitle>Trade</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Button
                variant={orderType === "market" ? "default" : "outline"}
                size="sm"
                onClick={() => setOrderType("market")}
                className="flex-1"
              >
                Market
              </Button>
              <Button
                variant={orderType === "limit" ? "default" : "outline"}
                size="sm"
                onClick={() => setOrderType("limit")}
                className="flex-1"
              >
                Limit
              </Button>
            </div>

            {orderType === "limit" && (
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" placeholder="0.00" />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total">Total</Label>
              <Input id="total" type="number" placeholder="0.00" disabled />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Available</span>
              <span className="font-medium">$12,450.00</span>
            </div>

            <Button className="w-full bg-success hover:bg-success/90 text-success-foreground">Buy AAPL</Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Button
                variant={orderType === "market" ? "default" : "outline"}
                size="sm"
                onClick={() => setOrderType("market")}
                className="flex-1"
              >
                Market
              </Button>
              <Button
                variant={orderType === "limit" ? "default" : "outline"}
                size="sm"
                onClick={() => setOrderType("limit")}
                className="flex-1"
              >
                Limit
              </Button>
            </div>

            {orderType === "limit" && (
              <div className="space-y-2">
                <Label htmlFor="sell-price">Price</Label>
                <Input id="sell-price" type="number" placeholder="0.00" />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="sell-amount">Amount</Label>
              <Input id="sell-amount" type="number" placeholder="0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sell-total">Total</Label>
              <Input id="sell-total" type="number" placeholder="0.00" disabled />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Available</span>
              <span className="font-medium">50 AAPL</span>
            </div>

            <Button className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Sell AAPL
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
