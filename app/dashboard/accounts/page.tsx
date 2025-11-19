"use client"

import { AccountsPageClient } from "@/components/accounts-page.client"
import { getAccounts } from "@/lib/services/accounts"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import type { Account } from "@/types/domain"

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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
    <AccountsPageClient 
      totalCash={totalCash} 
      totalCreditDebt={totalCreditDebt} 
      totalInvestments={totalInvestments} 
    />
  )
}
