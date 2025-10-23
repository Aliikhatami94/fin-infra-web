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
import type { Account, Transaction } from "@/types/domain"
import { formatCurrency, formatNumber } from "@/lib/format"
import { getRecentTransactions } from "@/lib/services/accounts"

const {
  AlertCircle,
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
        <table {...props} ref={ref} className={cn("w-full text-sm table-fixed", className)}>
          <colgroup>
            <col className="w-[36%]" />
            <col className="w-[12%]" />
            <col className="w-[16%]" />
            <col className="w-[14%]" />
            <col className="w-[12%]" />
            <col className="w-[10%]" />
            <col className="w-[0%] sm:w-[4%]" />
          </colgroup>
          {children}
        </table>
      )
    })

    const VirtHead = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function VirtHead(
      { className, ...props },
      ref,
    ) {
      return <thead {...props} ref={ref} className={cn("sticky top-0 bg-card z-10", className)} />
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
      <TableVirtuoso
        data={virtualRows}
        style={{ height: tableHeight }}
        components={tableComponents}
        fixedHeaderContent={() => (
          <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
            <th className="py-3 px-3 text-left">
              <button
                onClick={() => onSort("name")}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                Account
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </th>
            <th className="py-3 px-3 text-left">Type</th>
            <th className="py-3 px-3 text-right">
              <button
                onClick={() => onSort("balance")}
                className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
              >
                Balance
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </th>
            <th className="py-3 px-3 text-right">
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
            <th className="py-3 px-3 text-left">Last Sync</th>
            <th className="py-3 px-3 text-left">Status</th>
            <th className="py-3 px-1 text-right" aria-hidden />
          </tr>
        )}
        itemContent={(index, item) => {
          if (item.type === "group") {
            return [
              <td key={`${item.id}-group`} colSpan={7} className="py-3 px-3">
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
            <td key={`${item.id}-account`} className="py-3 px-3 align-middle">
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
            <td key={`${item.id}-type`} className="py-3 px-3 align-middle">
              <Badge variant="outline" className={cn("whitespace-nowrap", typeColors[account.type] || "")}>
                {account.type}
              </Badge>
            </td>,
            <td key={`${item.id}-balance`} className="py-3 px-3 text-right align-middle">
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
            <td key={`${item.id}-change`} className="py-3 px-3 text-right align-middle">
              <div className="inline-flex items-center justify-end gap-1 whitespace-nowrap">
                <MiniSparkline trend={account.change} />
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
            <td key={`${item.id}-sync`} className="py-3 px-3 align-middle">
              <p className="text-sm text-muted-foreground whitespace-nowrap">{account.lastSync}</p>
            </td>,
            <td key={`${item.id}-status`} className="py-3 px-3 align-middle">
              {account.status === "needs_update" ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(event) => {
                    event.stopPropagation()
                    onUpdateConnection(account.id)
                  }}
                >
                  <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  <span className="text-xs font-medium">Update Required</span>
                  <AlertCircle className="h-3 w-3" />
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">Active</span>
                </div>
              )}
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
  )
}
