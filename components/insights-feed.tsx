"use client"

import { useMemo } from "react"

import { InsightCard } from "@/components/insights/InsightCard"
import { getInsights } from "@/lib/insights/service"
import { useInsightReadState } from "@/hooks/use-insight-read-state"
import { useFeatureFlag } from "@/lib/analytics/experiments"

type InsightFilter = "all" | "spending" | "investment" | "goals"

interface InsightsFeedProps {
  filter: InsightFilter
  searchQuery?: string
  timeRange?: string
}

export function InsightsFeed({ filter, searchQuery = "", timeRange: _timeRange = "30d" }: InsightsFeedProps) {
  const { hydrated, isUnread, markRead } = useInsightReadState()
  const { enabled: unreadHighlightEnabled } = useFeatureFlag("insightUnreadHighlight", { defaultEnabled: false })
  const insights = useMemo(() => {
    const category = filter === "all" ? undefined : filter
    return getInsights({ surface: "insights", category, search: searchQuery.trim() || undefined })
  }, [filter, searchQuery])

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 md:gap-8">
      {insights.map((insight, index) => (
        <InsightCard
          key={insight.id}
          insight={insight}
          index={index}
          unread={unreadHighlightEnabled && hydrated ? isUnread(insight.id) : false}
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
