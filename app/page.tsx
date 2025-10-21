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
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { RecentActivity } from "@/components/recent-activity"
import { AIInsights } from "@/components/ai-insights"

export default function TradingDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />

  <main id="main-content" className="ml-64 mt-16 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          {/* Hero Row - KPI Cards */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Overview</h2>
            <KPICards />
          </section>

          {/* Portfolio Health Row */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Portfolio Health</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <AllocationChart />
              <PerformanceTimeline />
            </div>
          </section>

          {/* Cash & Liabilities Row */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Cash & Liabilities</h2>
            <CashFlow />
          </section>

          {/* Holdings Row */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Holdings</h2>
            <Portfolio />
          </section>

          {/* Recent Activity */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Activity</h2>
            <RecentActivity />
          </section>

          {/* AI Insights */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Insights</h2>
            <AIInsights />
          </section>
        </div>
      </main>

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
