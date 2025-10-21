"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle, Lightbulb, Target, DollarSign, PieChart } from "lucide-react"

const allInsights = [
  {
    id: 1,
    type: "spending",
    icon: DollarSign,
    title: "Dining expenses increased",
    description: "You spent 18% more on dining this month compared to your average. Consider reviewing your budget.",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/10",
    category: "Spending Trends",
  },
  {
    id: 2,
    type: "investment",
    icon: PieChart,
    title: "Portfolio rebalancing suggested",
    description: "Your US Tech allocation has grown to 48%. Consider rebalancing to maintain diversification.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    category: "Investment Health",
  },
  {
    id: 3,
    type: "goals",
    icon: Target,
    title: "Emergency fund milestone reached",
    description: "Congratulations! You've reached 60% of your emergency fund goal, ahead of schedule by 2 months.",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500/10",
    category: "Goals Forecast",
  },
  {
    id: 4,
    type: "spending",
    icon: TrendingUp,
    title: "Subscription savings opportunity",
    description: "You have 3 unused subscriptions totaling $45/month. Cancel them to save $540 annually.",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    category: "Spending Trends",
  },
  {
    id: 5,
    type: "investment",
    icon: AlertTriangle,
    title: "High volatility detected",
    description: "Your portfolio volatility is in the 78th percentile. Consider adding more stable assets.",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500/10",
    category: "Investment Health",
  },
  {
    id: 6,
    type: "goals",
    icon: Lightbulb,
    title: "Increase savings rate",
    description:
      "By increasing your monthly savings by $200, you could reach your house down payment goal 8 months earlier.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    category: "Goals Forecast",
  },
]

interface InsightsFeedProps {
  filter: "all" | "spending" | "investment" | "goals"
}

export function InsightsFeed({ filter }: InsightsFeedProps) {
  const filteredInsights = filter === "all" ? allInsights : allInsights.filter((insight) => insight.type === filter)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {filteredInsights.map((insight) => (
        <Card key={insight.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${insight.bgColor}`}>
                <insight.icon className={`h-6 w-6 ${insight.color}`} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{insight.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {insight.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
