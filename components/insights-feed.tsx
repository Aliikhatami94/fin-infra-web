"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { InsightCard } from "@/components/insights/InsightCard"
import { Button } from "@/components/ui/button"
import { getInsights } from "@/lib/insights/service"
import { useInsightReadState } from "@/hooks/use-insight-read-state"
import { useFeatureFlag } from "@/lib/analytics/experiments"
import { useInsightResolutionState } from "@/hooks/use-insight-resolution-state"
import { ChevronDown, Calendar } from "lucide-react"

type InsightFilter = "all" | "spending" | "investment" | "goals"

interface InsightsFeedProps {
  filter: InsightFilter
  searchQuery?: string
  timeRange?: string
  hideResolved?: boolean
}

const INSIGHTS_PER_PAGE = 9 // 3 columns x 3 rows

// Helper function to group insights by relative date
function getRelativeDate(updatedAt?: string): string {
  if (!updatedAt) return "Older"
  
  const today = new Date()
  const updated = new Date(updatedAt)
  const diffTime = today.getTime() - updated.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays <= 7) return "This Week"
  if (diffDays <= 30) return "This Month"
  return "Older"
}

export function InsightsFeed({
  filter,
  searchQuery = "",
  timeRange: _timeRange = "30d",
  hideResolved = false,
}: InsightsFeedProps) {
  const [displayCount, setDisplayCount] = useState(INSIGHTS_PER_PAGE)
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

  // Group insights by date
  const groupedInsights = useMemo(() => {
    const groups: Record<string, typeof visibleInsights> = {}
    
    visibleInsights.forEach((insight) => {
      const dateGroup = getRelativeDate(insight.updatedAt)
      if (!groups[dateGroup]) {
        groups[dateGroup] = []
      }
      groups[dateGroup].push(insight)
    })
    
    // Sort groups in order: Today, Yesterday, This Week, This Month, Older
    const order = ["Today", "Yesterday", "This Week", "This Month", "Older"]
    const sortedGroups: { label: string; insights: typeof visibleInsights }[] = []
    
    order.forEach(label => {
      if (groups[label] && groups[label].length > 0) {
        sortedGroups.push({ label, insights: groups[label] })
      }
    })
    
    return sortedGroups
  }, [visibleInsights])

  // Calculate which insights to display
  const displayedInsights = useMemo(() => {
    return visibleInsights.slice(0, displayCount)
  }, [visibleInsights, displayCount])

  // Get grouped version of displayed insights
  const displayedGroupedInsights = useMemo(() => {
    const groups: Record<string, typeof visibleInsights> = {}
    let count = 0
    
    for (const insight of visibleInsights) {
      if (count >= displayCount) break
      
      const dateGroup = getRelativeDate(insight.updatedAt)
      if (!groups[dateGroup]) {
        groups[dateGroup] = []
      }
      groups[dateGroup].push(insight)
      count++
    }
    
    // Sort groups in order
    const order = ["Today", "Yesterday", "This Week", "This Month", "Older"]
    const sortedGroups: { label: string; insights: typeof visibleInsights }[] = []
    
    order.forEach(label => {
      if (groups[label] && groups[label].length > 0) {
        sortedGroups.push({ label, insights: groups[label] })
      }
    })
    
    return sortedGroups
  }, [visibleInsights, displayCount])

  const hasMore = displayCount < visibleInsights.length
  const remainingCount = visibleInsights.length - displayCount

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + INSIGHTS_PER_PAGE, visibleInsights.length))
  }

  // Reset display count when filter or search changes
  useMemo(() => {
    setDisplayCount(INSIGHTS_PER_PAGE)
  }, [filter, searchQuery, hideResolved])

  if (visibleInsights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No insights found</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {hideResolved 
            ? "All insights have been resolved. Uncheck 'Hide resolved insights' to see them again."
            : searchQuery 
              ? `No insights match "${searchQuery}". Try a different search term.`
              : "Check back soon for personalized financial insights and recommendations."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {displayedGroupedInsights.map((group, groupIndex) => (
        <motion.div
          key={group.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
        >
          {/* Date Group Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {group.label}
            </div>
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">
              {group.insights.length} {group.insights.length === 1 ? "insight" : "insights"}
            </span>
          </div>

          {/* Insights Grid for this Date Group */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 md:gap-8">
            {group.insights.map((insight, index) => {
              // Calculate global index for stagger animation
              const globalIndex = displayedInsights.findIndex(i => i.id === insight.id)
              
              return (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  index={globalIndex}
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
              )
            })}
          </div>
        </motion.div>
      ))}

      {/* Load More Button */}
      <AnimatePresence>
        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-4 pt-4"
          >
            <div className="flex items-center gap-4 w-full max-w-md">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">
                Showing {displayCount} of {visibleInsights.length}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              className="gap-2 min-w-[200px]"
            >
              Load {Math.min(remainingCount, INSIGHTS_PER_PAGE)} more insight{Math.min(remainingCount, INSIGHTS_PER_PAGE) !== 1 ? 's' : ''}
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            <p className="text-xs text-muted-foreground">
              {remainingCount} insight{remainingCount !== 1 ? 's' : ''} remaining
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
