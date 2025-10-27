"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SwitchField } from "@/components/ui/switch"
import { Loader2, Wallet } from "lucide-react"

import { AccountsListMobile } from "./accounts-list-mobile"
import { AccountsTableDesktop } from "./accounts-table-desktop"
import { sharedIcons } from "@/lib/mock"
import { filterAccounts, groupAccounts, sortAccounts } from "./utils"
import type { GroupBy, SortDirection, SortField, AccountType } from "./types"
import { getAccounts } from "@/lib/services/accounts"
import { cn } from "@/lib/utils"

const { Filter, Plus } = sharedIcons

interface AccountsTableProps {
  onRequestLink: () => void
  isLinking?: boolean
  linkingInstitution?: string | null
}

export function AccountsTable({
  onRequestLink,
  isLinking = false,
  linkingInstitution,
}: AccountsTableProps) {
  const [sortField, setSortField] = useState<SortField>("balance")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [accounts, setAccounts] = useState(() => getAccounts())
  const [expandedAccount, setExpandedAccount] = useState<number | null>(null)
  const [hideZeroBalance, setHideZeroBalance] = useState(false)
  const [ignoredAccounts, setIgnoredAccounts] = useState<Set<number>>(new Set())
  const [groupBy, setGroupBy] = useState<GroupBy>("none")
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())
  const [typeFilters, setTypeFilters] = useState<Set<AccountType>>(new Set())

  const accountTypes = useMemo(() => {
    const types = new Set<AccountType>()
    accounts.forEach((account) => types.add(account.type))
    return Array.from(types).sort((a, b) => a.localeCompare(b))
  }, [accounts])

  const handleSort = (field: SortField) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortDirection(newDirection)
    setAccounts((current) => sortAccounts(current, field, newDirection))
  }

  const handleRowClick = (accountId: number) => {
    setExpandedAccount((current) => (current === accountId ? null : accountId))
  }

  const handleUpdateConnection = (_accountId: number) => {
    onRequestLink()
  }

  const toggleIgnoreAccount = (accountId: number) => {
    setIgnoredAccounts((current) => {
      const next = new Set(current)
      if (next.has(accountId)) {
        next.delete(accountId)
      } else {
        next.add(accountId)
      }
      return next
    })
  }

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups((current) => {
      const next = new Set(current)
      if (next.has(groupName)) {
        next.delete(groupName)
      } else {
        next.add(groupName)
      }
      return next
    })
  }

  const toggleTypeFilter = (accountType: AccountType) => {
    setTypeFilters((current) => {
      const next = new Set(current)
      if (next.has(accountType)) {
        next.delete(accountType)
      } else {
        next.add(accountType)
      }
      return next
    })
  }

  const clearTypeFilters = () => {
    setTypeFilters(new Set())
  }

  const resetFilters = () => {
    setHideZeroBalance(false)
    clearTypeFilters()
    setGroupBy("none")
  }

  const filteredAccounts = useMemo(
    () => filterAccounts(accounts, { hideZeroBalance, typeFilters }),
    [accounts, hideZeroBalance, typeFilters],
  )

  const groupedAccounts = useMemo(
    () => groupAccounts(filteredAccounts, groupBy),
    [filteredAccounts, groupBy],
  )

  const hasAccounts = accounts.length > 0
  const hasFilteredResults = filteredAccounts.length > 0

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
        <Card className="card-standard">
          <CardHeader className="space-y-4">
            <div className="space-y-2">
              <CardTitle>All Accounts</CardTitle>
              {!hasAccounts && (
                <p className="text-sm text-muted-foreground">
                  Link your bank, credit, and investment accounts to see them here.
                </p>
              )}
              {isLinking && (
                <div
                  className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm"
                  role="status"
                  aria-live="polite"
                >
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  <span>
                    Linking {linkingInstitution ? `${linkingInstitution}` : "account"}
                    &hellip;
                  </span>
                </div>
              )}
            </div>

            {hasAccounts && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <SwitchField
                    id="hide-zero"
                    label="Hide $0 balance"
                    layout="inline"
                    checked={hideZeroBalance}
                    onCheckedChange={setHideZeroBalance}
                  />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" aria-hidden="true" />
                        Group: {groupBy === "none" ? "None" : groupBy === "institution" ? "Institution" : "Type"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setGroupBy("none")}>No Grouping</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setGroupBy("institution")}>By Institution</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setGroupBy("type")}>By Account Type</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {accountTypes.map((type) => {
                    const isActive = typeFilters.has(type)
                    return (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        data-state={isActive ? "on" : "off"}
                        aria-pressed={isActive}
                        className={cn(
                          "rounded-full border-dashed bg-transparent text-xs font-medium",
                          isActive && "border-primary/60 bg-primary/10 text-primary",
                        )}
                        onClick={() => toggleTypeFilter(type)}
                      >
                        {type}
                      </Button>
                    )
                  })}
                  {typeFilters.size > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-foreground"
                      onClick={clearTypeFilters}
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!hasAccounts ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Wallet className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="text-lg font-semibold">Link your first account</h3>
                  <p className="text-sm text-muted-foreground">
                    Securely connect your accounts to bring balances, cash flow, and insights together in one place.
                  </p>
                </div>
                <Button variant="cta" size="lg" onClick={onRequestLink} disabled={isLinking}>
                  {isLinking ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      Linking…
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" aria-hidden="true" />
                      Link now
                    </>
                  )}
                </Button>
              </div>
            ) : hasFilteredResults ? (
              <>
                <AccountsTableDesktop
                  groupedAccounts={groupedAccounts}
                  groupBy={groupBy}
                  collapsedGroups={collapsedGroups}
                  onToggleGroupCollapse={toggleGroupCollapse}
                  onSort={handleSort}
                  expandedAccount={expandedAccount}
                  ignoredAccounts={ignoredAccounts}
                  onToggleExpand={handleRowClick}
                  onToggleIgnoreAccount={toggleIgnoreAccount}
                  onUpdateConnection={handleUpdateConnection}
                />

                <AccountsListMobile
                  groupedAccounts={groupedAccounts}
                  groupBy={groupBy}
                  collapsedGroups={collapsedGroups}
                  onToggleGroupCollapse={toggleGroupCollapse}
                  expandedAccount={expandedAccount}
                  ignoredAccounts={ignoredAccounts}
                  onToggleExpand={handleRowClick}
                  onToggleIgnoreAccount={toggleIgnoreAccount}
                  onUpdateConnection={handleUpdateConnection}
                />
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 py-12 text-center text-sm text-muted-foreground">
                <p>No accounts match your current filters.</p>
                <Button size="sm" variant="outline" onClick={resetFilters}>
                  Reset filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-md md:hidden z-50 h-14 w-14 p-0"
        onClick={onRequestLink}
        aria-label={isLinking ? "Linking account" : "Link a new account"}
        disabled={isLinking}
      >
        {isLinking ? (
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
        ) : (
          <Plus className="h-6 w-6" aria-hidden="true" />
        )}
      </Button>
    </>
  )
}
