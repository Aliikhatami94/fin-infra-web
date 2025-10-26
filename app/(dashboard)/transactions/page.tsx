"use client"

import { Suspense } from "react"
import { TransactionsInsights } from "@/components/transactions-insights"
import { TransactionsWorkspace } from "@/components/transactions-workspace"

function InsightsSkeleton() {
  return <div className="h-[360px] w-full rounded-2xl bg-muted animate-pulse" />
}

export default function TransactionsPage() {
  return (
    <>
      {/* Header */}
      <div className="bg-card/90 backdrop-blur-md border-b border-border/20">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-4">
          <h1 className="text-2xl font-semibold text-foreground">Transactions</h1>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10 py-6 space-y-6">
        <Suspense fallback={<InsightsSkeleton />}>
          <TransactionsInsights />
        </Suspense>
        <TransactionsWorkspace />
      </div>
    </>
  )
}
