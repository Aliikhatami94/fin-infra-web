"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { MaskableValue } from "@/components/privacy-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Plus,
  Building2,
  CreditCard,
  Landmark,
  RefreshCw,
  ArrowUpDown,
  AlertCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PlaidLinkDialog } from "@/components/plaid-link-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"

const bankLogos: Record<string, React.ComponentType<{ className?: string }>> = {
  Chase: Building2,
  Fidelity: Landmark,
  "American Express": CreditCard,
  "Capital One": Building2,
}

const accountsData = [
  {
    id: 1,
    name: "Chase Total Checking",
    type: "Checking",
    institution: "Chase",
    balance: 12450.32,
    change: 2.3,
    lastSync: "2 hours ago",
    status: "active",
  },
  {
    id: 2,
    name: "Chase Savings",
    type: "Savings",
    institution: "Chase",
    balance: 45230.0,
    change: 1.2,
    lastSync: "2 hours ago",
    status: "active",
  },
  {
    id: 3,
    name: "Fidelity Brokerage",
    type: "Investment",
    institution: "Fidelity",
    balance: 187650.45,
    change: 5.7,
    lastSync: "1 hour ago",
    status: "active",
  },
  {
    id: 4,
    name: "Sapphire Reserve",
    type: "Credit Card",
    institution: "Chase",
    balance: -2340.12,
    change: -15.2,
    lastSync: "5 hours ago",
    status: "active",
  },
  {
    id: 5,
    name: "Amex Gold Card",
    type: "Credit Card",
    institution: "American Express",
    balance: -1234.56,
    change: -8.5,
    lastSync: "1 day ago",
    status: "needs_update",
  },
  {
    id: 6,
    name: "Capital One 360",
    type: "Savings",
    institution: "Capital One",
    balance: 32000.0,
    change: 0.8,
    lastSync: "5 hours ago",
    status: "active",
  },
]

type SortField = "name" | "balance" | "change"
type SortDirection = "asc" | "desc"

