"use client"

import { useState } from "react"
import { PortfolioKPIs } from "@/components/portfolio-kpis"
import { AllocationGrid } from "@/components/allocation-grid"
import { HoldingsTable } from "@/components/holdings-table"
import { PerformanceComparison } from "@/components/performance-comparison"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function PortfolioPage() {
  const [allocationFilter, setAllocationFilter] = useState<string | null>(null)

  return (
    <>
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">Portfolio</h1>

        <PortfolioKPIs />
        <PerformanceComparison />
        <AllocationGrid onFilterChange={setAllocationFilter} />
        <HoldingsTable allocationFilter={allocationFilter} />
      </div>

      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-lg md:hidden z-50 h-14 w-14 p-0"
        aria-label="Add holding"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </>
  )
}
