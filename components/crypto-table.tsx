"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Virtuoso } from "react-virtuoso"

const cryptos = [
  {
    coin: "BTC",
    name: "Bitcoin",
    amount: 0.5,
    costBasis: 38500,
    price: 45230.5,
    value: 22615.25,
    change24h: 9.2,
    exchange: "Coinbase",
    trend: [42000, 43000, 42500, 44000, 44500, 45230],
    isStablecoin: false,
    staking: null,
  },
  {
    coin: "ETH",
    name: "Ethereum",
    amount: 5.2,
    costBasis: 2800,
    price: 3150.8,
    value: 16384.16,
    change24h: 7.8,
    exchange: "Coinbase",
    trend: [2900, 3000, 2950, 3100, 3120, 3150],
    isStablecoin: false,
    staking: { enabled: true, apy: 4.2, rewards: 0.218 },
  },
  {
    coin: "SOL",
    name: "Solana",
    amount: 45,
    costBasis: 105,
    price: 98.5,
    value: 4432.5,
    change24h: -3.2,
    exchange: "Binance",
    trend: [102, 100, 99, 98, 97, 98.5],
    isStablecoin: false,
    staking: null,
  },
  {
    coin: "AVAX",
    name: "Avalanche",
    amount: 120,
    costBasis: 32,
    price: 35.2,
    value: 4224,
    change24h: 5.4,
    exchange: "Binance",
    trend: [33, 34, 33.5, 35, 35.5, 35.2],
    isStablecoin: false,
    staking: null,
  },
  {
    coin: "USDC",
    name: "USD Coin",
    amount: 3072.54,
    costBasis: 1,
    price: 1,
    value: 3072.54,
    change24h: 0,
    exchange: "Coinbase",
    trend: [1, 1, 1, 1, 1, 1],
    isStablecoin: true,
    staking: { enabled: true, apy: 5.5, rewards: 169.0 },
  },
]

type SortField = "coin" | "value" | "pl" | "weight"

interface CryptoTableProps {
  selectedExchange: "All" | "Coinbase" | "Binance"
  showStablecoins: boolean
  groupBy: "asset" | "exchange" | "staking"
}

type CryptoAsset = (typeof cryptos)[number]
type CryptoTableRow =
  | { type: "group"; label: string; totalValue: number; count: number }
  | { type: "asset"; asset: CryptoAsset; percent: number }

