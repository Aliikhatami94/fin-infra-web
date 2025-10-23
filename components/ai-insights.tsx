"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getInsights } from "@/lib/insights/service"
import { InsightCard } from "@/components/insights/InsightCard"

export function AIInsights() {
  const pinnedInsights = getInsights({ surface: "overview", pinnedOnly: true })
  const insights = pinnedInsights.length > 0 ? pinnedInsights : getInsights({ surface: "overview", limit: 4 })

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">AI Insights</h2>
        <Link href="/insights" className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80">
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {insights.map((insight, index) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            index={index}
            className="min-w-[280px] md:min-w-[340px] snap-start"
          />
        ))}
      </div>
    </div>
  )
}