const MiniSparkline = ({ trend }: { trend: number }) => {
  const points = 7
  const data = []
  for (let i = 0; i < points; i++) {
    const value = 50 + Math.random() * 20 + (trend > 0 ? i * 2 : -i * 2)
    data.push(value)
  }

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const pointsStr = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  const color = trend > 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"

  return (
    <svg className="w-12 h-6" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={pointsStr}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AccountsTable() {
  const router = useRouter()
  const [isPlaidOpen, setIsPlaidOpen] = useState(false)
  const [sortField, setSortField] = useState<SortField>("balance")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [accounts, setAccounts] = useState(accountsData)
  const [expandedAccount, setExpandedAccount] = useState<number | null>(null)

  const handleSort = (field: SortField) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortDirection(newDirection)

    const sorted = [...accounts].sort((a, b) => {
      let aVal: string | number = 0
      let bVal: string | number = 0

      if (field === "name") {
        aVal = a.name.toLowerCase()
        bVal = b.name.toLowerCase()
      } else if (field === "balance") {
        aVal = a.balance
        bVal = b.balance
      } else if (field === "change") {
        aVal = a.change
        bVal = b.change
      }

      if (aVal < bVal) return newDirection === "asc" ? -1 : 1
      if (aVal > bVal) return newDirection === "asc" ? 1 : -1
      return 0
    })

    setAccounts(sorted)
  }

  const handleRowClick = (accountId: number) => {
    if (expandedAccount === accountId) {
      setExpandedAccount(null)
    } else {
      setExpandedAccount(accountId)
    }
  }

  const handleUpdateConnection = (accountId: number) => {
    setIsPlaidOpen(true)
  }

  const typeColors: Record<string, string> = {
    Checking: "border-blue-500/50 text-blue-700 dark:text-blue-300 bg-blue-500/10",
    Savings: "border-green-500/50 text-green-700 dark:text-green-300 bg-green-500/10",
    Investment: "border-purple-500/50 text-purple-700 dark:text-purple-300 bg-purple-500/10",
    "Credit Card": "border-red-500/50 text-red-700 dark:text-red-300 bg-red-500/10",
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="border-border/30 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Accounts</CardTitle>
              <Button size="sm" className="gap-2 hidden md:flex" onClick={() => setIsPlaidOpen(true)}>
                <Plus className="h-4 w-4" />
                Connect Account
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
                <thead>
                  <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-3 px-3 text-left">
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        Account
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="py-3 px-3 text-left">Type</th>
                    <th className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleSort("balance")}
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
                              onClick={() => handleSort("change")}
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
                <tbody>
                  {accounts.map((account) => {
                    const BankIcon = bankLogos[account.institution] || Building2
                    const isExpanded = expandedAccount === account.id

                    return (
                      <React.Fragment key={account.id}>
                        <motion.tr
                          onClick={() => handleRowClick(account.id)}
                          className="border-b last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                        >
                          <td className="py-3 px-3 align-middle">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                                <BankIcon className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{account.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{account.institution}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 align-middle">
                            <Badge variant="outline" className={`whitespace-nowrap ${typeColors[account.type] || ""}`}>
                              {account.type}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-right align-middle">
                            <p className="text-sm font-semibold tabular-nums font-mono text-foreground whitespace-nowrap">
                              <MaskableValue
                                value={`$${Math.abs(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                                srLabel={`${account.name} balance`}
                              />
                            </p>
                          </td>
                          <td className="py-3 px-3 text-right align-middle">
                            <div className="inline-flex items-center justify-end gap-1 whitespace-nowrap">
                              <MiniSparkline trend={account.change} />
                              {account.change > 0 ? (
                                <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                              )}
                              <span
                                className={`text-sm font-medium tabular-nums ${
                                  account.change > 0
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {account.change > 0 ? "+" : ""}
                                {account.change}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3 align-middle">
                            <p className="text-sm text-muted-foreground whitespace-nowrap">{account.lastSync}</p>
                          </td>
                          <td className="py-3 px-3 align-middle">
                            {account.status === "needs_update" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleUpdateConnection(account.id)
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
                          </td>
                          <td className="py-3 px-1 text-right align-middle">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label={`More actions for ${account.name}`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Sync Now
                                </DropdownMenuItem>
                                <DropdownMenuItem>View Transactions</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Disconnect</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <td colSpan={7} className="bg-muted/20 p-4">
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold">Recent Activity</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">Last 7 days transactions</span>
                                      <span className="font-medium">12 transactions</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">Average daily balance</span>
                                      <span className="font-medium tabular-nums font-mono">
                                        $
                                        {Math.abs(account.balance * 0.98).toLocaleString("en-US", {
                                          minimumFractionDigits: 2,
                                        })}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">Institution</span>
                                      <span className="font-medium">{account.institution}</span>
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                                    View All Transactions
                                  </Button>
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {accounts.map((account) => {
                const BankIcon = bankLogos[account.institution] || Building2
                const isExpanded = expandedAccount === account.id

                return (
                  <motion.div
                    key={account.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-border/30 rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleRowClick(account.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                          <BankIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{account.name}</p>
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
                            value={`$${Math.abs(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
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
                              account.change > 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
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
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
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
                          <DropdownMenuItem className="text-destructive">Disconnect</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-3 border-t border-border/30 space-y-2"
                        >
                          <h4 className="text-sm font-semibold">Recent Activity</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Last 7 days</span>
                              <span className="font-medium">12 transactions</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Avg. daily balance</span>
                              <span className="font-medium tabular-nums font-mono">
                                $
                                {Math.abs(account.balance * 0.98).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                            View All Transactions
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-lg md:hidden z-50 h-14 w-14 p-0"
        onClick={() => setIsPlaidOpen(true)}
        aria-label="Connect new account"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <PlaidLinkDialog open={isPlaidOpen} onOpenChange={setIsPlaidOpen} />
    </>
  )
}
