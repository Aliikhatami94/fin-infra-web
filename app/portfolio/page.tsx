"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { PortfolioKPIs } from "@/components/portfolio-kpis"
import { AllocationGrid } from "@/components/allocation-grid"
import { HoldingsTable } from "@/components/holdings-table"
import { RiskSection } from "@/components/risk-section"

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />

      <main className="ml-64 mt-16 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <h1 className="text-2xl font-semibold text-foreground">Portfolio</h1>

          <PortfolioKPIs />
          <AllocationGrid />
          <HoldingsTable />
          <RiskSection />
        </div>
      </main>
    </div>
  )
}
