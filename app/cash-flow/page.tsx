"use client"

import { useState } from "react"
import { CashFlowKPIs } from "@/components/cash-flow-kpis"
import { CashFlowChart } from "@/components/cash-flow-chart"
import { CategoriesChart } from "@/components/categories-chart"
import { RecurringExpenses } from "@/components/recurring-expenses"
import { RecentTransactions } from "@/components/recent-transactions"

export default function CashFlowPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Cash Flow</h1>

      <div className="space-y-6">
        <CashFlowKPIs />
        <CashFlowChart />
      </div>

      <CategoriesChart selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecurringExpenses selectedCategory={selectedCategory} />
        <RecentTransactions selectedCategory={selectedCategory} />
      </div>
    </div>
  )
}
