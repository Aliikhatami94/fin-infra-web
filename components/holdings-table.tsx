"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { MaskableValue } from "@/components/privacy-provider"

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

type SortKey = "ticker" | "qty" | "value" | "pl" | "plPercent" | "weight" | "account"

export function HoldingsTable() {
  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("value")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = holdings.filter((h) =>
      !q
        ? true
        : h.ticker.toLowerCase().includes(q) || h.name.toLowerCase().includes(q) || h.account.toLowerCase().includes(q),
    )
    const mult = sortDir === "asc" ? 1 : -1
    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "ticker":
          return mult * a.ticker.localeCompare(b.ticker)
        case "account":
          return mult * a.account.localeCompare(b.account)
        case "qty":
          return mult * (a.qty - b.qty)
        case "value":
          return mult * (a.value - b.value)
        case "pl":
          return mult * (a.pl - b.pl)
        case "plPercent":
          return mult * (a.plPercent - b.plPercent)
        case "weight":
          return mult * (a.weight - b.weight)
      }
    })
  }, [query, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Holdings</CardTitle>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by ticker, name, or account"
            className="max-w-xs"
            aria-label="Filter holdings"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col style={{ width: "22%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "21%" }} />
            </colgroup>
            <thead className="sticky top-0 bg-card z-10">
              <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                <SortableTh
                  label="Ticker"
                  active={sortKey === "ticker"}
                  dir={sortDir}
                  onClick={() => toggleSort("ticker")}
                />
                <SortableTh
                  label="Quantity"
                  className="text-right"
                  active={sortKey === "qty"}
                  dir={sortDir}
                  onClick={() => toggleSort("qty")}
                />
                <SortableTh
                  label="Value"
                  className="text-right"
                  active={sortKey === "value"}
                  dir={sortDir}
                  onClick={() => toggleSort("value")}
                />
                <SortableTh
                  label="P/L"
                  className="text-right"
                  active={sortKey === "pl"}
                  dir={sortDir}
                  onClick={() => toggleSort("pl")}
                />
                <SortableTh
                  label="Weight"
                  className="text-right"
                  active={sortKey === "weight"}
                  dir={sortDir}
                  onClick={() => toggleSort("weight")}
                />
                <SortableTh
                  label="Account"
                  active={sortKey === "account"}
                  dir={sortDir}
                  onClick={() => toggleSort("account")}
                />
              </tr>
            </thead>
            <tbody>
              {rows.map((holding) => (
                <tr key={holding.ticker} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-3 align-middle">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{holding.ticker}</p>
                      <p className="text-xs text-muted-foreground">{holding.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-right align-middle">
                    <p className="text-sm tabular-nums font-mono whitespace-nowrap text-foreground">{holding.qty}</p>
                  </td>
                  <td className="py-4 px-3 text-right align-middle">
                    <p className="text-sm font-semibold tabular-nums text-foreground font-mono whitespace-nowrap">
                      <MaskableValue value={`$${holding.value.toLocaleString()}`} srLabel={`${holding.ticker} value`} />
                    </p>
                  </td>
                  <td className="py-4 px-3 text-right align-middle">
                    <div className="flex flex-col items-end gap-0.5">
                      <p
                        className={`text-sm font-semibold tabular-nums font-mono ${holding.pl > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        <MaskableValue
                          value={`${holding.pl > 0 ? "+" : ""}$${holding.pl.toLocaleString()}`}
                          srLabel={`${holding.ticker} profit and loss`}
                        />
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
                          } whitespace-nowrap`}
                        >
                          {holding.plPercent > 0 ? "+" : ""}
                          {holding.plPercent}%
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-right align-middle">
                    <p className="text-sm tabular-nums whitespace-nowrap text-foreground">{holding.weight}%</p>
                  </td>
                  <td className="py-4 px-3 align-middle">
                    <Badge variant="outline" className="whitespace-nowrap">
                      {holding.account}
                    </Badge>
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
  const right = className?.includes("text-right")
  return (
    <th className={cn("py-3 px-3 text-left select-none", className)}>
      <button
        type="button"
        className={cn(
          "inline-flex w-full items-center gap-1 hover:text-foreground text-xs uppercase tracking-wide",
          active ? "text-foreground" : "text-muted-foreground",
          right ? "justify-end text-right" : "justify-start",
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
