"use client"

import { useMemo, forwardRef, type HTMLAttributes, useCallback } from "react"

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
  TrendingDown,
  TrendingUp,
} = sharedIcons

const statusStyles: Record<
  AccountStatus,
  { label: string; description: string; className: string; indicatorClass: string }
> = {
  active: {
    label: "Active",
    description: "Connection is healthy and syncing automatically.",
    className:
      "border-emerald-500/40 text-emerald-600 dark:text-emerald-300 bg-emerald-500/10", 
    indicatorClass: "bg-emerald-500",
  },
  needs_update: {
    label: "Update required",
    description: "Authentication expired. Refresh to resume automatic syncs.",
    className:
      "border-amber-500/50 text-amber-700 dark:text-amber-300 bg-amber-500/10",
    indicatorClass: "bg-amber-500",
  },
  disconnected: {
    label: "Disconnected",
    description: "We can't reach this institution. Reconnect to restore data.",
    className:
      "border-slate-500/40 text-slate-600 dark:text-slate-300 bg-slate-500/10",
    indicatorClass: "bg-slate-400",
  },
}

type VirtualRow =
  | { type: "group"; id: string; groupName: string; count: number }
  | { type: "account"; id: string; account: Account; groupName: string; isIgnored: boolean }
  | { type: "detail"; id: string; account: Account }

const recentTransactions: Transaction[] = getRecentTransactions()

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
}: AccountsTableDesktopProps) {
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
          const accountRow: VirtualRow = {
            type: "account",
            id: `account-${account.id}`,
            account,
            groupName,
            isIgnored: ignoredAccounts.has(account.id),
          }
          rows.push(accountRow)

          if (expandedAccount === account.id) {
            rows.push({
              type: "detail",
              id: `detail-${account.id}`,
              account,
            })
          }
        })
      }
    })

    return rows
  }, [groupedAccounts, collapsedGroups, groupBy, ignoredAccounts, expandedAccount])

  const tableHeight = useMemo(() => {
    const estimatedRowHeight = 72
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
            <col className="w-[30%]" />
            <col className="w-[12%]" />
            <col className="w-[16%]" />
            <col className="w-[14%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
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
          className={cn(
            "sticky top-0 z-20 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80",
            className,
          )}
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
                ? "hover:bg-muted/50 transition-colors cursor-pointer"
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
          style={{ height: tableHeight }}
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
            return [
              <td key={`${item.id}-detail`} colSpan={7} className="bg-muted/30 p-4">
                <AccountDetailPanel
                  account={item.account}
                  onReconnect={onUpdateConnection}
                  transactions={recentTransactions}
                  typeColors={typeColors}
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
                <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                  <BankIcon className="h-4 w-4 text-muted-foreground" />
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
                  <p className="text-xs text-muted-foreground truncate">{account.institution}</p>
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
                {account.change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                )}
                <span
                  className={cn(
                    "text-sm font-medium tabular-nums",
                    account.change > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
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
                          "flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium",
                          statusStyles[account.status].className,
                        )}
                      >
                        <span
                          className={cn("h-2 w-2 rounded-full", statusStyles[account.status].indicatorClass)}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={`Reconnect ${account.name}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      onUpdateConnection(account.id)
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
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
                  <DropdownMenuItem className="text-destructive">Disconnect</DropdownMenuItem>
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
