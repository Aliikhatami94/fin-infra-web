"use client"

import { Suspense } from "react"
import { TransactionsInsights } from "@/components/transactions-insights"
import { TransactionsWorkspace } from "@/components/transactions-workspace"

function InsightsSkeleton() {
  return <div className="h-[360px] w-full rounded-2xl bg-muted animate-pulse" />
}

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Transactions</h1>
      <Suspense fallback={<InsightsSkeleton />}>
        <TransactionsInsights />
      </Suspense>
      <TransactionsWorkspace />
    </div>
  )
}
