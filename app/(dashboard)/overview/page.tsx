"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
// Heavy widgets are dynamically loaded client-side with skeletons
import { Button } from "@/components/ui/button"
import { KPICards } from "@/components/kpi-cards"
import { ChartCardSkeleton } from "@/components/chart-skeleton"
import type { AllocationChartProps } from "@/components/allocation-chart"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  AIInsightsListSkeleton,
  PortfolioSkeleton,
  RecentActivitySkeleton,
} from "@/components/dashboard-skeletons"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useOnboardingState } from "@/hooks/use-onboarding-state"
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
  const { state: onboardingState, hydrated } = useOnboardingState()

  if (hydrated && onboardingState.status !== "completed") {
    const skipped = onboardingState.status === "skipped"
    return (
      <div className="mx-auto w-full max-w-[800px] space-y-6">
        <Card className="card-standard">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-foreground">Welcome back</CardTitle>
            <CardDescription>
              {skipped
                ? "Your dashboard is waiting for a few details before we can populate live insights."
                : "Finish onboarding to unlock your personalized Money Graph and live KPIs."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Guided actions</p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>Link at least one financial institution.</li>
                <li>Answer three quick persona questions to tailor KPIs.</li>
                <li>Review the Money Graph preview to confirm automations.</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Progress is saved securely. You can resume onboarding anytime.
            </p>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/insights">Browse insights</Link>
              </Button>
              <Button asChild>
                <Link href="/onboarding">{skipped ? "Resume setup" : "Continue onboarding"}</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="bg-card/90 backdrop-blur-md border-b border-border/20">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-4">
          <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10 py-6 space-y-6">
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
      </div>
    </>
  )
}
