"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { TransactionsInsights } from "@/components/transactions-insights"
import { TransactionsWorkspace } from "@/components/transactions-workspace"

function InsightsSkeleton() {
  return <div className="h-[360px] w-full rounded-2xl bg-muted animate-pulse" />
}

export default function TransactionsPage() {
  return (
    <>
      {/* Sticky compact Header */}
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-3">
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">Transactions</h1>
        </div>
      </div>

      {/* Body */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
        <div className="mx-auto w-full max-w-[1200px] space-y-6">
          <div className="px-4 sm:px-6 lg:px-10 py-6">
            <Suspense fallback={<InsightsSkeleton />}>
              <TransactionsInsights />
            </Suspense>
          </div>
          <TransactionsWorkspace />
        </div>
      </motion.div>
    </>
  )
}
