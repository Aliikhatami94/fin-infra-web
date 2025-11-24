"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { differenceInCalendarDays, format, parseISO, startOfYear, subDays } from "date-fns"
import { Virtuoso } from "react-virtuoso"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { getTransactions } from "@/lib/services/transactions"
import type { Transaction } from "@/types/domain"
import { trackTransactionBulkAction, trackTransactionFilter } from "@/lib/analytics/events"
import { toast } from "@/components/ui/sonner"
import { Download, Tag, FolderGit2, Filter, Keyboard, CalendarDays } from "lucide-react"
import { AssignmentMenu } from "@/components/assignment-menu"
import { CollaborationDrawer } from "@/components/collaboration-drawer"
import { MaskableValue } from "@/components/privacy-provider"
import type { DateRange } from "react-day-picker"

interface TransactionQuickFilter {
  id: string
  label: string
  description: string
  predicate: (transaction: Transaction) => boolean
}

const quickFilters: TransactionQuickFilter[] = [
  {
    id: "recent",
    label: "Last 7 days",
    description: "Show activity posted in the last week",
    predicate: (transaction) => {
      const today = new Date()
      const days = differenceInCalendarDays(today, parseISO(transaction.date))
      return days <= 7
    },
  },
  {
    id: "large",
    label: "Large transactions",
    description: "Highlight debits or credits over $500",
    predicate: (transaction) => Math.abs(transaction.amount) >= 500,
  },
  {
    id: "investments",
    label: "Investments",
    description: "Show only investment activities (buy, sell, dividend)",
    predicate: (transaction) => transaction.category === "Investment",
  },
  {
    id: "banking",
    label: "Banking",
    description: "Show only banking transactions (spending, income)",
    predicate: (transaction) => transaction.category !== "Investment",
  },
  {
    id: "transfers",
    label: "Transfers",
    description: "Include only account-to-account movement",
    predicate: (transaction) => Boolean(transaction.isTransfer),
  },
  {
    id: "recurring",
    label: "Recurring",
    description: "Auto-pay and subscription charges",
    predicate: (transaction) => Boolean(transaction.isRecurring),
  },
  {
    id: "flagged",
    label: "Flagged",
    description: "Manual review flagged for follow-up",
    predicate: (transaction) => Boolean(transaction.isFlagged),
  },
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

type DateRangePresetId = "30d" | "90d" | "ytd" | "all"

type SelectedRangeKind = DateRangePresetId | "custom"

const presetLabels: Record<DateRangePresetId, string> = {
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  ytd: "Year to date",
  all: "All dates",
}

const presetOrder: DateRangePresetId[] = ["30d", "90d", "ytd", "all"]

function createPresetRange(preset: DateRangePresetId): DateRange {
  // Use start of day to avoid timezone issues with calendar display
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  switch (preset) {
    case "30d":
      return { from: subDays(today, 29), to: today }
    case "90d":
      return { from: subDays(today, 89), to: today }
    case "ytd":
      return { from: startOfYear(today), to: today }
    case "all":
    default:
      return { from: undefined, to: undefined }
  }
}

function formatDateRangeLabel(range: DateRange, presetId: SelectedRangeKind) {
  if (presetId !== "custom") {
    return presetLabels[presetId] ?? "Custom range"
  }

  const { from, to } = range

  if (from && to) {
    const sameYear = from.getFullYear() === to.getFullYear()
    const sameMonth = sameYear && from.getMonth() === to.getMonth()
    const startFormat = sameYear ? "MMM d" : "MMM d, yyyy"
    const endFormat = sameYear && sameMonth ? "d, yyyy" : "MMM d, yyyy"
    return `${format(from, startFormat)} – ${format(to, endFormat)}`
  }

  if (from) {
    return `From ${format(from, "MMM d, yyyy")}`
  }

  if (to) {
    return `Through ${format(to, "MMM d, yyyy")}`
  }

  return "All dates"
}

export function TransactionsWorkspace() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAccount, setSelectedAccount] = useState<string>("All accounts")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<number[]>([])
  const [liveMessage, setLiveMessage] = useState("Loading transactions")
  const [dateRangeState, setDateRangeState] = useState<{ presetId: SelectedRangeKind; range: DateRange }>(() => ({
    presetId: "30d",
    range: createPresetRange("30d"),
  }))
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  // Load transactions on mount and when date range changes
  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true)
      try {
        const { from, to } = dateRangeState.range
        
        // Only fetch if we have both dates or neither (all dates)
        if ((from && !to) || (!from && to)) {
          setIsLoading(false)
          return
        }
        
        const startDate = from ? format(from, "yyyy-MM-dd") : undefined
        const endDate = to ? format(to, "yyyy-MM-dd") : undefined
        
        const fetchedTransactions = await getTransactions(startDate, endDate)
        setTransactions(fetchedTransactions)
        setLiveMessage(`${fetchedTransactions.length} transactions loaded`)
      } catch (error) {
        console.error("Failed to load transactions:", error)
        setTransactions([])
        setLiveMessage("Failed to load transactions")
      } finally {
        setIsLoading(false)
      }
    }
    loadTransactions()
  }, [dateRangeState.range])

  const accounts = useMemo(() => ["All accounts", ...new Set(transactions.map((tx) => tx.account))], [transactions])

  const { range: selectedRange, presetId: selectedPresetId } = dateRangeState
  const dateRangeLabel = formatDateRangeLabel(selectedRange, selectedPresetId)

  const applyPreset = useCallback(
    (presetId: DateRangePresetId) => {
      setDateRangeState({ presetId, range: createPresetRange(presetId) })
      setDatePickerOpen(false)
    },
    [setDatePickerOpen],
  )

  const handleRangeSelect = useCallback(
    (next: DateRange | undefined) => {
      if (!next) {
        return
      }

      // Update state with partial or complete range
      setDateRangeState({ presetId: "custom", range: next })

      // Don't auto-close - let user manually close or adjust selection
    },
    [],
  )

  const clearDateRange = useCallback(() => {
    applyPreset("all")
  }, [applyPreset])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesAccount = selectedAccount === "All accounts" || transaction.account === selectedAccount
      const matchesSearch =
        searchQuery.length === 0 ||
        transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesFilters =
        selectedFilters.length === 0 ||
        selectedFilters.every((filterId) =>
          quickFilters.find((filter) => filter.id === filterId)?.predicate(transaction) ?? false,
        )

      const matchesDate = (() => {
        const { from, to } = selectedRange
        const transactionDate = parseISO(transaction.date)

        if (from && transactionDate < from) {
          return false
        }

        if (to && transactionDate > to) {
          return false
        }

        return true
      })()

      return matchesAccount && matchesSearch && matchesFilters && matchesDate
    })
  }, [transactions, selectedAccount, searchQuery, selectedFilters, selectedRange])

  // Debug: Log filtered transactions
  useEffect(() => {
    console.log('Filtered transactions:', filteredTransactions.length, 'out of', transactions.length)
    console.log('Filters:', { selectedAccount, searchQuery, selectedFilters, selectedRange })
  }, [filteredTransactions, transactions, selectedAccount, searchQuery, selectedFilters, selectedRange])

  const toggleTransaction = useCallback((id: number) => {
    setSelectedTransactionIds((previous) =>
      previous.includes(id) ? previous.filter((transactionId) => transactionId !== id) : [...previous, id],
    )
  }, [])

  const toggleFilter = useCallback((filterId: string) => {
    setSelectedFilters((previous) => {
      const next = previous.includes(filterId)
        ? previous.filter((existing) => existing !== filterId)
        : [...previous, filterId]

      trackTransactionFilter({ filterId, active: next.includes(filterId) })
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelectedTransactionIds(filteredTransactions.map((transaction) => transaction.id))
  }, [filteredTransactions])

  const clearSelection = useCallback(() => {
    setSelectedTransactionIds([])
  }, [])

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "a") {
        event.preventDefault()
        selectAll()
      }
      if (event.key === "Escape") {
        clearSelection()
      }
    }

    window.addEventListener("keydown", handleKeydown)
    return () => window.removeEventListener("keydown", handleKeydown)
  }, [clearSelection, selectAll])

  useEffect(() => {
    const parts = [`Showing ${filteredTransactions.length} transactions`]
    if (selectedAccount !== "All accounts") {
      parts.push(`for ${selectedAccount}`)
    }
    if (selectedFilters.length > 0) {
      parts.push(`filtered by ${selectedFilters.join(", ")}`)
    }
    if (searchQuery) {
      parts.push(`matching "${searchQuery}"`)
    }
    parts.push(`date range ${dateRangeLabel}`)
    setLiveMessage(parts.join(" · "))
  }, [dateRangeLabel, filteredTransactions.length, searchQuery, selectedAccount, selectedFilters])

  const handleBulkAction = useCallback(
    (action: "categorize" | "tag" | "export") => {
      if (selectedTransactionIds.length === 0) return

      trackTransactionBulkAction({
        action,
        count: selectedTransactionIds.length,
        filterIds: selectedFilters,
      })

      const actionLabel =
        action === "categorize" ? "Categorized" : action === "tag" ? "Tags added" : "Export queued"
      toast.success(actionLabel, {
        description: `${selectedTransactionIds.length} transaction${selectedTransactionIds.length > 1 ? "s" : ""} processed`,
      })
      clearSelection()
    },
    [clearSelection, selectedFilters, selectedTransactionIds.length],
  )

  return (
    <Card className="card-standard overflow-hidden">
      <CardHeader className="gap-4 md:gap-6 md:sticky md:top-0 md:z-10 md:border-b md:border-border/40 md:bg-card/95 md:backdrop-blur supports-[backdrop-filter]:md:bg-card/80">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between min-w-0">
          <div className="space-y-1 min-w-0">
            <CardTitle className="text-lg font-semibold">Transactions workspace</CardTitle>
            <CardDescription className="truncate">
              Bulk manage categories, tags, and reviews with keyboard shortcuts and virtualized scrolling.
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2 text-xs text-muted-foreground md:items-center">
            <div className="flex items-center gap-2">
              <Keyboard className="h-3.5 w-3.5" />
              <span>
                Press <kbd className="rounded bg-muted px-1">⌘</kbd> + <kbd className="rounded bg-muted px-1">A</kbd> to select all
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AssignmentMenu entityId="transaction-review" entityType="transaction" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <CollaborationDrawer
                        entityId="transaction-review"
                        entityType="transaction"
                        entityName="Transactions workspace"
                        triggerLabel="Discuss"
                        disabled={selectedTransactionIds.length === 0}
                      />
                    </div>
                  </TooltipTrigger>
                  {selectedTransactionIds.length === 0 && (
                    <TooltipContent>
                      <p className="text-xs">Select transactions to discuss</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between min-w-0">
          <div className="min-w-0 flex-1 lg:flex-initial overflow-hidden">
            <ScrollArea className="w-full">
              <div className="flex items-center gap-2 pb-2">
                <Button
                  variant={selectedAccount === "All accounts" ? "secondary" : "outline"}
                  size="sm"
                  className="rounded-full flex-shrink-0"
                  aria-pressed={selectedAccount === "All accounts"}
                  onClick={() => setSelectedAccount("All accounts")}
                >
                  All accounts
                </Button>
                {accounts
                  .filter((account) => account !== "All accounts")
                  .map((account) => {
                    const active = selectedAccount === account
                    return (
                      <Button
                        key={account}
                        variant={active ? "secondary" : "outline"}
                        size="sm"
                        className="rounded-full flex-shrink-0"
                        aria-pressed={active}
                        onClick={() => setSelectedAccount(account)}
                      >
                        {account}
                      </Button>
                    )
                  })}
              </div>
            </ScrollArea>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end min-w-0 flex-shrink-0">
            <div className="relative w-full sm:w-auto sm:min-w-[160px] sm:max-w-[240px]">
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  // Prevent global keyboard shortcuts from interfering with input
                  event.stopPropagation()
                }}
                placeholder="Search transactions..."
                className="w-full"
                aria-label="Search transactions"
              />
            </div>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 rounded-full sm:w-auto sm:min-w-[160px] sm:max-w-[240px]"
                  aria-label={`Select transaction date range, currently ${dateRangeLabel}`}
                >
                  <CalendarDays className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{dateRangeLabel}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto max-w-[calc(100vw-1rem)] p-2" 
                align="center"
                collisionPadding={10}
                sideOffset={8}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="grid grid-cols-2 gap-1.5 w-full">
                    {presetOrder.map((presetId) => {
                      const active = selectedPresetId === presetId
                      return (
                        <Button
                          key={presetId}
                          size="sm"
                          variant={active ? "default" : "ghost"}
                          className="h-7 text-xs font-medium"
                          onClick={() => applyPreset(presetId)}
                          aria-pressed={active}
                        >
                          {presetLabels[presetId]}
                        </Button>
                      )
                    })}
                  </div>
                  <Calendar
                    mode="range"
                    numberOfMonths={1}
                    selected={selectedRange}
                    onSelect={handleRangeSelect}
                    className="[--cell-size:1.75rem] text-sm"
                  />
                  <div className="flex items-center justify-between gap-2 w-full">
                    <Button variant="ghost" size="sm" onClick={clearDateRange} className="h-7 text-xs">
                      Clear
                    </Button>
                    {selectedRange.from && selectedRange.to ? (
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => setDatePickerOpen(false)}
                        className="h-7 text-xs"
                      >
                        Apply
                      </Button>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">
                        {selectedRange.from ? "Select end date" : "Select start date"}
                      </p>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <TooltipProvider delayDuration={100}>
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <Badge variant="outline" className="gap-1 flex-shrink-0" aria-hidden="true">
              <Filter className="h-3.5 w-3.5" />
              Quick filters
            </Badge>
            {quickFilters.map((filter) => {
              const active = selectedFilters.includes(filter.id)
              return (
                <Tooltip key={filter.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={active ? "secondary" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => toggleFilter(filter.id)}
                      aria-pressed={active}
                      aria-label={`${filter.label} – ${filter.description}`}
                    >
                      {filter.label}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs text-xs leading-relaxed">
                    {filter.description}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="p-0">
        <div className="sr-only" aria-live="polite">
          {liveMessage}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px] md:h-[540px]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
              <p className="text-sm text-muted-foreground">Loading transactions...</p>
            </div>
          </div>
        ) : null}

        <div className={isLoading ? "hidden" : "space-y-3 px-4 py-4 md:hidden"}>
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
              <div className="rounded-full bg-muted/50 p-3">
                <Filter className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">No transactions found</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Try adjusting your filters, expanding the date range, or linking additional accounts.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {selectedFilters.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFilters([])}
                    className="h-7 text-xs"
                  >
                    Clear filters
                  </Button>
                )}
                {selectedPresetId !== "all" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset("all")}
                    className="h-7 text-xs"
                  >
                    Show all dates
                  </Button>
                )}
                {selectedAccount !== "All accounts" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAccount("All accounts")}
                    className="h-7 text-xs"
                  >
                    All accounts
                  </Button>
                )}
              </div>
            </div>
          ) : (
            filteredTransactions.map((transaction) => {
              const isSelected = selectedTransactionIds.includes(transaction.id)
              const amountClass = transaction.amount >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-foreground"
              const formattedAmount = formatCurrency(transaction.amount)

              return (
                <div
                  key={transaction.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleTransaction(transaction.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      toggleTransaction(transaction.id)
                    }
                  }}
                  className={cn(
                    "card-standard card-lift p-4 transition-colors",
                    isSelected ? "ring-2 ring-primary" : "hover:border-border/70",
                  )}
                  aria-pressed={isSelected}
                >
                  {/* Header Row: Icon, Merchant, Checkbox */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                      <transaction.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{transaction.merchant}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleTransaction(transaction.id)}
                      aria-label={`Select transaction from ${transaction.merchant}`}
                      className="mt-1"
                    />
                  </div>

                  {/* Details Row: Category, Badges, Amount */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs min-w-0">
                      <span className="font-medium text-foreground px-2 py-0.5 rounded-md bg-muted/50">{transaction.category}</span>
                      {transaction.isRecurring ? (
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 text-[10px]">
                          Recurring
                        </Badge>
                      ) : null}
                      {transaction.isFlagged ? (
                        <Badge variant="secondary" className="bg-amber-500/15 text-amber-700 text-[10px]">
                          Flagged
                        </Badge>
                      ) : null}
                      {transaction.isTransfer ? (
                        <Badge variant="secondary" className="bg-purple-500/15 text-purple-700 text-[10px]">
                          Transfer
                        </Badge>
                      ) : null}
                    </div>
                    <span className={cn("text-base font-semibold tabular-nums whitespace-nowrap flex-shrink-0", amountClass)}>
                      <MaskableValue value={formattedAmount} srLabel={`Amount ${formattedAmount}`} />
                    </span>
                  </div>

                  {/* Account Row */}
                  <div className="mt-2 pt-2 border-t border-border/40">
                    <p className="text-xs text-muted-foreground truncate">{transaction.account}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className={isLoading ? "hidden" : "hidden md:block h-[540px] overflow-hidden"}>
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4 text-center space-y-4">
              <div className="rounded-full bg-muted/50 p-4">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-base font-medium text-foreground">No transactions found</p>
                <p className="text-sm text-muted-foreground max-w-md">
                  Try adjusting your filters, expanding the date range, or linking additional accounts to see more transactions.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {selectedFilters.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFilters([])}
                  >
                    Clear filters
                  </Button>
                )}
                {selectedPresetId !== "all" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset("all")}
                  >
                    Show all dates
                  </Button>
                )}
                {selectedAccount !== "All accounts" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAccount("All accounts")}
                  >
                    All accounts
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-[40px_200px_140px_1fr_140px] items-center gap-4 border-b border-border/60 bg-muted/30 px-6 py-3 text-xs font-medium text-muted-foreground">
                <div></div>
                <div>Description</div>
                <div>Date</div>
                <div>Category</div>
                <div className="text-right">Amount</div>
              </div>
              
              {/* Table Body with Virtualization */}
              <Virtuoso<Transaction>
                data={filteredTransactions}
                overscan={200}
                itemContent={(_index, transaction) => {
                  const isSelected = selectedTransactionIds.includes(transaction.id)
                  const amountClass = transaction.amount >= 0 ? "text-emerald-600 dark:text-emerald-500" : "text-foreground"

                  return (
                    <div
                      key={transaction.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleTransaction(transaction.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault()
                          toggleTransaction(transaction.id)
                        }
                      }}
                      className={cn(
                        "grid grid-cols-[40px_200px_140px_1fr_140px] items-center gap-4 border-b border-border/40 px-6 py-3.5 transition-colors",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                        isSelected ? "bg-primary/5" : "hover:bg-muted/30",
                      )}
                    >
                      {/* Checkbox */}
                      <div className="flex items-center">
                        <Checkbox 
                          checked={isSelected} 
                          onCheckedChange={() => toggleTransaction(transaction.id)}
                          aria-label={`Select ${transaction.merchant}`}
                        />
                      </div>

                      {/* Description Column */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                          <transaction.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{transaction.merchant}</p>
                          <p className="text-xs text-muted-foreground truncate">{transaction.account}</p>
                        </div>
                      </div>

                      {/* Date Column */}
                      <div className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>

                      {/* Category Column */}
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-foreground truncate">{transaction.category}</span>
                        <div className="flex flex-wrap items-center gap-1">
                          {transaction.isRecurring ? (
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 text-[10px] px-1.5 py-0">
                              Recurring
                            </Badge>
                          ) : null}
                          {transaction.isFlagged ? (
                            <Badge variant="secondary" className="bg-amber-500/15 text-amber-700 text-[10px] px-1.5 py-0">
                              Flagged
                            </Badge>
                          ) : null}
                          {transaction.isTransfer ? (
                            <Badge variant="secondary" className="bg-purple-500/15 text-purple-700 text-[10px] px-1.5 py-0">
                              Transfer
                            </Badge>
                          ) : null}
                        </div>
                      </div>

                      {/* Amount Column */}
                      <div className={cn("text-right text-sm font-semibold tabular-nums", amountClass)}>
                        <MaskableValue value={formatCurrency(transaction.amount)} srLabel={`Amount ${formatCurrency(transaction.amount)}`} />
                      </div>
                    </div>
                  )
                }}
              />
            </>
          )}
        </div>
      </CardContent>

      {selectedTransactionIds.length > 0 ? (
        <div className="sticky bottom-28 z-20 mx-6 mb-4 rounded-xl border border-border/40 bg-card/95 p-4 shadow-lg md:bottom-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-medium text-foreground">
              {selectedTransactionIds.length} selected
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleBulkAction("categorize")} className="gap-2">
                <FolderGit2 className="h-4 w-4" /> Categorize
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction("tag")} className="gap-2">
                <Tag className="h-4 w-4" /> Add tags
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction("export")} className="gap-2">
                <Download className="h-4 w-4" /> Export
              </Button>
              <Button variant="ghost" size="sm" onClick={clearSelection}>
                Clear
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  )
}
