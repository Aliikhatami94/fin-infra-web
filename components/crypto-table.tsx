"use client"

import { forwardRef, useMemo, useState } from "react"
import type { HTMLAttributes } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, ArrowUpDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TableVirtuoso, type TableComponents } from "react-virtuoso"
import { cn } from "@/lib/utils"

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
}

type CryptoAsset = (typeof cryptos)[number]

export function CryptoTable({ selectedExchange, showStablecoins }: CryptoTableProps) {
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
    let aVal, bVal

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
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const tableHeight = useMemo(() => {
    const estimatedHeader = 48
    const estimatedRow = 72
    const totalHeight = estimatedHeader + sortedCryptos.length * estimatedRow
    const maxHeight = 520
    const minHeight = 240
    return Math.max(minHeight, Math.min(maxHeight, totalHeight))
  }, [sortedCryptos.length])

  const tableComponents = useMemo<TableComponents<CryptoAsset>>(() => {
    const VirtTable = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
      ({ className, ...props }, ref) => (
        <table {...props} ref={ref} className={cn("w-full min-w-[800px]", className)} />
      ),
    )
    VirtTable.displayName = "CryptoVirtuosoTable"

    const VirtHead = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
      ({ className, ...props }, ref) => (
        <thead {...props} ref={ref} className={cn("sticky top-0 bg-card z-10", className)} />
      ),
    )
    VirtHead.displayName = "CryptoVirtuosoTableHead"

    const VirtRow = forwardRef<
      HTMLTableRowElement,
      HTMLAttributes<HTMLTableRowElement> & { item: CryptoAsset }
    >(({ className, item, onClick, ...props }, ref) => (
      <tr
        {...props}
        ref={ref}
        onClick={(event) => {
          router.push(`/crypto/${item.coin.toLowerCase()}`)
          onClick?.(event)
        }}
        className={cn(
          "border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer",
          className,
        )}
      />
    ))
    VirtRow.displayName = "CryptoVirtuosoTableRow"

    const VirtBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
      ({ className, ...props }, ref) => <tbody {...props} ref={ref} className={className} />,
    )
    VirtBody.displayName = "CryptoVirtuosoTableBody"

    return {
      Table: VirtTable,
      TableHead: VirtHead,
      TableRow: VirtRow,
      TableBody: VirtBody,
    }
  }, [router])

  return (
    <Card className="card-standard">
      <CardHeader>
        <CardTitle>Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="hidden md:block -mx-6 px-6">
          <TableVirtuoso
            data={sortedCryptos}
            style={{ height: tableHeight }}
            components={tableComponents}
            fixedHeaderContent={() => (
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => handleSort("coin")}
                  >
                    Coin
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="pb-3 font-medium text-right">Amount</th>
                <th className="pb-3 font-medium text-right">Cost Basis</th>
                <th className="pb-3 font-medium text-right">Price</th>
                <th className="pb-3 font-medium text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => handleSort("value")}
                  >
                    Value
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="pb-3 font-medium text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => handleSort("pl")}
                  >
                    P/L
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="pb-3 font-medium text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => handleSort("weight")}
                  >
                    Weight
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="pb-3 font-medium text-right">24h %</th>
                <th className="pb-3 font-medium text-right">Staking</th>
                <th className="pb-3 font-medium">Exchange</th>
              </tr>
            )}
            itemContent={(index, crypto) => {
              const plAmount = (crypto.price - crypto.costBasis) * crypto.amount
              const plPercent = ((crypto.price - crypto.costBasis) / crypto.costBasis) * 100
              const weight = (crypto.value / totalValue) * 100

              return [
                <td key={`${crypto.coin}-asset`} className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                      {crypto.coin.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{crypto.coin}</p>
                      <p className="text-xs text-muted-foreground">{crypto.name}</p>
                    </div>
                  </div>
                </td>,
                <td key={`${crypto.coin}-amount`} className="py-4 text-right">
                  <p className="text-sm tabular-nums text-foreground">{crypto.amount}</p>
                </td>,
                <td key={`${crypto.coin}-basis`} className="py-4 text-right">
                  <p className="text-sm tabular-nums text-muted-foreground">${crypto.costBasis.toLocaleString()}</p>
                </td>,
                <td key={`${crypto.coin}-price`} className="py-4 text-right">
                  <p className="text-sm tabular-nums text-foreground">${crypto.price.toLocaleString()}</p>
                </td>,
                <td key={`${crypto.coin}-value`} className="py-4 text-right">
                  <p className="text-sm font-semibold tabular-nums text-foreground">${crypto.value.toLocaleString()}</p>
                </td>,
                <td key={`${crypto.coin}-pl`} className="py-4 text-right">
                  <div>
                    <p
                      className={`text-sm font-semibold tabular-nums ${plAmount >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {plAmount >= 0 ? "+" : ""}$
                      {plAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p
                      className={`text-xs tabular-nums ${plAmount >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {plPercent >= 0 ? "+" : ""}
                      {plPercent.toFixed(1)}%
                    </p>
                  </div>
                </td>,
                <td key={`${crypto.coin}-weight`} className="py-4 text-right">
                  <p className="text-sm tabular-nums text-foreground">{weight.toFixed(1)}%</p>
                </td>,
                <td key={`${crypto.coin}-trend`} className="py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <ResponsiveContainer width={40} height={20}>
                      <AreaChart data={crypto.trend.map((val) => ({ value: val }))}>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={crypto.change24h >= 0 ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"}
                          fill={crypto.change24h >= 0 ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"}
                          fillOpacity={0.3}
                          strokeWidth={1.5}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-1">
                      {crypto.change24h > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                      ) : crypto.change24h < 0 ? (
                        <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                      ) : null}
                      <span
                        className={`text-sm font-medium tabular-nums ${
                          crypto.change24h > 0
                            ? "text-green-600 dark:text-green-400"
                            : crypto.change24h < 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-muted-foreground"
                        }`}
                      >
                        {crypto.change24h > 0 ? "+" : ""}
                        {crypto.change24h}%
                      </span>
                    </div>
                  </div>
                </td>,
                <td key={`${crypto.coin}-staking`} className="py-4 text-right">
                  {crypto.staking ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-end gap-1 cursor-help">
                            <Sparkles className="h-3 w-3 text-amber-500" />
                            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                              {crypto.staking.apy}%
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs space-y-1">
                            <p>Staking APY: {crypto.staking.apy}%</p>
                            <p>
                              Rewards earned: {crypto.staking.rewards} {crypto.coin}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>,
                <td key={`${crypto.coin}-exchange`} className="py-4">
                  <Badge variant="outline">{crypto.exchange}</Badge>
                </td>,
              ]
            }}
          />
        </div>

        <div className="md:hidden space-y-3">
          {sortedCryptos.map((crypto) => {
            const plAmount = (crypto.price - crypto.costBasis) * crypto.amount
            const plPercent = ((crypto.price - crypto.costBasis) / crypto.costBasis) * 100
            const weight = (crypto.value / totalValue) * 100

            return (
              <div
                key={crypto.coin}
                onClick={() => router.push(`/crypto/${crypto.coin.toLowerCase()}`)}
                className="card-standard card-lift cursor-pointer p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {crypto.coin.slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">{crypto.coin}</p>
                      <p className="text-xs text-muted-foreground truncate">{crypto.name}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="whitespace-nowrap ml-2">
                    {crypto.exchange}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Value</p>
                    <p className="text-base font-semibold tabular-nums font-mono">${crypto.value.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">P/L</p>
                    <p
                      className={`text-base font-semibold tabular-nums font-mono ${plAmount >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {plAmount >= 0 ? "+" : ""}$
                      {plAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <div className="flex items-center gap-2">
                    <ResponsiveContainer width={40} height={20}>
                      <AreaChart data={crypto.trend.map((val, i) => ({ value: val }))}>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={crypto.change24h >= 0 ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"}
                          fill={crypto.change24h >= 0 ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"}
                          fillOpacity={0.3}
                          strokeWidth={1.5}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-1">
                      {crypto.change24h > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                      ) : crypto.change24h < 0 ? (
                        <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                      ) : null}
                      <span
                        className={`text-sm font-medium tabular-nums ${crypto.change24h > 0 ? "text-green-600 dark:text-green-400" : crypto.change24h < 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
                      >
                        {crypto.change24h > 0 ? "+" : ""}
                        {crypto.change24h}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="text-sm font-medium tabular-nums">{weight.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <div className="flex items-center gap-2">
                    {crypto.staking ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-end gap-1 cursor-help">
                              <Sparkles className="h-3 w-3 text-amber-500" />
                              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                {crypto.staking.apy}%
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs space-y-1">
                              <p>Staking APY: {crypto.staking.apy}%</p>
                              <p>
                                Rewards earned: {crypto.staking.rewards} {crypto.coin}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
