"use client"

import { AccountsPageClient } from "@/components/accounts-page.client"
import { getAccounts } from "@/lib/services/accounts"
import { useEffect, useState, useRef } from "react"
import { Loader2 } from "lucide-react"
import type { Account } from "@/types/domain"

// Disable static generation for this page
export const dynamic = 'force-dynamic'

export default function BankingPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate fetches in React Strict Mode
    if (hasFetchedRef.current) return
    hasFetchedRef.current = true

    const loadAccounts = async () => {
      try {
        const fetchedAccounts = await getAccounts()
        setAccounts(fetchedAccounts)
      } catch (error) {
        console.error("Failed to load accounts:", error)
        setAccounts([])
      } finally {
        setIsLoading(false)
      }
    }
    loadAccounts()
  }, [])
  
  // Calculate KPI totals from real Plaid accounts
  // 
  // Total Cash: Sum of all liquid depository accounts (Checking, Savings, Money Market, CD, HSA)
  // Includes: Checking accounts, Savings accounts, CDs, Money Market, HSA, Cash Management
  const cashAccounts = accounts.filter(acc => 
    acc.type === "Checking" || acc.type === "Savings"
  )
  const totalCash = cashAccounts.reduce((sum, acc) => sum + acc.balance, 0)
  
  // Total Credit Debt: Sum of all Credit Card balances
  // Note: Plaid returns credit card balances as positive numbers (amount owed)
  // We use Math.abs() to ensure debt is always shown as positive
  const creditAccounts = accounts.filter(acc => acc.type === "Credit Card")
  const totalCreditDebt = creditAccounts.reduce((sum, acc) => sum + Math.abs(acc.balance), 0)
  
  // Total Investments: Sum of all investment account balances
  // Includes: IRA, 401k, Roth IRA, brokerage accounts, investment accounts
  const investmentAccounts = accounts.filter(acc => acc.type === "Investment")
  const totalInvestments = investmentAccounts.reduce((sum, acc) => sum + acc.balance, 0)
  
  // Note: Loans (mortgage, student, auto) are tracked separately in the accounts table
  // They are not included in these KPIs which focus on:
  // - Liquid assets (cash, investments)
  // - Revolving credit (credit cards)
  // For full liability tracking, see the Net Worth dashboard

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <AccountsPageClient
      accounts={accounts}
      totalCash={totalCash}
      totalCreditDebt={totalCreditDebt}
      totalInvestments={totalInvestments}
    />
  )
}
