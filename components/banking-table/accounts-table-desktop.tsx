"use client"

import { useMemo, forwardRef, type HTMLAttributes, useCallback, useState, useEffect } from "react"

import { MaskableValue } from "@/components/privacy-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TableVirtuoso, type TableComponents } from "react-virtuoso"
import { cn } from "@/lib/utils"

import { AccountDetailPanel } from "./account-detail-panel"
import { MiniSparkline } from "./mini-sparkline"
import { bankLogos, defaultBankIcon, sharedIcons, typeColors } from "@/lib/mock"
import type { GroupBy, SortField } from "./types"
import type { Account, Transaction, AccountStatus } from "@/types/domain"
import { formatCurrency, formatNumber } from "@/lib/format"
import { getRecentTransactions } from "@/lib/services/accounts"

const {
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  MoreHorizontal,
  RefreshCw,
} = sharedIcons

const statusStyles: Record<
  AccountStatus,
  { label: string; description: string; className: string; indicatorClass: string }
> = {
  active: {
    label: "Active",
    description: "Connection is healthy and syncing automatically.",
    className:
      "border-emerald-200/60 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 bg-transparent", 
    indicatorClass: "bg-emerald-500",
  },
  needs_update: {
    label: "Update required",
    description: "Authentication expired. Refresh to resume automatic syncs.",
    className:
      "border-amber-200/60 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 bg-transparent",
    indicatorClass: "bg-amber-500",
  },
  disconnected: {
    label: "Disconnected",
    description: "We can't reach this institution. Reconnect to restore data.",
    className:
      "border-slate-200/60 dark:border-slate-700/40 text-slate-600 dark:text-slate-400 bg-transparent",
    indicatorClass: "bg-slate-400",
  },
}

type VirtualRow =
  | { type: "group"; id: string; groupName: string; count: number }
  | { type: "account"; id: string; account: Account; groupName: string; isIgnored: boolean; accountId: string }
  | { type: "detail"; id: string; account: Account; accountId: string }

interface AccountsTableDesktopProps {
  groupedAccounts: Record<string, Account[]>
  groupBy: GroupBy
  collapsedGroups: Set<string>
  onToggleGroupCollapse: (groupName: string) => void
  onSort: (field: SortField) => void
  expandedAccount: number | null
  ignoredAccounts: Set<number>
  onToggleExpand: (accountId: number) => void
  onToggleIgnoreAccount: (accountId: number) => void
  onUpdateConnection: (accountId: number) => void
  onDisconnectAccount: (institution: string) => void
}

