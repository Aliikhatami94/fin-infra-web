"use client"

import { forwardRef, useMemo, useState, useEffect, useRef } from "react"
import type { HTMLAttributes } from "react"
import { usePathname } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MoreVertical, Eye, EyeOff, TrendingUpIcon, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from "recharts"
import { TableVirtuoso, type TableComponents } from "react-virtuoso"
import { getPortfolioHoldings, getMockHoldings } from "@/lib/services/portfolio"
import type { Holding } from "@/types/domain"

// Mock holdings as fallback
const mockHoldings = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    qty: 150,
    value: 28500,
    pl: 4250,
    plPercent: 17.5,
    weight: 15.2,
    account: "Fidelity",
    assetClass: "equity",
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
    assetClass: "equity",
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
    assetClass: "equity",
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
    assetClass: "equity",
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
    assetClass: "equity",
    logo: "📦",
    sparkline: [170, 175, 178, 180, 182, 185, 180],
  },
]

type SortKey = "ticker" | "qty" | "value" | "pl" | "plPercent" | "weight" | "account"
type GroupBy = "none" | "account" | "asset-class"

// Normalize asset class values from API to user-friendly labels
function normalizeAssetClass(type?: string): string {
  if (!type) return "Other"
  
  const normalized = type.toLowerCase()
  
  if (normalized.includes('cash') || normalized.includes('dollar')) {
    return "Cash"
  } else if (normalized.includes('crypto') || normalized.includes('cryptocurrency')) {
    return "Crypto"
  } else if (
    normalized === 'equity' || 
    normalized === 'stock' || 
    normalized === 'mutual_fund' || 
    normalized.includes('mutual fund') || 
    normalized.includes('etf')
  ) {
    return "Stocks"
  } else if (normalized.includes('bond') || normalized.includes('fixed')) {
    return "Bonds"
  } else {
    return "Other"
  }
}

function AnimatedNumber({ value, decimals = 0, prefix = "", suffix = "" }: { value: number, decimals?: number, prefix?: string, suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(value)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (Math.abs(value - displayValue) < 0.01) return

    const startValue = displayValue
    const endValue = value
    const duration = 1000
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      const easedProgress = easeInOutCubic(progress)
      
      const current = startValue + (endValue - startValue) * easedProgress
      setDisplayValue(current)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayValue(endValue)
        animationRef.current = null
      }
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value])

  const formatted = decimals === 0 
    ? Math.round(displayValue).toLocaleString()
    : displayValue.toFixed(decimals)

  return <>{prefix}{formatted}{suffix}</>
}

// Transform Holding type to component's expected format
function transformHolding(h: Holding, totalValue: number) {
  const value = h.shares * h.currentPrice
  const cost = h.shares * h.avgPrice
  const pl = h.change // Already calculated by backend as unrealized_gain_loss
  const plPercent = cost > 0 ? (pl / cost) * 100 : 0
  const weight = totalValue > 0 ? Math.round((value / totalValue) * 10000) / 100 : 0 // Round to 2 decimals
  
  // Get a simple logo based on symbol
  const firstChar = h.symbol.charAt(0).toUpperCase()
  const logo = firstChar >= 'A' && firstChar <= 'Z' ? firstChar : '📈'
  
  return {
    ticker: h.symbol,
    name: h.name,
    qty: h.shares,
    value: value,
    pl: pl,
    plPercent: plPercent,
    weight: weight,
    account: h.accountId || "Investment Account",
    assetClass: normalizeAssetClass(h.assetClass),
    logo: logo,
    sparkline: [value * 0.95, value * 0.97, value * 0.98, value * 0.99, value * 1.0, value * 1.01, value],
  }
}

export interface HoldingsTableProps extends HTMLAttributes<HTMLDivElement> {
  allocationFilter?: string | null
  demoMode?: boolean
  mockDataOverride?: any[]
  hideControls?: boolean
}

