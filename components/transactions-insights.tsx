"use client"

import { Fragment } from "react"
import { InsightCard } from "@/components/insights/InsightCard"
import { trackInsightAction } from "@/lib/analytics/events"
import type { InsightAction, InsightDefinition } from "@/lib/insights/definitions"
import { Lightbulb, ShieldAlert } from "lucide-react"

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
  const handleAction = (payload: { insight: InsightDefinition; action: InsightAction }) => {
    trackInsightAction(payload)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {insights.map((insight) => (
        <Fragment key={insight.id}>
          <InsightCard insight={insight} onAction={handleAction} />
        </Fragment>
      ))}
    </div>
  )
}
