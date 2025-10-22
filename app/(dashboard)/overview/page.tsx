"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Portfolio } from "@/components/portfolio"
import { AIChatSidebar } from "@/components/ai-chat-sidebar"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import { KPICards } from "@/components/kpi-cards"
import { RecentActivity } from "@/components/recent-activity"
import { AIInsights } from "@/components/ai-insights"
import { ChartCardSkeleton } from "@/components/chart-skeleton"
import type { AllocationChartProps } from "@/components/allocation-chart"

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

export default function OverviewPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [allocationFilter, setAllocationFilter] = useState<string | null>(null)

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Overview</h2>
        <KPICards />
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
        <AIInsights />
      </section>

      <Button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>

      <AIChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}
