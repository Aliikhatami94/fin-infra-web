"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { InsightCard } from "@/components/insights/InsightCard"
import { trackInsightAction } from "@/lib/analytics/events"
import type { InsightAction, InsightDefinition } from "@/lib/insights/definitions"
import { Lightbulb, ShieldAlert, Inbox } from "lucide-react"
import { useInsightDismissals } from "@/hooks/use-insight-dismissals"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/confirm-dialog"

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
      { id: "enable-boosts", label: "Enable boosts" },
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
      { id: "review-charge", label: "Review ride" },
    ],
    explanation: "We noticed two identical charges within 5 minutes for the same merchant and amount.",
  },
]

export function TransactionsInsights() {
  const router = useRouter()
  const { dismiss, undismiss, reset, isDismissed, resolvedIds, hydrated } = useInsightDismissals({ surface: "transactions" })
  const [confirmAction, setConfirmAction] = useState<{ insight: InsightDefinition; action: InsightAction } | null>(null)
  
  const handleAction = (payload: { insight: InsightDefinition; action: InsightAction }) => {
    // High-impact actions require confirmation
    if (payload.insight.id === "transactions-cashback" || payload.insight.id === "transactions-duplicate") {
      setConfirmAction(payload)
    } else {
      trackInsightAction(payload)
    }
  }

  const handleConfirm = () => {
    if (confirmAction) {
      trackInsightAction(confirmAction)
      
      // Navigate after confirmation based on action
      if (confirmAction.insight.id === "transactions-cashback") {
        router.push("/settings")
      } else if (confirmAction.insight.id === "transactions-duplicate") {
        router.push("/transactions")
      }
      
      setConfirmAction(null)
    }
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
            resolved={resolvedIds.includes(insight.id)}
            onResolutionChange={({ resolved }) => {
              if (resolved) {
                dismiss(insight.id)
              } else {
                undismiss(insight.id)
              }
            }}
          />
        ))}
      </div>
      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={confirmAction?.action.label || "Confirm action"}
        description={
          confirmAction?.insight.id === "transactions-cashback"
            ? "This will enable category boosts on your Sapphire Reserve card. You can disable this later in settings."
            : confirmAction?.insight.id === "transactions-duplicate"
              ? "This will mark the transaction for review and open the dispute process."
              : "Are you sure you want to proceed with this action?"
        }
        confirmLabel="Continue"
        onConfirm={handleConfirm}
      />
    </div>
  )
}
