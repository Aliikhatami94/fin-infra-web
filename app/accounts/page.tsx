"use client"

import { AccountsTable } from "@/components/accounts-table"
import { AccountsKPICards } from "@/components/accounts-kpi-cards"
import { AIInsightsBanner } from "@/components/ai-insights-banner"

export default function AccountsPage() {
  const totalCash = 12450.32 + 45230.0 + 32000.0
  const totalCreditDebt = 2340.12 + 1234.56
  const totalInvestments = 187650.45

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 page-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display font-semibold text-foreground">Accounts</h1>
          <p className="text-body text-muted-foreground mt-1">Manage your linked bank accounts and credit cards</p>
        </div>
      </div>

      <AccountsKPICards totalCash={totalCash} totalCreditDebt={totalCreditDebt} totalInvestments={totalInvestments} />

      <AIInsightsBanner />

      <AccountsTable />
    </div>
  )
}
