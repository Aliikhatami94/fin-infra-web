"use client"

import { InsightCard } from "@/components/insight-card"
import { TrendingUp, AlertTriangle, Lightbulb, Target, DollarSign, PieChart } from "lucide-react"

const allInsights = [
  {
    id: 1,
    type: "spending",
    icon: DollarSign,
    title: "Dining expenses increased",
    description: "You spent 18% more on dining this month compared to your average. Consider reviewing your budget.",
    category: "Spending Trends",
    variant: "spending" as const,
    trend: 18,
    isPinned: false,
  },
  {
    id: 2,
    type: "investment",
    icon: PieChart,
    title: "Portfolio rebalancing suggested",
    description: "Your US Tech allocation has grown to 48%. Consider rebalancing to maintain diversification.",
    category: "Investment Health",
    variant: "investment" as const,
    trend: 48,
    isPinned: false,
  },
  {
    id: 3,
    type: "goals",
    icon: Target,
    title: "Emergency fund milestone reached",
    description: "Congratulations! You've reached 60% of your emergency fund goal, ahead of schedule by 2 months.",
    category: "Goals Forecast",
    variant: "goals" as const,
    trend: 60,
    isPinned: true,
  },
  {
    id: 4,
    type: "spending",
    icon: TrendingUp,
    title: "Subscription savings opportunity",
    description: "You have 3 unused subscriptions totaling $45/month. Cancel them to save $540 annually.",
    category: "Spending Trends",
    variant: "spending" as const,
    isPinned: false,
  },
  {
    id: 5,
    type: "investment",
    icon: AlertTriangle,
    title: "High volatility detected",
    description: "Your portfolio volatility is in the 78th percentile. Consider adding more stable assets.",
    category: "Investment Health",
    variant: "alert" as const,
    trend: 78,
    isPinned: false,
  },
  {
    id: 6,
    type: "goals",
    icon: Lightbulb,
    title: "Increase savings rate",
    description:
      "By increasing your monthly savings by $200, you could reach your house down payment goal 8 months earlier.",
    category: "Goals Forecast",
    variant: "goals" as const,
    isPinned: false,
  },
]

interface InsightsFeedProps {
  filter: "all" | "spending" | "investment" | "goals"
  searchQuery?: string
  timeRange?: string
}

export function InsightsFeed({ filter, searchQuery = "", timeRange = "30d" }: InsightsFeedProps) {
  let filteredInsights = filter === "all" ? allInsights : allInsights.filter((insight) => insight.type === filter)

  if (searchQuery) {
    filteredInsights = filteredInsights.filter(
      (insight) =>
        insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        insight.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  filteredInsights = [...filteredInsights].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
      {filteredInsights.map((insight, index) => (
        <InsightCard
          key={insight.id}
          id={insight.id}
          icon={insight.icon}
          title={insight.title}
          description={insight.description}
          category={insight.category}
          variant={insight.variant}
          trend={insight.trend}
          index={index}
          isPinned={insight.isPinned}
        />
      ))}
    </div>
  )
}
