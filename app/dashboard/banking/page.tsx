"use client"

import { BankingPageClient } from "@/components/banking-page.client"
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
        console.log("📥 BankingPage received from getAccounts:", fetchedAccounts.map(acc => ({
          id: acc.id,
          name: acc.name,
          account_id: acc.account_id,
          hasAccountId: !!acc.account_id
        })))
        setAccounts(fetchedAccounts)
        console.log("📤 BankingPage state after setAccounts:", fetchedAccounts.map(acc => ({
          id: acc.id,
          name: acc.name,
          account_id: acc.account_id,
          hasAccountId: !!acc.account_id
        })))
      } catch (error) {
        console.error("Failed to load accounts:", error)
        setAccounts([])
      } finally {
        setIsLoading(false)
      }
    }
    loadAccounts()
  }, [])
  
  // Calculate totals from real accounts
  const totalCash = accounts
    .filter(acc => acc.type === "Checking" || acc.type === "Savings")
    .reduce((sum, acc) => sum + acc.balance, 0)
  
  const totalCreditDebt = accounts
    .filter(acc => acc.type === "Credit Card")
    .reduce((sum, acc) => sum + Math.abs(acc.balance), 0)
  
  const totalInvestments = accounts
    .filter(acc => acc.type === "Investment")
    .reduce((sum, acc) => sum + acc.balance, 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <BankingPageClient
      accounts={accounts}
      totalCash={totalCash}
      totalCreditDebt={totalCreditDebt}
      totalInvestments={totalInvestments}
    />
  )
}
