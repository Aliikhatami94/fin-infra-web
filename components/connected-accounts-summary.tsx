"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAccounts } from "@/lib/services/accounts"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react"
import Link from "next/link"
import type { Account } from "@/types/domain"

export function ConnectedAccountsSummary() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setLoading(true)
        const data = await getAccounts()
        setAccounts(data)
      } catch (err) {
        console.error("Failed to load accounts:", err)
        setAccounts([])
      } finally {
        setLoading(false)
      }
    }

    loadAccounts()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-20 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const accountCount = accounts.length
  const activeAccounts = accounts.filter(acc => acc.status === "active")
  const inactiveCount = accountCount - activeAccounts.length

  // Calculate account type breakdown
  const bankingAccounts = accounts.filter(acc => 
    acc.type === "Checking" || acc.type === "Savings"
  ).length
  const investmentAccounts = accounts.filter(acc => acc.type === "Investment").length
  const creditAccounts = accounts.filter(acc => acc.type === "Credit Card").length

  return (
    <Card>
      <CardContent className="pt-6">
        <Link 
          href="/dashboard/accounts"
          className="group flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2">
            <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-foreground">
                {accountCount} {accountCount === 1 ? 'Account' : 'Accounts'} Connected
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {bankingAccounts > 0 && (
                <span>{bankingAccounts} banking</span>
              )}
              {investmentAccounts > 0 && (
                <span>{investmentAccounts} investment</span>
              )}
              {creditAccounts > 0 && (
                <span>{creditAccounts} credit</span>
              )}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 mt-1" />
        </Link>
      </CardContent>
    </Card>
  )
}
