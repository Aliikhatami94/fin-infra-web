"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
// Heavy widgets are dynamically loaded with skeletons
// Removed floating add button per design update
import { ChartCardSkeleton } from "@/components/chart-skeleton"
import {
  AllocationGridSkeleton,
  HoldingsTableSkeleton,
  PortfolioAIInsightsSkeleton,
  PortfolioKPIsSkeleton,
  RebalancingPreviewSkeleton,
} from "@/components/dashboard-skeletons"
import type { AllocationGridProps } from "@/components/allocation-grid"
import type { HoldingsTableProps } from "@/components/holdings-table"
import { ErrorBoundary } from "@/components/error-boundary"
import { ScenarioPlaybook } from "@/components/scenario-playbook"

const PerformanceComparison = dynamic(
  () => import("@/components/performance-comparison").then((mod) => mod.PerformanceComparison),
  {
    ssr: false,
    loading: () => <ChartCardSkeleton title="Performance vs SPY" contentHeight="h-[400px]" />,
  },
)

const PortfolioKPIs = dynamic(
  () => import("@/components/portfolio-kpis").then((mod) => mod.PortfolioKPIs),
  {
    ssr: false,
    loading: () => <PortfolioKPIsSkeleton />,
  },
)

const PortfolioAIInsights = dynamic(
  () => import("@/components/portfolio-ai-insights").then((mod) => mod.PortfolioAIInsights),
  {
    ssr: false,
    loading: () => <PortfolioAIInsightsSkeleton />,
  },
)

const RebalancingPreview = dynamic(
  () => import("@/components/rebalancing-preview").then((mod) => mod.RebalancingPreview),
  {
    ssr: false,
    loading: () => <RebalancingPreviewSkeleton />,
  },
)

const AllocationGrid = dynamic<AllocationGridProps>(
  () => import("@/components/allocation-grid").then((mod) => mod.AllocationGrid),
  {
    ssr: false,
    loading: () => <AllocationGridSkeleton />,
  },
)

const HoldingsTable = dynamic<HoldingsTableProps>(
  () => import("@/components/holdings-table").then((mod) => mod.HoldingsTable),
  {
    ssr: false,
    loading: () => <HoldingsTableSkeleton />,
  },
)

export default function PortfolioPage() {
  const [allocationFilter, setAllocationFilter] = useState<string | null>(null)

  return (
    <>
      {/* Sticky compact Header */}
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-3">
          <h1 className="text-2xl font-semibold text-foreground">Portfolio</h1>
        </div>
      </div>

      {/* Body */}
  <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10 py-6 space-y-6">
        <PortfolioKPIs />

        <ErrorBoundary feature="Portfolio insights">
          <PortfolioAIInsights />
        </ErrorBoundary>

        <ScenarioPlaybook surface="portfolio" />

        <RebalancingPreview />

        <PerformanceComparison />
        <AllocationGrid onFilterChange={setAllocationFilter} />
        <HoldingsTable allocationFilter={allocationFilter} />
      </div>

      {/* Floating add button removed */}
    </>
  )
}
