"use client"

import { useMemo } from "react"
import { InsightCard } from "@/components/insights/InsightCard"
import { trackInsightAction } from "@/lib/analytics/events"
import type { InsightAction, InsightDefinition } from "@/lib/insights/definitions"
import { Lightbulb, ShieldAlert, Inbox } from "lucide-react"
import { useInsightDismissals } from "@/hooks/use-insight-dismissals"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const insights: InsightDefinition[] = [
  {
    id: "transactions-cashback",
    title: "Cashback opportunity",
    body: "You spent $1,120 on the Sapphire Reserve in the last 30 days. Enable category boosts to earn an extra $28 in cashback.",
    category: "spending",
    topic: "Rewards",
    surfaces: ["overview", "insights"],
    icon: Lightbulb,
    accent: "emerald",
    metrics: [
      { id: "eligible-spend", label: "Eligible spend", value: "$1,120", highlight: true },
      { id: "lost-rewards", label: "Lost rewards", value: "$28" },
    ],
    actions: [
      { id: "enable-boosts", label: "Enable boosts", href: "/settings" },
    ],
    explanation: "Dining and travel categories qualify for 3% cashback when boosts are active.",
  },
  {
    id: "transactions-duplicate",
    title: "Possible duplicate charge",
    body: "Lyft charged you twice on Jan 13 for $24.50. Review the ride history and dispute the duplicate.",
    category: "spending",
    topic: "Monitoring",
    surfaces: ["insights"],
    icon: ShieldAlert,
    accent: "orange",
    actions: [
      { id: "review-charge", label: "Review ride", href: "/transactions" },
    ],
    explanation: "We noticed two identical charges within 5 minutes for the same merchant and amount.",
  },
]

export function TransactionsInsights() {
  const { dismiss, reset, isDismissed, resolvedIds, hydrated } = useInsightDismissals({ surface: "transactions" })
  const handleAction = (payload: { insight: InsightDefinition; action: InsightAction }) => {
    trackInsightAction(payload)
  }

  const visibleInsights = useMemo(() => insights.filter((insight) => !isDismissed(insight.id)), [isDismissed])
  const hasDismissedInsights = resolvedIds.length > 0

  if (!hydrated) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_value, index) => (
          <div key={index} className="h-[240px] rounded-2xl bg-muted/60 animate-pulse" />
        ))}
      </div>
    )
  }

  if (visibleInsights.length === 0) {
    return (
      <Card className="card-standard">
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <Inbox className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-foreground">All transaction insights resolved</h2>
            <p className="text-sm text-muted-foreground">
              You&apos;re caught up for now. Restore insights to review recommendations again.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={reset}>
            Show dismissed insights
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">High-impact suggestions based on recent transactions.</p>
        {hasDismissedInsights ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="h-8 px-2 text-xs"
            aria-label="Show dismissed insights"
          >
            Show dismissed ({resolvedIds.length})
          </Button>
        ) : null}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {visibleInsights.map((insight, index) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            index={index}
            onAction={handleAction}
            onResolve={() => dismiss(insight.id)}
          />
        ))}
      </div>
    </div>
  )
}
