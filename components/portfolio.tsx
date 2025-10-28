"use client"

import { useMemo, useState } from "react"
import { MaskableValue } from "@/components/privacy-provider"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { getPortfolioHoldings } from "@/lib/services/portfolio"
import type { Holding } from "@/types/domain"
import { formatCurrency, formatNumber } from "@/lib/format"

// holdings are provided via centralized mocks

type SortKey = "symbol" | "shares" | "price" | "value" | "day" | "pl" | "alloc"

interface PortfolioProps {
  filter?: string | null
}

export function Portfolio({ filter }: PortfolioProps) {
  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("value")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const holdings = useMemo(() => getPortfolioHoldings(), [])

  const computed = useMemo(() => {
    const enriched = holdings.map((h: Holding) => {
      const value = h.shares * h.currentPrice
      const cost = h.shares * h.avgPrice
      const gain = value - cost
      const gainPct = cost !== 0 ? (gain / cost) * 100 : 0
      return { ...h, value, cost, gain, gainPct }
    })
    const totalValue = enriched.reduce((s, h) => s + h.value, 0)
    const totalCost = enriched.reduce((s, h) => s + h.cost, 0)
    const totalGain = totalValue - totalCost
    const totalGainPercent = totalCost ? (totalGain / totalCost) * 100 : 0

    const filtered = enriched.filter((h) => {
      const q = query.trim().toLowerCase()
      const matchesQuery = !q || h.symbol.toLowerCase().includes(q) || h.name.toLowerCase().includes(q)

      // If there's an active filter, only show matching holdings
      // This is a placeholder - in a real app, holdings would have category metadata
      const matchesFilter = !filter || true // Placeholder: all holdings match for demo

      return matchesQuery && matchesFilter
    })

    const sorted = [...filtered].sort((a, b) => {
      const mult = sortDir === "asc" ? 1 : -1
      switch (sortKey) {
        case "symbol":
          return mult * a.symbol.localeCompare(b.symbol)
        case "shares":
          return mult * (a.shares - b.shares)
        case "price":
          return mult * (a.currentPrice - b.currentPrice)
        case "value":
          return mult * (a.value - b.value)
        case "day":
          return mult * (a.change - b.change)
        case "pl":
          return mult * (a.gain - b.gain)
        case "alloc":
          return mult * (a.value - b.value)
      }
    })

    return { totalValue, totalCost, totalGain, totalGainPercent, rows: sorted }
  }, [filter, holdings, query, sortDir, sortKey])

  const { totalValue, totalGain, totalGainPercent, rows } = computed

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  return (
    <Card className="card-standard">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">Portfolio</CardTitle>
            <p className="text-sm text-muted-foreground">Total Holdings</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-3xl font-bold tracking-tight font-mono">
              <MaskableValue value={formatCurrency(totalValue, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} srLabel="Total portfolio value" />
            </p>
            <p className={`text-sm font-semibold ${totalGainPercent >= 0 ? "text-success" : "text-destructive"}`}>
              {formatNumber(totalGainPercent, { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: "exceptZero" })}% (
              {formatCurrency(totalGain, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by symbol or name"
              className="max-w-xs"
              aria-label="Filter holdings"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card z-10">
                <tr className="border-b text-muted-foreground">
                  <SortableTh
                    label="Asset"
                    active={sortKey === "symbol"}
                    dir={sortDir}
                    onClick={() => toggleSort("symbol")}
                  />
                  <SortableTh
                    label="Shares"
                    className="text-right"
                    active={sortKey === "shares"}
                    dir={sortDir}
                    onClick={() => toggleSort("shares")}
                  />
                  <SortableTh
                    label="Price"
                    className="hidden md:table-cell text-right"
                    active={sortKey === "price"}
                    dir={sortDir}
                    onClick={() => toggleSort("price")}
                  />
                  <SortableTh
                    label="Value"
                    className="text-right"
                    active={sortKey === "value"}
                    dir={sortDir}
                    onClick={() => toggleSort("value")}
                  />
                  <SortableTh
                    label="Day"
                    className="text-right"
                    active={sortKey === "day"}
                    dir={sortDir}
                    onClick={() => toggleSort("day")}
                  />
                  <SortableTh
                    label="P/L"
                    className="hidden sm:table-cell text-right"
                    active={sortKey === "pl"}
                    dir={sortDir}
                    onClick={() => toggleSort("pl")}
                  />
                  <SortableTh
                    label="Alloc"
                    className="hidden lg:table-cell text-right"
                    active={sortKey === "alloc"}
                    dir={sortDir}
                    onClick={() => toggleSort("alloc")}
                  />
                </tr>
              </thead>
              <tbody>
                {rows.map((h) => {
                  const allocation = totalValue ? (h.value / totalValue) * 100 : 0
                  return (
                    <tr key={h.symbol} className="border-b last:border-0">
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-semibold text-xs">
                            {h.symbol.slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">{h.symbol}</p>
                            <p className="text-xs text-muted-foreground truncate">{h.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right tabular-nums">{h.shares}</td>
                      <td className="py-3 hidden md:table-cell text-right tabular-nums">
                        {formatCurrency(h.currentPrice, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 text-right font-mono">
                        <MaskableValue value={formatCurrency(h.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} srLabel={`${h.symbol} value`} />
                      </td>
                      <td className="py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          {h.change >= 0 ? (
                            <TrendingUp className="h-3.5 w-3.5 text-success" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                          )}
                          <span
                            className={cn(
                              "tabular-nums font-medium",
                              h.change >= 0 ? "text-success" : "text-destructive",
                            )}
                          >
                            {formatNumber(h.change, { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: "exceptZero" })}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 hidden sm:table-cell text-right font-mono">
                        <MaskableValue
                          value={`${formatCurrency(h.gain, { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: "exceptZero" })} (${formatNumber(h.gainPct, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%)`}
                          srLabel={`${h.symbol} profit and loss`}
                        />
                      </td>
                      <td className="py-3 hidden lg:table-cell text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="tabular-nums text-xs text-muted-foreground">{allocation.toFixed(1)}%</span>
                          <div className="w-24">
                            <Progress value={allocation} className="h-1.5" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SortableTh({
  label,
  active,
  dir,
  onClick,
  className,
}: {
  label: string
  active?: boolean
  dir?: "asc" | "desc"
  onClick?: () => void
  className?: string
}) {
  return (
    <th className={cn("py-2 px-1 text-left select-none", className)}>
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 hover:text-foreground text-xs uppercase tracking-wide",
          active ? "text-foreground" : "text-muted-foreground",
        )}
        onClick={onClick}
        aria-pressed={active}
      >
        {label}
        {active ? (
          dir === "asc" ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )
        ) : (
          <span className="inline-block w-3 h-3" aria-hidden />
        )}
      </button>
    </th>
  )
}

// (no module-scope helpers)
