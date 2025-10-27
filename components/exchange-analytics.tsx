"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Plus, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { createStaggeredCardVariants } from "@/lib/motion-variants"

const exchangeData = [
  {
    name: "Coinbase",
    connected: true,
    totalValue: 42072.95,
    pl: 8234.5,
    plPercent: 24.3,
    assets: 3,
    lastSync: "2 min ago",
  },
  {
    name: "Binance",
    connected: true,
    totalValue: 8656.5,
    pl: -432.8,
    plPercent: -4.8,
    assets: 2,
    lastSync: "5 min ago",
  },
  {
    name: "Kraken",
    connected: false,
    totalValue: 0,
    pl: 0,
    plPercent: 0,
    assets: 0,
    lastSync: null,
  },
]

interface ExchangeAnalyticsProps {
  selectedExchange: "All" | "Coinbase" | "Binance"
}

export function ExchangeAnalytics({ selectedExchange }: ExchangeAnalyticsProps) {
  const filteredExchanges =
    selectedExchange === "All" ? exchangeData : exchangeData.filter((e) => e.name === selectedExchange)

  return (
    <Card className="card-standard">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Exchange Analytics</CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Link Exchange
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredExchanges.map((exchange, index) => (
            <motion.div key={exchange.name} {...createStaggeredCardVariants(index, 0)}>
              <Card className="card-standard card-lift">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{exchange.name}</h3>
                      {exchange.lastSync && <p className="text-xs text-muted-foreground">Synced {exchange.lastSync}</p>}
                    </div>
                    <Badge variant={exchange.connected ? "default" : "outline"}>
                      {exchange.connected ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>

                  {exchange.connected ? (
                    <>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Total Value</p>
                        <p className="text-2xl font-bold tabular-nums">${exchange.totalValue.toLocaleString()}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/30">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">P/L</p>
                          <div className="flex items-center gap-1">
                            {exchange.pl >= 0 ? (
                              <TrendingUp className="h-3 w-3 text-[var(--color-positive)]" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-[var(--color-negative)]" />
                            )}
                            <span
                              className={`text-sm font-semibold tabular-nums ${
                                exchange.pl >= 0 ? "text-[var(--color-positive)]" : "text-[var(--color-negative)]"
                              }`}
                            >
                              {exchange.pl >= 0 ? "+" : ""}${Math.abs(exchange.pl).toLocaleString()}
                            </span>
                            <span
                              className={`text-xs tabular-nums ${
                                exchange.pl >= 0 ? "text-[var(--color-positive)]" : "text-[var(--color-negative)]"
                              }`}
                            >
                              ({exchange.plPercent >= 0 ? "+" : ""}
                              {exchange.plPercent}%)
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground mb-1">Assets</p>
                          <p className="text-sm font-medium">{exchange.assets}</p>
                        </div>
                      </div>

                      <Button variant="ghost" size="sm" className="w-full gap-2">
                        View on {exchange.name}
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-sm text-muted-foreground mb-3">Connect your {exchange.name} account</p>
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Connect
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
