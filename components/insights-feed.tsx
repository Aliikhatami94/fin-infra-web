"use client"

import { InsightCard } from "@/components/insight-card"
import { TrendingUp, AlertTriangle, Lightbulb, Target, DollarSign, PieChart } from "lucide-react"

const allInsights = [
  {
    id: 1,
    type: "spending",
    icon: DollarSign,
    title: "Dining expenses increased",
    description: "You spent 18% more on dining this month compared to your average.",
    category: "Spending Trends",
    variant: "spending" as const,
    trend: 18,
    isPinned: false,
    dataPoints: [
      { label: "This Month", value: "$680", highlight: true },
      { label: "Average", value: "$576" },
      { label: "Over Budget", value: "+$104" },
    ],
    explanation:
      "Based on your last 6 months of spending, your average dining expense is $576/month. This month you spent $680, which is $104 (18%) above your typical spending pattern. This increase was primarily driven by 3 weekend dinners at upscale restaurants.",
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
    dataPoints: [
      { label: "Current Allocation", value: "48%", highlight: true },
      { label: "Target", value: "35%" },
      { label: "Overweight", value: "+13%" },
    ],
    explanation:
      "Your target allocation for US Tech is 35%, but due to strong performance, it has grown to 48% of your portfolio. This concentration increases your risk exposure. Consider selling $12,400 of tech holdings and reallocating to underweight sectors like International Equities (currently 12%, target 20%).",
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
    dataPoints: [
      { label: "Current Balance", value: "$12,000", highlight: true },
      { label: "Target", value: "$20,000" },
      { label: "Remaining", value: "$8,000" },
    ],
    explanation:
      "Your emergency fund goal is to save $20,000 (6 months of expenses). You've saved $12,000 so far at an average rate of $800/month. At this pace, you'll reach your goal in 10 months, which is 2 months ahead of your original 12-month target.",
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
    dataPoints: [
      { label: "Monthly Cost", value: "$45", highlight: true },
      { label: "Annual Savings", value: "$540" },
      { label: "Unused Days", value: "90+" },
    ],
    explanation:
      "We detected 3 subscriptions that haven't been used in over 90 days: Streaming Service A ($15/mo, last used 94 days ago), Fitness App ($20/mo, last used 102 days ago), and Cloud Storage ($10/mo, last used 87 days ago). Canceling these would save you $540 per year.",
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
    dataPoints: [
      { label: "Your Volatility", value: "22.4%", highlight: true },
      { label: "Benchmark (SPY)", value: "16.8%" },
      { label: "Difference", value: "+5.6%" },
    ],
    explanation:
      "Your portfolio's 30-day volatility is 22.4%, which is 5.6 percentage points higher than the S&P 500 benchmark (16.8%). This places you in the 78th percentile of volatility among similar portfolios. High volatility means larger price swings. Consider adding bonds or dividend stocks to reduce volatility.",
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
    dataPoints: [
      { label: "Current Rate", value: "$500/mo" },
      { label: "Suggested Rate", value: "$700/mo", highlight: true },
      { label: "Time Saved", value: "8 months" },
    ],
    explanation:
      "Your house down payment goal is $50,000. At your current savings rate of $500/month, you'll reach this goal in 42 months. By increasing to $700/month (an additional $200), you could reach your goal in just 34 months, saving 8 months of time.",
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
          dataPoints={insight.dataPoints}
          explanation={insight.explanation}
        />
      ))}
    </div>
  )
}
