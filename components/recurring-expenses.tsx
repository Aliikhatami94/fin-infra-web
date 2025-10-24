"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tv, Music, ShoppingBag, Palette, Dumbbell, Pause, X, PiggyBank } from "lucide-react"
import { InsightCard } from "@/components/insights/InsightCard"
import { trackInsightAction } from "@/lib/analytics/events"
import type { InsightAction, InsightDefinition } from "@/lib/insights/definitions"

const subscriptions = [
  {
    name: "Netflix",
    amount: 15.99,
    nextBilling: "Jan 15",
    category: "Entertainment",
    status: "active",
    icon: Tv,
  },
  { name: "Spotify", amount: 9.99, nextBilling: "Jan 18", category: "Entertainment", status: "active", icon: Music },
  {
    name: "Amazon Prime",
    amount: 14.99,
    nextBilling: "Today",
    category: "Shopping",
    status: "due",
    icon: ShoppingBag,
  },
  {
    name: "Adobe Creative Cloud",
    amount: 54.99,
    nextBilling: "Jan 25",
    category: "Software",
    status: "active",
    icon: Palette,
  },
  {
    name: "Gym Membership",
    amount: 49.99,
    nextBilling: "Feb 1",
    category: "Health",
    status: "active",
    icon: Dumbbell,
  },
]

interface RecurringExpensesProps {
  selectedCategory?: string | null
}

export function RecurringExpenses({ selectedCategory }: RecurringExpensesProps) {
  const filteredSubscriptions = selectedCategory
    ? subscriptions.filter((sub) => sub.category === selectedCategory)
    : subscriptions

  const totalMonthly = filteredSubscriptions.reduce((sum, sub) => sum + sub.amount, 0)

  const insight: InsightDefinition = {
    id: "recurring-savings",
    title: "Optimize recurring spend",
    body: "Pausing two streaming subscriptions would save $30/month and keep you on track for the vacation fund.",
    category: "spending",
    topic: "Cash Flow",
    surfaces: ["cash-flow"],
    icon: PiggyBank,
    accent: "emerald",
    metrics: [
      { id: "potential", label: "Potential savings", value: "$30/mo", highlight: true },
      { id: "current", label: "Current recurring", value: `$${totalMonthly.toFixed(2)}/mo` },
    ],
    actions: [
      { id: "pause-subscriptions", label: "Review subscriptions" },
    ],
  }

  const handleInsightAction = (payload: { insight: InsightDefinition; action: InsightAction }) => {
    trackInsightAction(payload)
  }

  return (
    <Card className="card-standard">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recurring Expenses</CardTitle>
          <Badge variant="secondary" className="text-sm font-bold px-3 py-1">
            ${totalMonthly.toFixed(2)}/mo
          </Badge>
        </div>
        {selectedCategory && <p className="text-xs text-muted-foreground">Filtered by: {selectedCategory}</p>}
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <InsightCard insight={insight} onAction={handleInsightAction} />
        </div>
        <div className="space-y-2">
          {filteredSubscriptions.map((sub, index) => {
            const Icon = sub.icon
            return (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  sub.status === "due" ? "bg-orange-500/10 border-orange-500/40" : "border-border hover:bg-muted/30"
                }`}
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0 ml-3">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground truncate">{sub.name}</p>
                    {sub.status === "due" && (
                      <Badge className="text-xs px-1.5 py-0 bg-orange-500 hover:bg-orange-600">Due Today</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                      {sub.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Next: {sub.nextBilling}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-2">
                  <p className="text-sm font-semibold tabular-nums text-foreground">${sub.amount.toFixed(2)}</p>
                  <div className="flex items-center gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-yellow-500/10"
                      title="Pause subscription"
                      aria-label={`Pause ${sub.name}`}
                    >
                      <Pause className="h-3.5 w-3.5 text-yellow-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-red-500/10"
                      title="Cancel subscription"
                      aria-label={`Cancel ${sub.name}`}
                    >
                      <X className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
