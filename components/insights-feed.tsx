"use client"

import { useMemo } from "react"

import { InsightCard } from "@/components/insights/InsightCard"
import { getInsights } from "@/lib/insights/service"

type InsightFilter = "all" | "spending" | "investment" | "goals"

interface InsightsFeedProps {
  filter: InsightFilter
  searchQuery?: string
  timeRange?: string
}

export function InsightsFeed({ filter, searchQuery = "", timeRange: _timeRange = "30d" }: InsightsFeedProps) {
  const insights = useMemo(() => {
    const category = filter === "all" ? undefined : filter
    return getInsights({ surface: "insights", category, search: searchQuery.trim() || undefined })
  }, [filter, searchQuery])

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 md:gap-8">
      {insights.map((insight, index) => (
        <InsightCard key={insight.id} insight={insight} index={index} />
      ))}
    </div>
  )
}
