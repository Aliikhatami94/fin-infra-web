"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { CashFlowChart } from "@/components/cash-flow-chart"
import { CategoriesChart } from "@/components/categories-chart"
import { RecurringExpenses } from "@/components/recurring-expenses"

export default function CashFlowPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />

      <main className="ml-64 mt-16 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <h1 className="text-2xl font-semibold text-foreground">Cash Flow</h1>

          <CashFlowChart />

          <div className="grid gap-6 lg:grid-cols-2">
            <CategoriesChart />
            <RecurringExpenses />
          </div>
        </div>
      </main>
    </div>
  )
}