export function AccountsTableDesktop({
  groupedAccounts,
  groupBy,
  collapsedGroups,
  onToggleGroupCollapse,
  onSort,
  expandedAccount,
  ignoredAccounts,
  onToggleExpand,
  onToggleIgnoreAccount,
  onUpdateConnection,
  onDisconnectAccount,
}: AccountsTableDesktopProps) {
  // Cache transactions per account to avoid refetching
  const [transactionsCache, setTransactionsCache] = useState<Record<string, Transaction[]>>({})
  const [loadingTransactions, setLoadingTransactions] = useState<Set<string>>(new Set())

  // Fetch transactions when account is expanded
  useEffect(() => {
    if (expandedAccount === null) return

    const account = Object.values(groupedAccounts)
      .flat()
      .find((acc) => acc.id === expandedAccount)

    if (!account) {
      console.log("⚠️ Account not found for expandedAccount:", expandedAccount)
      return
    }
    
    if (!account.account_id) {
      console.log("⚠️ Account missing account_id:", account)
      return
    }

    const accountId = account.account_id
    console.log(`🔓 Expanded account ${account.name} (id=${account.id}, account_id=${accountId})`)

    // Skip if already loading or cached
    if (loadingTransactions.has(accountId)) {
      console.log(`⏳ Already loading transactions for ${accountId}`)
      return
    }
    
    if (transactionsCache[accountId]) {
      console.log(`💾 Using cached transactions for ${accountId} (${transactionsCache[accountId].length} txns)`)
      return
    }

    // Mark as loading
    setLoadingTransactions((prev) => new Set(prev).add(accountId))
    console.log(`🚀 Fetching transactions for account ${accountId}...`)

    // Fetch transactions
    getRecentTransactions(accountId, 3)
      .then((transactions) => {
        setTransactionsCache((prev) => ({ ...prev, [accountId]: transactions }))
      })
      .catch((error) => {
        console.error(`Failed to fetch transactions for account ${accountId}:`, error)
      })
      .finally(() => {
        setLoadingTransactions((prev) => {
          const next = new Set(prev)
          next.delete(accountId)
          return next
        })
      })
  }, [expandedAccount, groupedAccounts, loadingTransactions, transactionsCache])

  const virtualRows = useMemo<VirtualRow[]>(() => {
    const rows: VirtualRow[] = []

    Object.entries(groupedAccounts).forEach(([groupName, accounts]) => {
      const isCollapsed = collapsedGroups.has(groupName)

      if (groupBy !== "none") {
        rows.push({
          type: "group",
          id: `group-${groupName}`,
          groupName,
          count: accounts.length,
        })
      }

      if (!isCollapsed) {
        accounts.forEach((account) => {
          // Use Plaid account_id for API calls
          const accountId = account.account_id || String(account.id)
          
          const accountRow: VirtualRow = {
            type: "account",
            id: `account-${account.id}`,
            account,
            groupName,
            isIgnored: ignoredAccounts.has(account.id),
            accountId,
          }
          rows.push(accountRow)

          if (expandedAccount === account.id) {
            rows.push({
              type: "detail",
              id: `detail-${account.id}`,
              account,
              accountId,
            })
          }
        })
      }
    })

    return rows
  }, [groupedAccounts, collapsedGroups, groupBy, ignoredAccounts, expandedAccount])

  const tableHeight = useMemo(() => {
    const estimatedRowHeight = 64
    const estimatedDetailHeight = 220
    const detailCount = virtualRows.filter((row) => row.type === "detail").length
    const baseRows = virtualRows.length - detailCount
    const estimatedHeader = 52
    const totalHeight = estimatedHeader + baseRows * estimatedRowHeight + detailCount * estimatedDetailHeight
    const maxHeight = 520
    const minHeight = 280
    return Math.max(minHeight, Math.min(maxHeight, totalHeight))
  }, [virtualRows])

  const handleIgnoreClick = useCallback(
    (accountId: number) => {
      onToggleIgnoreAccount(accountId)
    },
    [onToggleIgnoreAccount],
  )

  const tableComponents = useMemo<TableComponents<VirtualRow>>(() => {
    const VirtTable = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(function VirtTable(
      { className, children, ...props },
      ref,
    ) {
      return (
        <table {...props} ref={ref} className={cn("w-full text-sm table-auto", className)}>
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[12%]" />
            <col className="w-[16%]" />
            <col className="w-[16%]" />
            <col className="w-[10%]" />
            <col className="w-[14%]" />
            <col className="w-[4%]" />
          </colgroup>
          {children}
        </table>
      )
    })

    const VirtHead = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function VirtHead(
      { className, ...props },
      ref,
    ) {
      return (
        <thead
          {...props}
          ref={ref}
          className={cn("sticky top-0 z-20", className)}
        />
      )
    })

    const VirtBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function VirtBody(
      { className, ...props },
      ref,
    ) {
      return <tbody {...props} ref={ref} className={className} />
    })

    const VirtRow = forwardRef<
      HTMLTableRowElement,
      HTMLAttributes<HTMLTableRowElement> & { item: VirtualRow }
    >(function VirtRow({ className, item, onClick, ...props }, ref) {
      return (
        <tr
          {...props}
          ref={ref}
          style={{ borderColor: "var(--table-divider)" }}
          onClick={(event) => {
            if (item.type === "account") {
              onToggleExpand(item.account.id)
            }
            onClick?.(event)
          }}
          className={cn(
            "border-b last:border-0",
            item.type === "group"
              ? "bg-muted/40"
              : item.type === "account"
                ? "hover:bg-muted/50 transition-colors cursor-pointer odd:bg-muted/25"
                : "bg-muted/20",
            item.type === "account" && item.isIgnored && "opacity-50",
            className,
          )}
        />
      )
    })

    return {
      Table: VirtTable,
      TableHead: VirtHead,
      TableBody: VirtBody,
      TableRow: VirtRow,
    }
  }, [onToggleExpand])

  return (
    <div className="hidden md:block">
      <div className="table-surface">
        <TableVirtuoso
          data={virtualRows}
          style={{ height: tableHeight, scrollbarGutter: "stable" }}
          components={tableComponents}
          className="min-w-full"
        fixedHeaderContent={() => (
          <tr
            className="border-b text-xs uppercase tracking-wide text-muted-foreground"
            style={{ borderColor: "var(--table-divider)" }}
          >
            <th className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-left">
              <button
                onClick={() => onSort("name")}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                Account
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </th>
            <th className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-left">Type</th>
            <th className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-right">
              <button
                onClick={() => onSort("balance")}
                className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
              >
                Balance
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </th>
            <th className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-right">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onSort("change")}
                      className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                    >
                      Change (30d)
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Change over the last 30 days</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </th>
            <th className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-left">Last Sync</th>
            <th className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-left">Status</th>
            <th className="px-[calc(var(--table-cell-padding-x)/2)] py-[var(--table-cell-padding-y)] text-right" aria-hidden />
          </tr>
        )}
        itemContent={(index, item) => {
          if (item.type === "group") {
            return [
              <td
                key={`${item.id}-group`}
                colSpan={7}
                className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)]"
              >
                <button
                  onClick={(event) => {
                    event.stopPropagation()
                    onToggleGroupCollapse(item.groupName)
                  }}
                  className="flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-left hover:bg-muted/60 transition-smooth"
                  aria-expanded={!collapsedGroups.has(item.groupName)}
                >
                  {collapsedGroups.has(item.groupName) ? (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-semibold">{item.groupName}</span>
                  <Badge variant="outline" className="ml-auto">
                    {item.count}
                  </Badge>
                </button>
              </td>,
            ]
          }

          if (item.type === "detail") {
            const transactions = transactionsCache[item.accountId] || []
            const isLoading = loadingTransactions.has(item.accountId)
            
            return [
              <td key={`${item.id}-detail`} colSpan={7} className="bg-muted/30 p-4">
                <AccountDetailPanel
                  account={item.account}
                  onReconnect={onUpdateConnection}
                  transactions={transactions}
                  typeColors={typeColors}
                  isLoadingTransactions={isLoading}
                />
              </td>,
            ]
          }

          const account = item.account
          const BankIcon = bankLogos[account.institution] || defaultBankIcon
          const isIgnored = item.isIgnored

          return [
            <td
              key={`${item.id}-account`}
              className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] align-middle"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center flex-shrink-0 shadow-sm ring-1 ring-border/50">
                  <BankIcon className="h-5 w-5 text-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{account.name}</p>
                    {isIgnored && (
                      <Badge variant="outline" className="text-xs">
                        Ignored
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate font-medium">{account.institution}</p>
                </div>
              </div>
            </td>,
            <td
              key={`${item.id}-type`}
              className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] align-middle"
            >
              <Badge variant="outline" className={cn("whitespace-nowrap", typeColors[account.type] || "")}>
                {account.type}
              </Badge>
            </td>,
            <td
              key={`${item.id}-balance`}
              className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-right align-middle"
            >
              <p className="text-sm font-semibold tabular-nums font-mono text-foreground whitespace-nowrap">
                <MaskableValue
                  value={formatCurrency(Math.abs(account.balance), {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  srLabel={`${account.name} balance`}
                />
              </p>
            </td>,
            <td
              key={`${item.id}-change`}
              className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] text-right align-middle"
            >
              <div className="inline-flex items-center justify-end gap-1 whitespace-nowrap">
                <MiniSparkline
                  trend={account.change}
                  data={account.balanceHistory}
                  label={`${account.name} balance trend for the last 30 days`}
                />
                <span
                  className={cn(
                    "text-sm font-medium font-mono tabular-nums ml-1",
                    account.change > 0
                      ? "text-green-600 dark:text-green-400"
                      : account.change < 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground",
                  )}
                >
                  {formatNumber(account.change, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                    signDisplay: "exceptZero",
                  })}%
                </span>
              </div>
            </td>,
            <td
              key={`${item.id}-sync`}
              className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] align-middle"
            >
              <p className="text-sm text-muted-foreground whitespace-nowrap">{account.lastSync}</p>
            </td>,
            <td
              key={`${item.id}-status`}
              className="px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] align-middle"
            >
              <div className="flex items-center justify-start gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1.5 rounded-md px-2 py-0.5 text-xs font-normal",
                          statusStyles[account.status].className,
                        )}
                      >
                        <span
                          className={cn("h-1.5 w-1.5 rounded-full", statusStyles[account.status].indicatorClass)}
                          aria-hidden
                        />
                        {statusStyles[account.status].label}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {statusStyles[account.status].description}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {account.status === "needs_update" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                          onClick={(event) => {
                            event.stopPropagation()
                            onUpdateConnection(account.id)
                          }}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Update now</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </td>,
            <td key={`${item.id}-actions`} className="py-3 px-1 text-right align-middle">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`More actions for ${account.name}`}
                    className="h-8 w-8"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(event) => {
                      event.stopPropagation()
                      onUpdateConnection(account.id)
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Now
                  </DropdownMenuItem>
                  <DropdownMenuItem>View Transactions</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(event) => {
                      event.stopPropagation()
                      handleIgnoreClick(account.id)
                    }}
                  >
                    {isIgnored ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                    {isIgnored ? "Include in Net Worth" : "Ignore in Net Worth"}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={(event) => {
                      event.stopPropagation()
                      onDisconnectAccount(account.institution)
                    }}
                  >
                    Disconnect {account.institution}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>,
          ]
        }}
        />
      </div>
    </div>
  )
}
