"use client"

import { useState } from "react"
import { Portfolio } from "@/components/portfolio"
import { AIChatSidebar } from "@/components/ai-chat-sidebar"
import { CashFlow } from "@/components/cash-flow"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import { KPICards } from "@/components/kpi-cards"
import { AllocationChart } from "@/components/allocation-chart"
import { PerformanceTimeline } from "@/components/performance-timeline"
import { RecentActivity } from "@/components/recent-activity"
import { AIInsights } from "@/components/ai-insights"

export default function TradingDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
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
