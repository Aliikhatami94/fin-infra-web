"use client"

import { forwardRef, useMemo, useState } from "react"
import type { HTMLAttributes } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Building2, MoreVertical, Eye, EyeOff, TrendingUpIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { MaskableValue } from "@/components/privacy-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis } from "recharts"
import { TableVirtuoso, type TableComponents } from "react-virtuoso"

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
    logo: "🍎",
    sparkline: [180, 182, 185, 183, 187, 190, 188],
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
    logo: "🪟",
    sparkline: [380, 385, 390, 388, 395, 400, 420],
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
    logo: "🔍",
    sparkline: [145, 143, 140, 138, 135, 137, 140],
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
    logo: "⚡",
    sparkline: [240, 245, 250, 248, 255, 260, 255],
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
    logo: "📦",
    sparkline: [170, 175, 178, 180, 182, 185, 180],
  },
]

type SortKey = "ticker" | "qty" | "value" | "pl" | "plPercent" | "weight" | "account"
type GroupBy = "none" | "account" | "asset-class"

export interface HoldingsTableProps {
  allocationFilter?: string | null
}

export function HoldingsTable({ allocationFilter }: HoldingsTableProps) {
  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("value")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [selectedHolding, setSelectedHolding] = useState<(typeof holdings)[0] | null>(null)
  const [groupBy, setGroupBy] = useState<GroupBy>("none")

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    let filtered = holdings.filter((h) =>
      !q
        ? true
        : h.ticker.toLowerCase().includes(q) || h.name.toLowerCase().includes(q) || h.account.toLowerCase().includes(q),
    )

    if (allocationFilter) {
      filtered = filtered.filter((_h) => {
        return true
      })
    }

    const mult = sortDir === "asc" ? 1 : -1
    const sorted = [...filtered].sort((a, b) => {
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

    if (groupBy === "account") {
      return sorted.sort((a, b) => mult * a.account.localeCompare(b.account))
    }

    return sorted
  }, [query, sortKey, sortDir, allocationFilter, groupBy])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  const priceHistory = useMemo(() => {
    if (!selectedHolding) return []
    const data = []
    let price = selectedHolding.value / selectedHolding.qty
    for (let i = 0; i < 30; i++) {
      price += (Math.random() - 0.5) * 10
      data.push({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        price: price,
      })
    }
    return data
  }, [selectedHolding])

  const groupedRows = useMemo(() => {
    if (groupBy === "none") return [{ group: null, items: rows }]

    const groups = new Map<string, typeof rows>()
    rows.forEach((row) => {
      const key = groupBy === "account" ? row.account : "Asset Class"
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(row)
    })

    return Array.from(groups.entries()).map(([group, items]) => ({ group, items }))
  }, [rows, groupBy])

  type VirtualRow =
    | { type: "group"; id: string; label: string }
    | { type: "holding"; id: string; holding: (typeof holdings)[0] }

  const virtualRows = useMemo<VirtualRow[]>(() => {
    return groupedRows.flatMap(({ group, items }) => {
      const entries: VirtualRow[] = []
      if (group) {
        entries.push({ type: "group", id: `group-${group}`, label: group })
      }
      entries.push(
        ...items.map((holding) => ({
          type: "holding" as const,
          id: `${group || "none"}-${holding.ticker}`,
          holding,
        })),
      )
      return entries
    })
  }, [groupedRows])

  const tableHeight = useMemo(() => {
    const estimatedRowHeight = 68
    const estimatedHeader = 48
    const totalHeight = estimatedHeader + virtualRows.length * estimatedRowHeight
    const maxHeight = 520
    const minHeight = 260
    return Math.max(minHeight, Math.min(maxHeight, totalHeight))
  }, [virtualRows.length])

  const tableComponents = useMemo<TableComponents<VirtualRow>>(() => {
    const VirtTable = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
      ({ className, ...props }, ref) => (
        <table {...props} ref={ref} className={cn("w-full text-sm table-fixed", className)} />
      ),
    )
    VirtTable.displayName = "HoldingsVirtuosoTable"

    const VirtHead = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
      ({ className, ...props }, ref) => (
        <thead {...props} ref={ref} className={cn("sticky top-0 bg-card z-10", className)} />
      ),
    )
    VirtHead.displayName = "HoldingsVirtuosoTableHead"

    const VirtRow = forwardRef<
      HTMLTableRowElement,
      HTMLAttributes<HTMLTableRowElement> & { item: VirtualRow }
    >(({ className, item, onClick, ...props }, ref) => (
      <tr
        {...props}
        ref={ref}
        onClick={(event) => {
          if (item.type === "holding") {
            setSelectedHolding(item.holding)
          }
          onClick?.(event)
        }}
        className={cn(
          "border-b last:border-0",
          item.type === "group"
            ? "bg-muted/30"
            : "hover:bg-muted/50 transition-colors cursor-pointer",
          className,
        )}
      />
    ))
    VirtRow.displayName = "HoldingsVirtuosoTableRow"

    const VirtBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
      ({ className, ...props }, ref) => <tbody {...props} ref={ref} className={className} />,
    )
    VirtBody.displayName = "HoldingsVirtuosoTableBody"

    return {
      Table: VirtTable,
      TableHead: VirtHead,
      TableRow: VirtRow,
      TableBody: VirtBody,
    }
  }, [setSelectedHolding])

  return (
    <>
      <Card className="card-standard">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle>Holdings</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <select value={groupBy} onChange={(e) => setGroupBy(e.target.value as GroupBy)}>
                <option value="none">No grouping</option>
                <option value="account">Group by Account</option>
                <option value="asset-class">Group by Asset Class</option>
              </select>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter holdings..."
                className="w-full sm:max-w-xs"
                aria-label="Filter holdings"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block">
            <TableVirtuoso
              data={virtualRows}
              style={{ height: tableHeight }}
              components={tableComponents}
              fixedHeaderContent={() => (
                <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-3 px-3" onClick={() => toggleSort("ticker")}>
                    Ticker
                  </th>
                  <th className="py-3 px-3 text-right" onClick={() => toggleSort("qty")}>
                    Quantity
                  </th>
                  <th className="py-3 px-3 text-right" onClick={() => toggleSort("value")}>
                    Value
                  </th>
                  <th className="py-3 px-3 text-right" onClick={() => toggleSort("pl")}>
                    P/L
                  </th>
                  <th className="py-3 px-3 text-right" onClick={() => toggleSort("weight")}>
                    Weight
                  </th>
                  <th className="py-3 px-3" onClick={() => toggleSort("account")}>
                    Account
                  </th>
                  <th className="py-3 px-3 text-right">
                    <span className="text-xs uppercase tracking-wide">Actions</span>
                  </th>
                </tr>
              )}
              itemContent={(index, item) => {
                if (item.type === "group") {
                  return [
                    <td key={`${item.id}-group`} colSpan={7} className="py-3 px-3 font-semibold text-sm text-foreground">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {item.label}
                      </div>
                    </td>,
                  ]
                }

                const holding = item.holding
                return [
                  <td key={`${item.id}-ticker`} className="py-4 px-3 align-middle">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-lg">
                        {holding.logo}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{holding.ticker}</p>
                        <p className="text-xs text-muted-foreground">{holding.name}</p>
                      </div>
                    </div>
                  </td>,
                  <td key={`${item.id}-qty`} className="py-4 px-3 text-right align-middle">
                    <p className="text-sm tabular-nums font-mono whitespace-nowrap text-foreground">{holding.qty}</p>
                  </td>,
                  <td key={`${item.id}-value`} className="py-4 px-3 text-right align-middle">
                    <p className="text-sm font-semibold tabular-nums text-foreground font-mono whitespace-nowrap">
                      <MaskableValue value={`$${holding.value.toLocaleString()}`} srLabel={`${holding.ticker} value`} />
                    </p>
                  </td>,
                  <td key={`${item.id}-pl`} className="py-4 px-3 text-right align-middle">
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
                        <div className="ml-2 w-12 h-6">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={holding.sparkline.map((val) => ({ value: val }))}>
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke={holding.plPercent > 0 ? "hsl(142, 76%, 45%)" : "hsl(0, 84%, 60%)"}
                                strokeWidth={1.5}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </td>,
                  <td key={`${item.id}-weight`} className="py-4 px-3 text-right align-middle">
                    <p className="text-sm tabular-nums whitespace-nowrap text-foreground">{holding.weight}%</p>
                  </td>,
                  <td key={`${item.id}-account`} className="py-4 px-3 align-middle">
                    <Badge variant="outline" className="whitespace-nowrap">
                      {holding.account}
                    </Badge>
                  </td>,
                  <td key={`${item.id}-actions`} className="py-4 px-3 text-right align-middle">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedHolding(holding)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <TrendingUpIcon className="mr-2 h-4 w-4" />
                          Sell Position
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-muted-foreground">
                          <EyeOff className="mr-2 h-4 w-4" />
                          Exclude from Analytics
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>,
                ]
              }}
            />
          </div>

          <div className="md:hidden space-y-3">
            {groupedRows.map(({ group, items }) => (
              <div key={group || "no-group"} className="space-y-3">
                {group && (
                  <div className="flex items-center gap-2 px-2 py-1 bg-muted/30 rounded-md">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">{group}</span>
                  </div>
                )}
                {items.map((holding) => (
                  <div
                    key={holding.ticker}
                    onClick={() => setSelectedHolding(holding)}
                    className="card-standard card-lift cursor-pointer p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg flex-shrink-0">
                          {holding.logo}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate">{holding.ticker}</p>
                          <p className="text-xs text-muted-foreground truncate">{holding.name}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="whitespace-nowrap ml-2">
                        {holding.account}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Value</p>
                        <p className="text-base font-semibold tabular-nums font-mono">
                          <MaskableValue
                            value={`$${holding.value.toLocaleString()}`}
                            srLabel={`${holding.ticker} value`}
                          />
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">P/L</p>
                        <p
                          className={`text-base font-semibold tabular-nums font-mono ${holding.pl > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                        >
                          <MaskableValue
                            value={`${holding.pl > 0 ? "+" : ""}$${holding.pl.toLocaleString()}`}
                            srLabel={`${holding.ticker} profit and loss`}
                          />
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <div className="flex items-center gap-1">
                        {holding.plPercent > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                        )}
                        <span
                          className={`text-sm tabular-nums ${holding.plPercent > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                        >
                          {holding.plPercent > 0 ? "+" : ""}
                          {holding.plPercent}%
                        </span>
                        <div className="ml-2 w-12 h-6">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={holding.sparkline.map((val) => ({ value: val }))}>
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke={holding.plPercent > 0 ? "hsl(142, 76%, 45%)" : "hsl(0, 84%, 60%)"}
                                strokeWidth={1.5}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Weight</p>
                        <p className="text-sm font-medium tabular-nums">{holding.weight}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedHolding} onOpenChange={(open) => !open && setSelectedHolding(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedHolding?.ticker} - {selectedHolding?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedHolding && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="text-lg font-semibold">{selectedHolding.qty}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Current Value</p>
                  <p className="text-lg font-semibold">${selectedHolding.value.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">P/L</p>
                  <p className={`text-lg font-semibold ${selectedHolding.pl > 0 ? "text-green-600" : "text-red-600"}`}>
                    {selectedHolding.pl > 0 ? "+" : ""}${selectedHolding.pl.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Account</p>
                  <p className="text-lg font-semibold">{selectedHolding.account}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">30-Day Price History</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceHistory}>
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(210, 100%, 60%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(210, 100%, 60%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickFormatter={(value) => `$${value.toFixed(0)}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(210, 100%, 60%)"
                        strokeWidth={2}
                        fill="url(#priceGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Recent Transactions</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Buy</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">10 shares</p>
                      <p className="text-xs text-muted-foreground">@ $185.00</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Buy</p>
                      <p className="text-xs text-muted-foreground">1 week ago</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">5 shares</p>
                      <p className="text-xs text-muted-foreground">@ $178.50</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

// (no module-scope helpers)
