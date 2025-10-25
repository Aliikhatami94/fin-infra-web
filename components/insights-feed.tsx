"use client"

import { useMemo } from "react"

import { InsightCard } from "@/components/insights/InsightCard"
import { getInsights } from "@/lib/insights/service"
import { useInsightReadState } from "@/hooks/use-insight-read-state"
import { useFeatureFlag } from "@/lib/analytics/experiments"
import { useInsightResolutionState } from "@/hooks/use-insight-resolution-state"

type InsightFilter = "all" | "spending" | "investment" | "goals"

interface InsightsFeedProps {
  filter: InsightFilter
  searchQuery?: string
  timeRange?: string
  hideResolved?: boolean
}

export function InsightsFeed({
  filter,
  searchQuery = "",
  timeRange: _timeRange = "30d",
  hideResolved = false,
}: InsightsFeedProps) {
  const { hydrated, isUnread, markRead } = useInsightReadState()
  const { enabled: unreadHighlightEnabled } = useFeatureFlag("insightUnreadHighlight", { defaultEnabled: false })
  const { resolvedIds, setResolved, hydrated: resolutionHydrated } = useInsightResolutionState()
  const insights = useMemo(() => {
    const category = filter === "all" ? undefined : filter
    return getInsights({ surface: "insights", category, search: searchQuery.trim() || undefined })
  }, [filter, searchQuery])
  const visibleInsights = useMemo(() => {
    if (!hideResolved || !resolutionHydrated) {
      return insights
    }

    return insights.filter((insight) => !resolvedIds.has(insight.id))
  }, [hideResolved, insights, resolvedIds, resolutionHydrated])

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 md:gap-8">
      {visibleInsights.map((insight, index) => (
        <InsightCard
          key={insight.id}
          insight={insight}
          index={index}
          unread={unreadHighlightEnabled && hydrated ? isUnread(insight.id) : false}
          resolved={resolvedIds.has(insight.id)}
          onResolutionChange={({ insight: target, resolved }) => {
            setResolved(target.id, resolved)
          }}
          onMarkRead={
            unreadHighlightEnabled
              ? () => {
                  markRead(insight.id)
                }
              : undefined
          }
        />
      ))}
    </div>
  )
}
