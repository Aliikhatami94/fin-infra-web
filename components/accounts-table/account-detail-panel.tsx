import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, RefreshCw, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import type { Account, Transaction } from "@/types/domain"
import { formatCurrency } from "@/lib/format"

interface AccountDetailPanelProps {
  account: Account
  typeColors: Record<string, string>
  transactions: Transaction[]
  onReconnect: (accountId: number) => void
  isLoadingTransactions?: boolean
}

export function AccountDetailPanel({ account, onReconnect, transactions, typeColors, isLoadingTransactions = false }: AccountDetailPanelProps) {
  const router = useRouter()
  
  const handleViewAllTransactions = () => {
    // Navigate to transactions page with account filter
    if (account.account_id) {
      router.push(`/dashboard/transactions?account=${account.account_id}`)
    } else {
      router.push('/dashboard/transactions')
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Account Details</h4>
        {account.status === "needs_update" && (
          <Button
            size="sm"
            variant="outline"
            className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 bg-transparent"
            onClick={() => onReconnect(account.id)}
          >
            <RefreshCw className="h-3 w-3" />
            Reconnect Account
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Account Info</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <Badge variant="outline" className={`text-xs ${typeColors[account.type] || ""}`}>
                {account.type}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Institution</span>
              <span className="font-medium">{account.institution}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Synced</span>
              <span className="font-medium">{account.lastSync}</span>
            </div>
          </div>
        </div>

        {account.nextBillDue && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Next Bill</p>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{account.nextBillDue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Due</span>
                <span className="font-semibold tabular-nums font-mono">
                  {typeof account.nextBillAmount === "number"
                    ? formatCurrency(account.nextBillAmount, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : ""}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Quick Stats</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transactions (7d)</span>
              <span className="font-medium">12</span>
            </div>
              <div className="flex justify-between">
              <span className="text-muted-foreground">Avg. Balance</span>
              <span className="font-medium tabular-nums font-mono">
                {formatCurrency(Math.abs(account.balance * 0.98), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Type-Specific Activity Section */}
      {renderAccountActivity(account, transactions, isLoadingTransactions, handleViewAllTransactions)}
    </div>
  )
}

/**
 * Render account-specific activity based on account type
 */
function renderAccountActivity(
  account: Account,
  transactions: Transaction[],
  isLoadingTransactions: boolean,
  handleViewAllTransactions: () => void
) {
  const accountType = account.type.toLowerCase()
  
  // Investment accounts (IRA, 401k, brokerage)
  if (accountType === "investment") {
    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Investment Details</p>
        <div className="space-y-2">
          <div className="p-3 rounded-md bg-muted/30 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Account Type</span>
              <span className="font-medium">{account.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Value</span>
              <span className="font-semibold tabular-nums font-mono">
                {formatCurrency(account.balance, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">30-Day Change</span>
              <span className={`font-semibold tabular-nums font-mono ${account.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {account.change >= 0 ? '+' : ''}{account.change.toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Holdings and detailed performance data coming soon
          </p>
        </div>
        <Button variant="outline" size="sm" className="w-full" disabled>
          View Holdings (Coming Soon)
        </Button>
      </div>
    )
  }
  
  // Loan accounts (Mortgage, Student Loan, Auto Loan)
  if (accountType === "loan") {
    const isStudentLoan = account.name.toLowerCase().includes("student")
    const isMortgage = account.name.toLowerCase().includes("mortgage")
    
    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Loan Details</p>
        <div className="space-y-2">
          <div className="p-3 rounded-md bg-muted/30 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Loan Type</span>
              <span className="font-medium">
                {isMortgage ? "Mortgage" : isStudentLoan ? "Student Loan" : "Loan"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Balance</span>
              <span className="font-semibold tabular-nums font-mono text-red-600 dark:text-red-400">
                {formatCurrency(account.balance, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">30-Day Change</span>
              <span className={`font-semibold tabular-nums font-mono ${account.change <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {account.change >= 0 ? '+' : ''}{account.change.toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Payment history and amortization schedule coming soon
          </p>
        </div>
        <Button variant="outline" size="sm" className="w-full" disabled>
          View Payment Schedule (Coming Soon)
        </Button>
      </div>
    )
  }
  
  // Credit Card accounts
  if (accountType === "credit card") {
    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Recent Charges</p>
        <div className="space-y-2">
          {isLoadingTransactions ? (
            <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
              No recent charges
            </div>
          ) : (
            transactions.slice(0, 3).map((txn) => {
              const TxnIcon = txn.icon
              return (
                <div
                  key={txn.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/40 transition-smooth"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                      <TxnIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{txn.merchant}</p>
                      <p className="text-xs text-muted-foreground">{txn.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold tabular-nums font-mono text-red-600 dark:text-red-400">
                    {formatCurrency(Math.abs(txn.amount), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )
            })
          )}
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={handleViewAllTransactions}>
          View All Charges
        </Button>
      </div>
    )
  }
  
  // Default: Checking/Savings accounts - show transactions
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">Recent Transactions</p>
      <div className="space-y-2">
        {isLoadingTransactions ? (
          <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
            No recent transactions
          </div>
        ) : (
          transactions.slice(0, 3).map((txn) => {
            const TxnIcon = txn.icon
            return (
              <div
                key={txn.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted/40 transition-smooth"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                    <TxnIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{txn.merchant}</p>
                    <p className="text-xs text-muted-foreground">{txn.date}</p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold tabular-nums font-mono ${
                    txn.amount > 0 ? "text-green-600 dark:text-green-400" : "text-foreground"
                  }`}
                >
                  {formatCurrency(txn.amount, { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: "exceptZero" })}
                </span>
              </div>
            )
          })
        )}
      </div>
      <Button variant="outline" size="sm" className="w-full" onClick={handleViewAllTransactions}>
        View All Transactions
      </Button>
    </div>
  )
}
