"use client"

import { useState } from "react"
import { PortfolioKPIs } from "@/components/portfolio-kpis"
import { AllocationGrid } from "@/components/allocation-grid"
import { HoldingsTable } from "@/components/holdings-table"
import { PerformanceComparison } from "@/components/performance-comparison"

export default function PortfolioPage() {
  const [allocationFilter, setAllocationFilter] = useState<string | null>(null)

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Portfolio</h1>

      <PortfolioKPIs />
      <PerformanceComparison />
      <AllocationGrid onFilterChange={setAllocationFilter} />
      <HoldingsTable allocationFilter={allocationFilter} />
    </div>
  )
}
