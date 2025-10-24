"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Inbox, Sparkles } from "lucide-react"

import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { InsightCard } from "@/components/insights/InsightCard"
import { getInsights } from "@/lib/insights/service"
import type { InsightAction, InsightDefinition } from "@/lib/insights/definitions"
import { AutomationCopilotDrawer } from "@/components/automation-copilot-drawer"
import { useInsightPins } from "@/hooks/use-insight-pins"
import { useInsightDismissals } from "@/hooks/use-insight-dismissals"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const actionToSuggestion: Record<string, string> = {
  "automation:portfolio-rebalance": "rebalance-tech-overweight",
}

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

export function PortfolioAIInsights() {
  const baseInsights = useMemo(() => getInsights({ surface: "portfolio" }), [])
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [initialSuggestionId, setInitialSuggestionId] = useState<string | null>(null)
  const { pinnedIds, setPinned } = useInsightPins()
  const { dismiss, undismiss, resolvedIds, hydrated } = useInsightDismissals({ surface: "portfolio" })
  const [showResolved, setShowResolved] = useState(false)

  const normalizedInsights = useMemo(
    () =>
      baseInsights.map((insight) => ({
        ...insight,
        pinned: pinnedIds.has(insight.id),
      })),
    [baseInsights, pinnedIds],
  )

  const activeInsights = useMemo(
    () => normalizedInsights.filter((insight) => !resolvedIds.includes(insight.id)).sort(sortByPriority),
    [normalizedInsights, resolvedIds],
  )

  const resolvedInsights = useMemo(
    () => normalizedInsights.filter((insight) => resolvedIds.includes(insight.id)).sort(sortByPriority),
    [normalizedInsights, resolvedIds],
  )

  const pinnedInsights = activeInsights.filter((insight) => insight.pinned)
  const otherInsights = activeInsights.filter((insight) => !insight.pinned)

  const handleAction = ({ action }: { insight: InsightDefinition; action: InsightAction }) => {
    if (action.id.startsWith("automation:")) {
      const suggestionId = actionToSuggestion[action.id]
      if (suggestionId) {
        setInitialSuggestionId(suggestionId)
        setCopilotOpen(true)
      }
    }
  }

  const handlePinChange = ({ insight, pinned }: { insight: InsightDefinition; pinned: boolean }) => {
    setPinned(insight.id, pinned)
  }

  const handleResolutionChange = ({ insight, resolved }: { insight: InsightDefinition; resolved: boolean }) => {
    if (resolved) {
      dismiss(insight.id)
    } else {
      undismiss(insight.id)
    }
  }

  return (
    <>
      <motion.section
        {...createStaggeredCardVariants(0, 0.2)}
        aria-labelledby="portfolio-insights-heading"
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
          </div>
          <h3 id="portfolio-insights-heading" className="text-sm font-semibold text-foreground">
            AI Portfolio Insights
          </h3>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Surface high-impact actions from your current portfolio mix.
          </p>
          {resolvedIds.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => setShowResolved((previous) => !previous)}
              aria-pressed={showResolved}
            >
              {showResolved ? "Hide resolved" : `Show resolved (${resolvedIds.length})`}
            </Button>
          )}
        </div>

        {!hydrated ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_item, index) => (
              <div key={index} className="h-[220px] rounded-2xl bg-muted/60 animate-pulse" />
            ))}
          </div>
        ) : activeInsights.length === 0 ? (
          <Card className="border-dashed border-border/70 bg-muted/30">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <Inbox className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-foreground">All portfolio insights resolved</h4>
                <p className="text-sm text-muted-foreground">
                  Restore resolved insights to revisit recommendations and pinned items.
                </p>
              </div>
              {resolvedIds.length > 0 ? (
                <Button variant="ghost" size="sm" onClick={() => setShowResolved(true)}>
                  Show resolved insights
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pinnedInsights.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">Pinned insights</h4>
                </div>
                <div className="grid gap-4">
                  {pinnedInsights.map((insight, index) => (
                    <InsightCard
                      key={insight.id}
                      insight={insight}
                      index={index}
                      onAction={handleAction}
                      onPinChange={handlePinChange}
                      resolved={false}
                      onResolutionChange={handleResolutionChange}
                    />
                  ))}
                </div>
              </div>
            )}

            {otherInsights.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">More insights</h4>
                <div className="grid gap-4">
                  {otherInsights.map((insight, index) => (
                    <InsightCard
                      key={insight.id}
                      insight={insight}
                      index={pinnedInsights.length + index}
                      onAction={handleAction}
                      onPinChange={handlePinChange}
                      onResolutionChange={handleResolutionChange}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {showResolved && resolvedInsights.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Resolved insights</h4>
            <div className="grid gap-4">
              {resolvedInsights.map((insight, index) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  index={activeInsights.length + index}
                  onAction={handleAction}
                  onPinChange={handlePinChange}
                  resolved
                  onResolutionChange={handleResolutionChange}
                />
              ))}
            </div>
          </div>
        )}
      </motion.section>

      <AutomationCopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        surface="portfolio"
        initialSuggestionId={initialSuggestionId}
      />
    </>
  )
}
