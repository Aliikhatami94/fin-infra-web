"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
// Heavy widgets are dynamically loaded client-side with skeletons
import { KPICards } from "@/components/kpi-cards"
import { ChartCardSkeleton } from "@/components/chart-skeleton"
import type { AllocationChartProps } from "@/components/allocation-chart"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  AIInsightsListSkeleton,
  PortfolioSkeleton,
  RecentActivitySkeleton,
} from "@/components/dashboard-skeletons"
import { AccountabilityChecklist } from "@/components/accountability-checklist"

const AllocationChart = dynamic<AllocationChartProps>(
  () => import("@/components/allocation-chart").then((mod) => mod.AllocationChart),
  {
    ssr: false,
    loading: () => <ChartCardSkeleton title="Portfolio Allocation" />,
  },
)

const PerformanceTimeline = dynamic(
  () => import("@/components/performance-timeline").then((mod) => mod.PerformanceTimeline),
  {
    ssr: false,
    loading: () => <ChartCardSkeleton title="Performance Timeline" />,
  },
)

const CashFlow = dynamic(
  () => import("@/components/cash-flow").then((mod) => mod.CashFlow),
  {
    ssr: false,
    loading: () => (
      <ChartCardSkeleton
        title="Cash Flow"
        description="Income vs expenses with net cash flow trend"
        contentHeight="h-72"
      />
    ),
  },
)

const Portfolio = dynamic(
  () => import("@/components/portfolio").then((mod) => mod.Portfolio),
  {
    ssr: false,
    loading: () => <PortfolioSkeleton />,
  },
)

const RecentActivity = dynamic(
  () => import("@/components/recent-activity").then((mod) => mod.RecentActivity),
  {
    ssr: false,
    loading: () => <RecentActivitySkeleton />,
  },
)

const AIInsights = dynamic(
  () => import("@/components/ai-insights").then((mod) => mod.AIInsights),
  {
    ssr: false,
    loading: () => <AIInsightsListSkeleton />,
  },
)

// AI chat is now global in the dashboard layout

export default function OverviewPage() {
  const [allocationFilter, setAllocationFilter] = useState<string | null>(null)

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-3">
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">Overview</h1>
        </div>
      </div>

      {/* Body */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10 py-6 space-y-6"
      >
        <section>
          <KPICards />
        </section>

      <section>
        <AccountabilityChecklist surface="overview" />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Portfolio Health</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <AllocationChart onFilterChange={setAllocationFilter} activeFilter={allocationFilter} />
          <PerformanceTimeline />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Cash & Liabilities</h2>
        <CashFlow />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Holdings</h2>
        {allocationFilter && (
          <p className="text-sm text-muted-foreground mb-3">
            Showing holdings for: <span className="font-medium text-foreground">{allocationFilter}</span>
          </p>
        )}
        <Portfolio filter={allocationFilter} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Activity</h2>
        <RecentActivity />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Insights</h2>
        <ErrorBoundary feature="AI Insights">
          <AIInsights />
        </ErrorBoundary>
      </section>
      </motion.div>
    </>
  )
}
