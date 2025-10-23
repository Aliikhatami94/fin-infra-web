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
import type { MouseEvent } from "react"

import { AccountDetailPanel } from "./account-detail-panel"
import { bankLogos, defaultBankIcon, sharedIcons, typeColors } from "@/lib/mock"
import { MiniSparkline } from "./mini-sparkline"
import type { Account, Transaction } from "@/types/domain"
import { formatCurrency, formatNumber } from "@/lib/format"
import { getRecentTransactions } from "@/lib/services/accounts"

const {
  AlertCircle,
  Eye,
  EyeOff,
  MoreHorizontal,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} = sharedIcons

const recentTransactions: Transaction[] = getRecentTransactions()

interface AccountRowProps {
  account: Account
  isExpanded: boolean
  isIgnored: boolean
  onToggleExpand: (accountId: number) => void
  onToggleIgnoreAccount: (accountId: number) => void
  onUpdateConnection: (accountId: number) => void
}

export function AccountRow({
  account,
  isExpanded,
  isIgnored,
  onToggleExpand,
  onToggleIgnoreAccount,
  onUpdateConnection,
}: AccountRowProps) {
  const BankIcon = bankLogos[account.institution] || defaultBankIcon

  const handleRowClick = () => {
    onToggleExpand(account.id)
  }

  const handleUpdateClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onUpdateConnection(account.id)
  }

  const handleMenuToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  return (
    <>
      <motion.tr
        onClick={handleRowClick}
        className={`border-b last:border-0 hover:bg-muted/40 transition-smooth cursor-pointer ${
          isIgnored ? "opacity-50" : ""
        }`}
      >
        <td className="py-3 px-3 align-middle">
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
        </td>
        <td className="py-3 px-3 align-middle">
          <Badge variant="outline" className={`whitespace-nowrap ${typeColors[account.type] || ""}`}>
            {account.type}
          </Badge>
        </td>
        <td className="py-3 px-3 text-right align-middle">
          <p className="text-sm font-semibold tabular-nums font-mono text-foreground whitespace-nowrap">
            <MaskableValue
              value={formatCurrency(Math.abs(account.balance), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                account.change > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatNumber(account.change, { minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: "exceptZero" })}%
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
              onClick={handleUpdateClick}
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
                onClick={handleMenuToggle}
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
              <DropdownMenuItem onClick={() => onToggleIgnoreAccount(account.id)}>
                {isIgnored ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                {isIgnored ? "Include in Net Worth" : "Ignore in Net Worth"}
              </DropdownMenuItem>
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
              <AccountDetailPanel
                account={account}
                onReconnect={onUpdateConnection}
                transactions={recentTransactions}
                typeColors={typeColors}
              />
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  )
}
