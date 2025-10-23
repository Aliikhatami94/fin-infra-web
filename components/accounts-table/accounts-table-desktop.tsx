import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Fragment } from "react"

import { AccountRow } from "./account-row"
import { sharedIcons } from "@/lib/mock"
import type { GroupBy, SortField } from "./types"
import type { Account } from "@/types/domain"

const { ArrowUpDown, ChevronDown, ChevronRight } = sharedIcons

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
  return (
    <div className="hidden md:block overflow-x-auto">
      {Object.entries(groupedAccounts).map(([groupName, accounts]) => (
        <div key={groupName} className="mb-6 last:mb-0">
          {groupBy !== "none" && (
            <button
              onClick={() => onToggleGroupCollapse(groupName)}
              className="flex items-center gap-2 w-full py-2 px-3 mb-2 rounded-md hover:bg-muted/40 transition-smooth text-left"
            >
              {collapsedGroups.has(groupName) ? (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm font-semibold">{groupName}</span>
              <Badge variant="outline" className="ml-auto">
                {accounts.length}
              </Badge>
            </button>
          )}

          {!collapsedGroups.has(groupName) && (
            <table className="w-full text-sm table-fixed">
              <colgroup>
                <col className="w-[36%]" />
                <col className="w-[12%]" />
                <col className="w-[16%]" />
                <col className="w-[14%]" />
                <col className="w-[12%]" />
                <col className="w-[10%]" />
                <col className="w-[0%] sm:w-[4%]" />
              </colgroup>
              {groupBy === "none" && (
                <thead>
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
                </thead>
              )}
              <tbody>
                {accounts.map((account) => (
                  <Fragment key={account.id}>
                    <AccountRow
                      account={account}
                      isExpanded={expandedAccount === account.id}
                      isIgnored={ignoredAccounts.has(account.id)}
                      onToggleExpand={onToggleExpand}
                      onToggleIgnoreAccount={onToggleIgnoreAccount}
                      onUpdateConnection={onUpdateConnection}
                    />
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  )
}
