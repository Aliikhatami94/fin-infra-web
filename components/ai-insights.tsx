"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, AlertTriangle, Lightbulb, Target } from "lucide-react"

const insights = [
  {
    id: 1,
    type: "savings",
    icon: TrendingUp,
    title: "Great savings progress",
    description: "You saved $420 this month by canceling unused subscriptions.",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    id: 2,
    type: "diversification",
    icon: AlertTriangle,
    title: "Diversification opportunity",
    description: "US Tech represents 48% of your portfolio. Consider diversifying into other sectors.",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/10",
  },
  {
    id: 3,
    type: "tip",
    icon: Lightbulb,
    title: "Tax optimization",
    description: "You can offset $3,000 in capital losses this year to reduce your tax liability.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 4,
    type: "goal",
    icon: Target,
    title: "Goal on track",
    description: "Your emergency fund goal is 65% complete. You're ahead of schedule by 2 months.",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
  },
]

export function AIInsights() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {insights.map((insight) => (
        <Card key={insight.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${insight.bgColor}`}>
                <insight.icon className={`h-5 w-5 ${insight.color}`} />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-sm font-semibold text-foreground">{insight.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
