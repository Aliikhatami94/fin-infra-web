"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, PiggyBank, Sparkles } from "lucide-react"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { InsightCard } from "@/components/insights/InsightCard"
import { getInsights } from "@/lib/insights/service"
import { useInsightPins } from "@/hooks/use-insight-pins"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const overspendingSuggestions = [
  {
    id: "dining-out",
    category: "Dining Out",
    variance: "+$85 vs plan",
    summary: "Limit delivery apps to once a week and move $60 from Entertainment.",
    actionLabel: "Tune dining budget",
  },
  {
    id: "transportation",
    category: "Transportation",
    variance: "+$45 vs plan",
    summary: "Activate transit pass auto-reload and shift $30 from Utilities surplus.",
    actionLabel: "Adjust commute spend",
  },
  {
    id: "wellness",
    category: "Wellness",
    variance: "+$38 vs plan",
    summary: "Schedule pause on unused studio visits and redirect $25 toward savings.",
    actionLabel: "Pause memberships",
  },
]

const priorityWeight: Record<"low" | "medium" | "high", number> = {
  low: 0,
  medium: 1,
  high: 2,
}

const loadingMessageId = "cashflow-insights-loading"

export function CashFlowAIInsights() {
  const { hydrated, pinnedIds, setPinned } = useInsightPins()

  const insights = useMemo(() => {
    const baseInsights = getInsights({ surface: "cash-flow" })
    const normalized = baseInsights.map((insight) => ({
      ...insight,
      pinned: pinnedIds.has(insight.id),
    }))

    return normalized.sort((a, b) => {
      const aPinned = a.pinned ? 1 : 0
      const bPinned = b.pinned ? 1 : 0
      if (aPinned !== bPinned) {
        return bPinned - aPinned
      }

  const aPriority = a.priority ? priorityWeight[a.priority] : 1
  const bPriority = b.priority ? priorityWeight[b.priority] : 1
      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }

      return a.title.localeCompare(b.title)
    })
  }, [pinnedIds])

  const isLoadingPins = !hydrated

  return (
    <motion.section
      {...createStaggeredCardVariants(0, 0.2)}
      aria-labelledby="cashflow-insights-heading"
      className="space-y-5"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
          <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
        </div>
        <h3 id="cashflow-insights-heading" className="text-sm font-semibold text-foreground">
          AI Cash Flow Insights
        </h3>
      </div>
      {!hydrated && (
        <p id={loadingMessageId} className="sr-only" role="status" aria-live="polite">
          Loading your saved cash flow insight pins.
        </p>
      )}
      <div
        role="list"
        aria-busy={isLoadingPins}
        aria-describedby={isLoadingPins ? loadingMessageId : undefined}
        className="grid gap-4"
      >
        {insights.map((insight, index) => (
          <div key={insight.id} role="listitem">
            <InsightCard
              insight={insight}
              index={index}
              onPinChange={({ insight: changedInsight, pinned }) => setPinned(changedInsight.id, pinned)}
            />
          </div>
        ))}
      </div>
      <Card className="card-standard border-dashed border-border/70">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <PiggyBank className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Overspending Budget Suggestions</CardTitle>
              <CardDescription>
                Target overspending categories with quick adjustments that protect savings momentum.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {overspendingSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="card-standard card-lift gap-4 focus-within:ring-2 focus-within:ring-primary/40">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{suggestion.category}</p>
                  <p className="text-xs text-muted-foreground">{suggestion.summary}</p>
                </div>
                <Badge variant="secondary" className="whitespace-nowrap text-[11px]">
                  {suggestion.variance}
                </Badge>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full justify-center gap-1"
                aria-label={`${suggestion.actionLabel} for ${suggestion.category}`}
              >
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                {suggestion.actionLabel}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.section>
  )
}
