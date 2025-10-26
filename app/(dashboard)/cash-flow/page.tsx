"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { CashFlowKPIs } from "@/components/cash-flow-kpis"
import { CategoriesChart } from "@/components/categories-chart"
import { RecurringExpenses } from "@/components/recurring-expenses"
import { RecentTransactions } from "@/components/recent-transactions"
import { CashFlowAIInsights } from "@/components/cashflow-ai-insights"
import { UpcomingCharges } from "@/components/upcoming-charges"
import { ChartCardSkeleton } from "@/components/chart-skeleton"
import type { CashFlowChartProps } from "@/components/cash-flow-chart"
import { ErrorBoundary } from "@/components/error-boundary"

const CashFlowChart = dynamic<CashFlowChartProps>(
  () => import("@/components/cash-flow-chart").then((mod) => mod.CashFlowChart),
  {
    ssr: false,
    loading: () => <ChartCardSkeleton title="Cash Flow Overview" contentHeight="h-[350px]" />,
  },
)

export default function CashFlowPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)

  return (
    <>
      {/* Header */}
      <div className="bg-card/90 backdrop-blur-md border-b border-border/20">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-4">
          <h1 className="text-2xl font-semibold text-foreground">Cash Flow</h1>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10 py-6 space-y-6">
        <div className="space-y-6">
          <CashFlowKPIs />

          <ErrorBoundary feature="Cash flow insights">
            <CashFlowAIInsights />
          </ErrorBoundary>

          <CashFlowChart onMonthClick={setSelectedMonth} selectedMonth={selectedMonth} />
        </div>

        <CategoriesChart selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        <UpcomingCharges />

        <div className="grid gap-6 lg:grid-cols-2">
          <RecurringExpenses selectedCategory={selectedCategory} />
          <RecentTransactions selectedCategory={selectedCategory} selectedMonth={selectedMonth} />
        </div>
      </div>
    </>
  )
}