export function HoldingsTable({ allocationFilter, demoMode = false, mockDataOverride, hideControls = false, className, ...props }: HoldingsTableProps) {
  const pathname = usePathname()
  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("value")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [selectedHolding, setSelectedHolding] = useState<any | null>(null)
  const [groupBy, setGroupBy] = useState<GroupBy>("none")
  const [holdings, setHoldings] = useState<typeof mockHoldings>(mockDataOverride || [])
  const [isLoading, setIsLoading] = useState(true)
  const isInitialMount = useRef(true)

  // Update holdings when mockDataOverride changes (without remounting)
  useEffect(() => {
    if (mockDataOverride && !isInitialMount.current) {
      const needsTransform = mockDataOverride.length > 0 && 'symbol' in mockDataOverride[0] && !('ticker' in mockDataOverride[0])
      
      if (needsTransform) {
        const totalValue = mockDataOverride.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0)
        const transformed = mockDataOverride.map(h => transformHolding(h, totalValue))
        setHoldings(transformed)
      } else {
        setHoldings(mockDataOverride)
      }
    }
  }, [mockDataOverride])

  // Fetch real holdings data on mount (only once)
  useEffect(() => {
    let mounted = true
    
    async function loadHoldings() {
      if (mockDataOverride) {
        // Check if it needs transformation (e.g. has 'symbol' but not 'ticker')
        const needsTransform = mockDataOverride.length > 0 && 'symbol' in mockDataOverride[0] && !('ticker' in mockDataOverride[0])
        
        if (needsTransform) {
             const totalValue = mockDataOverride.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0)
             const transformed = mockDataOverride.map(h => transformHolding(h, totalValue))
             setHoldings(transformed)
        } else {
             setHoldings(mockDataOverride)
        }
        setIsLoading(false)
        isInitialMount.current = false
        return
      }

      try {
        const data = demoMode ? getMockHoldings() : await getPortfolioHoldings()
        if (!mounted) return
        
        // Calculate total value for weight calculation
        const totalValue = data.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0)
        
        console.log('[FRONTEND_HOLDINGS] ========================================')
        console.log('[FRONTEND_HOLDINGS] Holdings count:', data.length)
        console.log('[FRONTEND_HOLDINGS] Total portfolio value: $' + totalValue.toFixed(2))
        console.log('[FRONTEND_HOLDINGS] Sample holdings:')
        data.slice(0, 5).forEach(h => {
          const value = h.shares * h.currentPrice
          console.log(`[FRONTEND_HOLDINGS]   ${h.symbol}: ${h.shares} shares @ $${h.currentPrice} = $${value.toFixed(2)} | P/L: $${h.change.toFixed(2)} | Class: ${h.assetClass}`)
        })
        console.log('[FRONTEND_HOLDINGS] ========================================')
        
        // Transform holdings to component format
        const transformed = data.map(h => transformHolding(h, totalValue))
        
        setHoldings(transformed)
      } catch (error) {
        console.error("Failed to load holdings:", error)
        // On error, use mock data as fallback
        const totalValue = mockHoldings.reduce((sum, h) => sum + h.value, 0)
        setHoldings(mockHoldings)
      } finally {
        if (mounted) {
          setIsLoading(false)
          isInitialMount.current = false
        }
      }
    }
    
    loadHoldings()
    
    return () => {
      mounted = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Clear search when navigating away
  useEffect(() => {
    setQuery("")
  }, [pathname])

  // Clear search when navigating away
  useEffect(() => {
    setQuery("")
  }, [pathname])

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
  }, [holdings, query, sortKey, sortDir, allocationFilter, groupBy])

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
    console.log('[HoldingsTable] Computing groupedRows:', { groupBy, rowsCount: rows.length, holdingsCount: holdings.length })
    if (groupBy === "none") return [{ group: null, items: rows }]

    const groups = new Map<string, typeof rows>()
    rows.forEach((row) => {
      const key = groupBy === "account" ? row.account : (row.assetClass || "Other")
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(row)
    })

    return Array.from(groups.entries()).map(([group, items]) => ({ group, items }))
  }, [rows, groupBy, holdings.length])

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
        ...items.map((holding, idx) => ({
          type: "holding" as const,
          id: `${group || "none"}-${holding.ticker}-${idx}`,
          holding,
        })),
      )
      return entries
    })
  }, [groupedRows])

  const tableHeight = useMemo(() => {
    const estimatedRowHeight = 60
    const estimatedHeader = 48
    const totalHeight = estimatedHeader + virtualRows.length * estimatedRowHeight
    
    if (hideControls) {
      return totalHeight
    }

    const maxHeight = 520
    const minHeight = 260
    return Math.max(minHeight, Math.min(maxHeight, totalHeight))
  }, [virtualRows.length, hideControls])

  const tableComponents = useMemo<TableComponents<VirtualRow>>(() => {
    const VirtTable = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
      ({ className, children, ...props }, ref) => (
        <table {...props} ref={ref} className={cn("w-full text-sm", className)}>
          {children}
        </table>
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
        style={{ borderColor: "var(--table-divider)" }}
        onClick={(event) => {
          if (item.type === "holding") {
            setSelectedHolding(item.holding)
          }
          onClick?.(event)
        }}
        className={cn(
          "border-b last:border-0",
          item.type === "group"
            ? "bg-muted/40"
            : "hover:bg-muted/50 transition-colors cursor-pointer odd:bg-muted/25",
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

  const Wrapper = hideControls ? "div" : Card
  const InnerWrapper = hideControls ? "div" : CardContent

  return (
    <>
      <Wrapper className={cn(hideControls ? "overflow-hidden rounded-xl" : "card-standard", className)}>
        {!hideControls && (
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <CardTitle>Holdings</CardTitle>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <Select value={groupBy} onValueChange={(value) => setGroupBy(value as GroupBy)}>
                  <SelectTrigger className="w-full sm:w-[180px] h-9 text-sm">
                    <SelectValue placeholder="No grouping" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No grouping</SelectItem>
                    <SelectItem value="account">Group by Account</SelectItem>
                    <SelectItem value="asset-class">Group by Asset Class</SelectItem>
                  </SelectContent>
                </Select>
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
        )}
        <InnerWrapper className={cn(hideControls ? "h-full p-0" : "")}>
          {isLoading ? (
            <div className={cn("space-y-4", hideControls && "p-6")}>
              <div className="h-12 bg-muted animate-pulse rounded" />
              <div className="h-12 bg-muted animate-pulse rounded" />
              <div className="h-12 bg-muted animate-pulse rounded" />
              <div className="h-12 bg-muted animate-pulse rounded" />
              <div className="h-12 bg-muted animate-pulse rounded" />
            </div>
          ) : (
            <>
              <div className={cn("hidden md:block", hideControls && "h-full")}>
                <div className={cn("table-surface", hideControls && "h-full")}>
                  <TableVirtuoso
                    data={virtualRows}
                    style={{ height: tableHeight }}
                    components={tableComponents}
                    className="min-w-full"
                    fixedHeaderContent={() => (
                      <tr
                        className="border-b text-xs uppercase tracking-wide text-muted-foreground"
                        style={{ borderColor: "var(--table-divider)" }}
                      >
                        <th className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-left w-[35%]">
                          <button
                            onClick={() => toggleSort("ticker")}
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            Ticker
                          </button>
                        </th>
                        <th className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-right w-[12%]">
                          <button
                            onClick={() => toggleSort("qty")}
                            className="ml-auto flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            Quantity
                          </button>
                        </th>
                        <th className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-right w-[16%]">
                          <button
                            onClick={() => toggleSort("value")}
                            className="ml-auto flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            Value
                          </button>
                        </th>
                        <th className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-right w-[16%]">
                          <button
                            onClick={() => toggleSort("pl")}
                            className="ml-auto flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            P/L
                          </button>
                        </th>
                        <th className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-right w-[12%]">
                          <button
                            onClick={() => toggleSort("weight")}
                            className="ml-auto flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            Weight
                          </button>
                        </th>
                        <th className="px-[calc(var(--table-cell-padding-x)/2)] py-[var(--table-cell-padding-y)] text-right w-[5%]" aria-hidden />
                      </tr>
                    )}
                    itemContent={(index, item) => {
                if (item.type === "group") {
                  return [
                    <td
                      key={`${item.id}-group`}
                      colSpan={6}
                      className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] font-semibold text-sm text-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {item.label}
                      </div>
                    </td>,
                  ]
                }

                const holding = item.holding
                return [
                  <td
                    key={`${item.id}-ticker`}
                    className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] align-middle"
                  >
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center flex-shrink-0 shadow-sm ring-1 ring-border/50">
                        <span className="text-base md:text-lg font-semibold text-foreground">{holding.logo}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{holding.ticker}</p>
                        <p className="text-xs text-muted-foreground truncate font-medium" title={holding.name}>{holding.name}</p>
                      </div>
                    </div>
                  </td>,
                  <td
                    key={`${item.id}-qty`}
                    className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-right align-middle"
                  >
                    <p className="text-sm tabular-nums font-mono whitespace-nowrap text-foreground font-medium">
                      <AnimatedNumber value={holding.qty} decimals={Number.isInteger(holding.qty) ? 0 : 2} />
                    </p>
                  </td>,
                  <td
                    key={`${item.id}-value`}
                    className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-right align-middle"
                  >
                    <p className="text-sm font-semibold tabular-nums text-foreground font-mono whitespace-nowrap">
                      <MaskableValue value={`$`} srLabel={`${holding.ticker} value`} />
                      <AnimatedNumber value={holding.value} decimals={2} />
                    </p>
                  </td>,
                  <td
                    key={`${item.id}-pl`}
                    className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-right align-middle"
                  >
                    <p
                      className={`text-sm font-semibold tabular-nums font-mono ${holding.pl > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      <MaskableValue
                        value={`${holding.pl > 0 ? "+" : ""}$`}
                        srLabel={`${holding.ticker} profit and loss`}
                      />
                      <AnimatedNumber value={holding.pl} decimals={2} />
                    </p>
                  </td>,
                  <td
                    key={`${item.id}-weight`}
                    className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-right align-middle"
                  >
                    <p className="text-sm font-mono tabular-nums whitespace-nowrap text-foreground font-medium">
                      <AnimatedNumber value={holding.weight} decimals={2} suffix="%" />
                    </p>
                  </td>,
                  <td
                    key={`${item.id}-actions`}
                    className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-right align-middle"
                  >
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
              </div>

              <div className="md:hidden space-y-3">
                {groupedRows.map(({ group, items }) => (
                  <div key={group || "no-group"}>
                    {group && (
                      <button
                        className="flex items-center gap-2 w-full py-2 px-3 mb-2 rounded-md hover:bg-muted/40 transition-smooth text-left"
                      >
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-semibold">{group}</span>
                        <Badge variant="outline" className="ml-auto">
                          {items.length}
                        </Badge>
                      </button>
                    )}
                    <div className="space-y-3">
                      {items.map((holding, idx) => (
                        <div
                          key={`${holding.ticker}-${holding.value}-${idx}`}
                          onClick={() => setSelectedHolding(holding)}
                          className="card-standard card-lift cursor-pointer p-4 space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center flex-shrink-0 shadow-sm ring-1 ring-border/50">
                                <span className="text-lg font-semibold text-foreground">{holding.logo}</span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-foreground truncate">{holding.ticker}</p>
                                <p className="text-xs text-muted-foreground truncate font-medium">{holding.name}</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Value</p>
                              <p className="text-sm font-semibold tabular-nums font-mono">
                                <MaskableValue
                                  value={`$${holding.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                  srLabel={`${holding.ticker} value`}
                                />
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">P/L</p>
                              <p
                                className={`text-sm font-semibold tabular-nums font-mono ${holding.pl > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                              >
                                <MaskableValue
                                  value={`${holding.pl > 0 ? "+" : ""}$${holding.pl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                  srLabel={`${holding.ticker} profit and loss`}
                                />
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Weight</p>
                              <p className="text-sm font-medium tabular-nums">{holding.weight.toFixed(2)}%</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </InnerWrapper>
      </Wrapper>

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
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--foreground))" 
                        fontSize={12}
                        tick={{ fill: "hsl(var(--foreground))" }}
                        tickLine={true}
                        axisLine={true}
                        tickMargin={8}
                      />
                      <YAxis
                        stroke="hsl(var(--foreground))"
                        fontSize={12}
                        tick={{ fill: "hsl(var(--foreground))" }}
                        tickLine={true}
                        axisLine={true}
                        tickMargin={8}
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
