"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { PortfolioKPIs } from "@/components/portfolio-kpis"
import { AllocationGrid } from "@/components/allocation-grid"
import { HoldingsTable } from "@/components/holdings-table"
import { PortfolioAIInsights } from "@/components/portfolio-ai-insights"
import { RebalancingPreview } from "@/components/rebalancing-preview"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ChartCardSkeleton } from "@/components/chart-skeleton"

const PerformanceComparison = dynamic(
  () => import("@/components/performance-comparison").then((mod) => mod.PerformanceComparison),
  {
    ssr: false,
    loading: () => <ChartCardSkeleton title="Performance vs SPY" contentHeight="h-[400px]" />,
  },
)

export default function PortfolioPage() {
  const [allocationFilter, setAllocationFilter] = useState<string | null>(null)

  return (
    <>
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">Portfolio</h1>

        <PortfolioKPIs />

        <PortfolioAIInsights />

        <RebalancingPreview />

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
