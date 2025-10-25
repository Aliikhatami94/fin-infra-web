"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getInsights } from "@/lib/insights/service"
import type { InsightDefinition } from "@/lib/insights/definitions"
import { InsightCard } from "@/components/insights/InsightCard"
import { useInsightPins } from "@/hooks/use-insight-pins"

const priorityWeight: Record<"low" | "medium" | "high", number> = {
  low: 0,
  medium: 1,
  high: 2,
}

const sortByPriority = (a: InsightDefinition, b: InsightDefinition) => {
  const aPriority = a.priority ? priorityWeight[a.priority] : 1
  const bPriority = b.priority ? priorityWeight[b.priority] : 1

  if (aPriority !== bPriority) {
    return bPriority - aPriority
  }

  return a.title.localeCompare(b.title)
}

export function AIInsights() {
  const { pinnedIds, setPinned } = useInsightPins()
  const baseInsights = useMemo(() => getInsights({ surface: "overview", limit: 8 }), [])

  const normalizedInsights = useMemo(
    () =>
      baseInsights
        .map((insight) => ({
          ...insight,
          pinned: pinnedIds.has(insight.id),
        }))
        .sort(sortByPriority),
    [baseInsights, pinnedIds],
  )

  const pinnedInsights = normalizedInsights.filter((insight) => insight.pinned)
  const otherInsights = normalizedInsights.filter((insight) => !insight.pinned).slice(0, 4)
  const insightsToRender = pinnedInsights.length > 0 ? otherInsights : normalizedInsights.slice(0, 4)

  return (
    <div className="relative space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">AI Insights</h2>
        <Link href="/insights" className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80">
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {pinnedInsights.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Pinned insights</h3>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-thin">
            {pinnedInsights.map((insight, index) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                index={index}
                className="min-w-[280px] md:min-w-[340px] snap-start"
                onPinChange={({ insight: changedInsight, pinned }) => setPinned(changedInsight.id, pinned)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          {pinnedInsights.length > 0 ? "Latest insights" : "Recommended insights"}
        </h3>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {insightsToRender.map((insight, index) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              index={index}
              className="min-w-[280px] md:min-w-[340px] snap-start"
              onPinChange={({ insight: changedInsight, pinned }) => setPinned(changedInsight.id, pinned)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
