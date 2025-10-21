"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { BudgetSummary } from "@/components/budget-summary"
import { BudgetTable } from "@/components/budget-table"
import { BudgetChart } from "@/components/budget-chart"

export default function BudgetPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />

  <main id="main-content" className="ml-64 mt-16 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <h1 className="text-2xl font-semibold text-foreground">Budget</h1>

          <BudgetSummary />
          <BudgetTable />
          <BudgetChart />
        </div>
      </main>
    </div>
  )
}