export function CryptoTable({ selectedExchange, showStablecoins, groupBy }: CryptoTableProps) {
  const router = useRouter()
  const [sortField, setSortField] = useState<SortField>("value")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const filteredCryptos = cryptos.filter((c) => {
    const exchangeMatch = selectedExchange === "All" || c.exchange === selectedExchange
    const stablecoinMatch = showStablecoins || !c.isStablecoin
    return exchangeMatch && stablecoinMatch
  })

  const totalValue = filteredCryptos.reduce((sum, c) => sum + c.value, 0)

  const sortedCryptos = [...filteredCryptos].sort((a, b) => {
    let aVal: string | number
    let bVal: string | number

    if (sortField === "coin") {
      aVal = a.coin
      bVal = b.coin
    } else if (sortField === "value") {
      aVal = a.value
      bVal = b.value
    } else if (sortField === "pl") {
      aVal = (a.price - a.costBasis) * a.amount
      bVal = (b.price - b.costBasis) * b.amount
    } else {
      aVal = (a.value / totalValue) * 100
      bVal = (b.value / totalValue) * 100
    }

    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1
    }
    return aVal < bVal ? 1 : -1
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const tableRows = useMemo<CryptoTableRow[]>(() => {
    if (groupBy === "asset") {
      return sortedCryptos.map((asset) => ({ type: "asset", asset, percent: (asset.value / totalValue) * 100 }))
    }

    const grouped = new Map<string, CryptoAsset[]>()
    sortedCryptos.forEach((asset) => {
      const key =
        groupBy === "exchange"
          ? asset.exchange
          : asset.staking?.enabled
            ? "Staking"
            : "Not staking"
      const bucket = grouped.get(key) ?? []
      bucket.push(asset)
      grouped.set(key, bucket)
    })

    const rows: CryptoTableRow[] = []
    grouped.forEach((assets, label) => {
      const groupValue = assets.reduce((sum, asset) => sum + asset.value, 0)
      rows.push({ type: "group", label, totalValue: groupValue, count: assets.length })
      assets.forEach((asset) => rows.push({ type: "asset", asset, percent: (asset.value / totalValue) * 100 }))
    })
    return rows
  }, [groupBy, sortedCryptos, totalValue])

  return (
    <Card className="card-standard">
      <CardHeader>
        <CardTitle>Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 md:hidden">
          {sortedCryptos.map((asset) => {
            const profitLoss = (asset.price - asset.costBasis) * asset.amount
            const profitLossPositive = profitLoss >= 0
            const weight = (asset.value / totalValue) * 100
            const trendColor = asset.change24h >= 0 ? "text-emerald-500" : "text-red-500"

            return (
              <div key={asset.coin} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <span className="text-sm font-semibold">{asset.coin}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{asset.name}</p>
                        {asset.staking?.enabled && (
                          <Badge variant="secondary" className="bg-purple-500/10 text-purple-600">
                            Staking
                          </Badge>
                        )}
                        {asset.isStablecoin && <Badge variant="outline">Stablecoin</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{asset.exchange}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/crypto/${asset.coin.toLowerCase()}`)}
                    aria-label={`Open ${asset.name} insights`}
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Value</p>
                    <p className="font-semibold">${asset.value.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Weight</p>
                    <p className="font-semibold">{weight.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">P/L</p>
                    <p className={profitLossPositive ? "text-emerald-500" : "text-red-500"}>
                      {profitLossPositive ? "+" : "-"}${Math.abs(profitLoss).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">24h</p>
                    <span className={trendColor}>{asset.change24h}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="hidden md:block">
          <div className="table-surface">
            <div
              className="grid grid-cols-[1.5fr_0.7fr_0.8fr_0.8fr_0.8fr] gap-4 border-b px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-xs uppercase tracking-wide text-muted-foreground"
              style={{ borderColor: "var(--table-divider)" }}
            >
              <span>Asset</span>
              <span className="text-right">Amount</span>
              <span className="text-right">
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleSort("value")} aria-label="Sort by value">
                  Value
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </span>
              <span className="text-right">P/L</span>
              <span className="text-right">Weight</span>
            </div>
            <div className="max-h-[520px]">
              <Virtuoso<CryptoTableRow>
                data={tableRows}
                overscan={200}
                itemContent={(_index, row) => {
                if (row.type === "group") {
                  return (
                    <div className="grid grid-cols-[1.5fr_0.7fr_0.8fr_0.8fr_0.8fr] items-center gap-4 py-3 font-semibold text-sm text-foreground">
                      <span>{row.label}</span>
                      <span className="text-right text-xs text-muted-foreground">{row.count} assets</span>
                      <span className="text-right font-mono text-sm tabular-nums">
                        ${row.totalValue.toLocaleString()}
                      </span>
                      <span />
                      <span />
                    </div>
                  )
                }

                const asset = row.asset
                const profitLoss = (asset.price - asset.costBasis) * asset.amount
                const profitLossPositive = profitLoss >= 0

                return (
                  <button
                    type="button"
                    onClick={() => router.push(`/crypto/${asset.coin.toLowerCase()}`)}
                    className="grid w-full grid-cols-[1.5fr_0.7fr_0.8fr_0.8fr_0.8fr] items-center gap-4 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary odd:bg-muted/15"
                    aria-label={`View ${asset.name} details`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <span className="text-sm font-semibold">{asset.coin}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{asset.name}</p>
                          {asset.staking?.enabled && (
                            <Badge variant="secondary" className="bg-purple-500/10 text-purple-600">
                              Staking
                            </Badge>
                          )}
                          {asset.isStablecoin && (
                            <Badge variant="outline" className="text-xs">
                              Stablecoin
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{asset.exchange}</p>
                      </div>
                    </div>
                    <span className="text-right text-sm font-mono tabular-nums text-muted-foreground">
                      {asset.amount.toLocaleString()}
                    </span>
                    <span className="text-right text-sm font-semibold font-mono tabular-nums">
                      ${asset.value.toLocaleString()}
                    </span>
                    <span className="text-right text-sm font-mono tabular-nums font-medium">
                      <span className={profitLossPositive ? "text-emerald-500" : "text-red-500"}>
                        {profitLossPositive ? "+" : "-"}${Math.abs(profitLoss).toLocaleString()}
                      </span>
                    </span>
                    <span className="text-right text-sm font-mono tabular-nums text-muted-foreground">
                      {row.percent.toFixed(1)}%
                    </span>
                  </button>
                )
              }}
            />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-muted/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Value</p>
                <p className="text-2xl font-semibold">${totalValue.toLocaleString()}</p>
              </div>
              <Badge variant="secondary">+7.2% 7d</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Your allocation is diversified across {filteredCryptos.length} assets with {(
                filteredCryptos.filter((asset) => asset.staking?.enabled).length
              )} staking positions generating passive rewards.
            </p>
          </div>

          <div className="rounded-lg border bg-muted/20 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Rewards earned</p>
              <Badge variant="secondary">${filteredCryptos
                .filter((asset) => asset.staking?.rewards)
                .reduce((sum, asset) => sum + (asset.staking?.rewards ?? 0), 0)
                .toLocaleString()}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Track staking yield and reinvest rewards automatically to compound growth.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
