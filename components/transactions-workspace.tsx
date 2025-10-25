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
  const now = new Date()

  switch (preset) {
    case "30d":
      return { from: subDays(now, 29), to: now }
    case "90d":
      return { from: subDays(now, 89), to: now }
    case "ytd":
      return { from: startOfYear(now), to: now }
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
  const [transactions] = useState(() => getTransactions())
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
      if (!next || (!next.from && !next.to)) {
        applyPreset("all")
        return
      }

      const normalized: DateRange = {
        from: next.from,
        to: next.to,
      }

      setDateRangeState({ presetId: "custom", range: normalized })

      if (normalized.from && normalized.to) {
        setDatePickerOpen(false)
      }
    },
    [applyPreset, setDatePickerOpen],
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
    <Card className="card-standard">
      <CardHeader className="gap-4 md:gap-6 md:sticky md:top-0 md:z-10 md:border-b md:border-border/40 md:bg-card/95 md:backdrop-blur supports-[backdrop-filter]:md:bg-card/80">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">Transactions workspace</CardTitle>
            <CardDescription>
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
              <CollaborationDrawer
                entityId="transaction-review"
                entityType="transaction"
                entityName="Transactions workspace"
                triggerLabel="Discuss"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={selectedAccount === "All accounts" ? "secondary" : "outline"}
              size="sm"
              className="rounded-full"
              aria-pressed={selectedAccount === "All accounts"}
              onClick={() => setSelectedAccount("All accounts")}
            >
              All accounts
            </Button>
            <ScrollArea className="max-w-full lg:max-w-[420px] whitespace-nowrap">
              <div className="flex items-center gap-2 pr-4">
                {accounts
                  .filter((account) => account !== "All accounts")
                  .map((account) => {
                    const active = selectedAccount === account
                    return (
                      <Button
                        key={account}
                        variant={active ? "secondary" : "outline"}
                        size="sm"
                        className="rounded-full"
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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <div className="relative w-full sm:w-64">
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search merchants or categories"
                className="w-full"
                aria-label="Search transactions"
              />
            </div>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 rounded-full sm:w-auto sm:min-w-[200px]"
                  aria-label={`Select transaction date range, currently ${dateRangeLabel}`}
                >
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  <span className="truncate">{dateRangeLabel}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] space-y-3 p-3" align="end">
                <div className="flex flex-wrap items-center gap-2">
                  {presetOrder.map((presetId) => {
                    const active = selectedPresetId === presetId
                    return (
                      <Button
                        key={presetId}
                        size="sm"
                        variant={active ? "secondary" : "outline"}
                        className="rounded-full"
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
                  numberOfMonths={2}
                  selected={selectedRange}
                  onSelect={handleRangeSelect}
                  initialFocus
                />
                <div className="flex items-center justify-between gap-2">
                  <Button variant="ghost" size="sm" onClick={clearDateRange}>
                    Clear
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setDatePickerOpen(false)}
                    disabled={!selectedRange.from || !selectedRange.to}
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <TooltipProvider delayDuration={100}>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1" aria-hidden="true">
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

        <div className="space-y-3 px-4 py-4 md:hidden">
          {filteredTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center">No transactions match the current filters.</p>
          ) : (
            filteredTransactions.map((transaction) => {
              const isSelected = selectedTransactionIds.includes(transaction.id)
              const amountClass = transaction.amount >= 0 ? "text-emerald-600" : "text-foreground"
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
                    "card-standard card-lift space-y-3 p-4 transition-colors",
                    isSelected ? "ring-2 ring-primary" : "hover:border-border/70",
                  )}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{transaction.merchant}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()} · {transaction.account}
                      </p>
                    </div>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleTransaction(transaction.id)}
                      aria-label={`Select transaction from ${transaction.merchant}`}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-medium text-foreground">{transaction.category}</span>
                      {transaction.isNew ? <Badge variant="secondary">New</Badge> : null}
                      {transaction.isRecurring ? (
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-700">
                          Recurring
                        </Badge>
                      ) : null}
                      {transaction.isFlagged ? (
                        <Badge variant="secondary" className="bg-amber-500/15 text-amber-700">
                          Flagged
                        </Badge>
                      ) : null}
                      {transaction.isTransfer ? (
                        <Badge variant="secondary" className="bg-purple-500/15 text-purple-700">
                          Transfer
                        </Badge>
                      ) : null}
                      {(transaction.tags ?? []).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <span className={cn("text-sm font-semibold tabular-nums", amountClass)}>
                      <MaskableValue value={formattedAmount} srLabel={`Amount ${formattedAmount}`} />
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="hidden md:block max-h-[540px]">
          <Virtuoso<Transaction>
            data={filteredTransactions}
            overscan={200}
            itemContent={(_index, transaction) => {
              const isSelected = selectedTransactionIds.includes(transaction.id)
              const amountClass = transaction.amount >= 0 ? "text-emerald-500" : "text-foreground"

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
                    "grid grid-cols-[auto_auto_1fr_auto] items-center gap-4 border-b border-border/40 px-6 py-4 transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    isSelected ? "bg-primary/5" : "hover:bg-muted/40",
                  )}
                >
                  <Checkbox checked={isSelected} onCheckedChange={() => toggleTransaction(transaction.id)} />
                  <div className="flex flex-col text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{transaction.merchant}</span>
                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    <span>{transaction.account}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold text-foreground">{transaction.category}</span>
                    <div className="flex flex-wrap items-center gap-1">
                      {transaction.isNew ? <Badge variant="secondary">New</Badge> : null}
                      {transaction.isRecurring ? (
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-700">
                          Recurring
                        </Badge>
                      ) : null}
                      {transaction.isFlagged ? (
                        <Badge variant="secondary" className="bg-amber-500/15 text-amber-700">
                          Flagged
                        </Badge>
                      ) : null}
                      {transaction.isTransfer ? (
                        <Badge variant="secondary" className="bg-purple-500/15 text-purple-700">
                          Transfer
                        </Badge>
                      ) : null}
                      {(transaction.tags ?? []).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className={cn("text-right text-sm font-semibold tabular-nums", amountClass)}>
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              )
            }}
          />
        </div>
      </CardContent>

      {selectedTransactionIds.length > 0 ? (
        <div className="sticky bottom-28 z-20 mx-6 mb-4 rounded-xl border border-border/40 bg-background/95 p-4 shadow-lg md:bottom-4">
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
