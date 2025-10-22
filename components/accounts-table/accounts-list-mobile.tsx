import { MaskableValue } from "@/components/privacy-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AnimatePresence, motion } from "framer-motion"

import {
  bankLogos,
  defaultBankIcon,
  mockTransactions,
  sharedIcons,
  typeColors,
} from "./data"
import { MiniSparkline } from "./mini-sparkline"
import type { Account, GroupBy } from "./types"

const {
  Calendar,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  MoreHorizontal,
  RefreshCw,
} = sharedIcons

interface AccountsListMobileProps {
  groupedAccounts: Record<string, Account[]>
  groupBy: GroupBy
  collapsedGroups: Set<string>
  onToggleGroupCollapse: (groupName: string) => void
  expandedAccount: number | null
  ignoredAccounts: Set<number>
  onToggleExpand: (accountId: number) => void
  onToggleIgnoreAccount: (accountId: number) => void
  onUpdateConnection: (accountId: number) => void
}

export function AccountsListMobile({
  groupedAccounts,
  groupBy,
  collapsedGroups,
  onToggleGroupCollapse,
  expandedAccount,
  ignoredAccounts,
  onToggleExpand,
  onToggleIgnoreAccount,
  onUpdateConnection,
}: AccountsListMobileProps) {
  return (
    <div className="md:hidden space-y-3">
      {Object.entries(groupedAccounts).map(([groupName, accounts]) => (
        <div key={groupName}>
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
            <div className="space-y-3">
              {accounts.map((account) => {
                const BankIcon = bankLogos[account.institution] || defaultBankIcon
                const isExpanded = expandedAccount === account.id
                const isIgnored = ignoredAccounts.has(account.id)

                return (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`card-standard card-lift cursor-pointer p-4 space-y-3 ${
                      isIgnored ? "opacity-50" : ""
                    }`}
                    onClick={() => onToggleExpand(account.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                          <BankIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
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
                      <Badge variant="outline" className={`whitespace-nowrap ml-2 ${typeColors[account.type] || ""}`}>
                        {account.type}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Balance</p>
                        <p className="text-lg font-semibold tabular-nums font-mono">
                          <MaskableValue
                            value={`$${Math.abs(account.balance).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}`}
                            srLabel={`${account.name} balance`}
                          />
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">30d Change</p>
                        <div className="flex items-center gap-1">
                          <MiniSparkline trend={account.change} />
                          <span
                            className={`text-sm font-medium tabular-nums ${
                              account.change > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {account.change > 0 ? "+" : ""}
                            {account.change}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {account.status === "needs_update" ? (
                          <>
                            <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                            <span className="text-destructive font-medium">Update Required</span>
                          </>
                        ) : (
                          <>
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span>Synced {account.lastSync}</span>
                          </>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync Now
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Transactions</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(event) => {
                              event.stopPropagation()
                              onToggleIgnoreAccount(account.id)
                            }}
                          >
                            {isIgnored ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                            {isIgnored ? "Include in Net Worth" : "Ignore in Net Worth"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Disconnect</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="pt-3 border-t border-border/30 space-y-3"
                        >
                          {account.status === "needs_update" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 bg-transparent"
                              onClick={(event) => {
                                event.stopPropagation()
                                onUpdateConnection(account.id)
                              }}
                            >
                              <RefreshCw className="h-3 w-3" />
                              Reconnect Account
                            </Button>
                          )}

                          {account.nextBillDue && (
                            <div className="p-3 rounded-md bg-muted/40">
                              <p className="text-xs text-muted-foreground mb-2">Next Bill Due</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">{account.nextBillDue}</span>
                                </div>
                                <span className="text-sm font-semibold tabular-nums font-mono">
                                  $
                                  {account.nextBillAmount?.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                  })}
                                </span>
                              </div>
                            </div>
                          )}

                          <div>
                            <h4 className="text-sm font-semibold mb-2">Recent Transactions</h4>
                            <div className="space-y-2">
                              {mockTransactions.slice(0, 3).map((txn) => {
                                const TxnIcon = txn.icon
                                return (
                                  <div key={txn.id} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                      <TxnIcon className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-muted-foreground">{txn.merchant}</span>
                                    </div>
                                    <span
                                      className={`font-semibold tabular-nums font-mono ${
                                        txn.amount > 0 ? "text-green-600 dark:text-green-400" : ""
                                      }`}
                                    >
                                      {txn.amount > 0 ? "+" : ""}${Math.abs(txn.amount).toFixed(2)}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            View All Transactions
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
