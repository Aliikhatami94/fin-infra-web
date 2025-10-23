"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"

import { PlaidLinkDialog } from "@/components/plaid-link-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SwitchField } from "@/components/ui/switch"

import { AccountsListMobile } from "./accounts-list-mobile"
import { AccountsTableDesktop } from "./accounts-table-desktop"
import { sharedIcons } from "@/lib/mock"
import { filterAccounts, groupAccounts, sortAccounts } from "./utils"
import type { GroupBy, SortDirection, SortField, AccountType } from "./types"
import { getAccounts } from "@/lib/services/accounts"
import { cn } from "@/lib/utils"

const { Filter, Plus } = sharedIcons

export function AccountsTable() {
  const [isPlaidOpen, setIsPlaidOpen] = useState(false)
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
    setIsPlaidOpen(true)
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

  const filteredAccounts = useMemo(
    () => filterAccounts(accounts, { hideZeroBalance, typeFilters }),
    [accounts, hideZeroBalance, typeFilters],
  )

  const groupedAccounts = useMemo(
    () => groupAccounts(filteredAccounts, groupBy),
    [filteredAccounts, groupBy],
  )

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
        <Card className="card-standard">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>All Accounts</CardTitle>
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
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Filter className="h-4 w-4" />
                      Group: {groupBy === "none" ? "None" : groupBy === "institution" ? "Institution" : "Type"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setGroupBy("none")}>No Grouping</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setGroupBy("institution")}>By Institution</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setGroupBy("type")}>By Account Type</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button size="sm" className="gap-2 hidden md:flex" onClick={() => setIsPlaidOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Connect Account
                </Button>
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
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </motion.div>

      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-md md:hidden z-50 h-14 w-14 p-0"
        onClick={() => setIsPlaidOpen(true)}
        aria-label="Connect new account"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <PlaidLinkDialog open={isPlaidOpen} onOpenChange={setIsPlaidOpen} />
    </>
  )
}
