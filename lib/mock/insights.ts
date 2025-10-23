import {
  AlertCircle,
  AlertTriangle,
  DollarSign,
  Fuel,
  Lightbulb,
  PieChart,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

import type { DocumentInsight, InsightFeedItem, OverviewInsight } from "@/types/domain"

export const overviewInsights: OverviewInsight[] = [
  {
    id: 1,
    type: "savings",
    icon: TrendingUp,
    title: "Great savings progress",
    description: "You saved $420 this month by canceling unused subscriptions.",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    progress: 85,
    isPinned: true,
  },
  {
    id: 3,
    type: "goal",
    icon: Target,
    title: "Emergency fund milestone",
    description: "You've reached 60% of your emergency fund goal, ahead of schedule by 2 months.",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    progress: 60,
    isPinned: true,
  },
  {
    id: 2,
    type: "diversification",
    icon: AlertTriangle,
    title: "Diversification opportunity",
    description: "US Tech represents 48% of your portfolio. Consider diversifying into other sectors.",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    progress: 48,
    isPinned: false,
  },
  {
    id: 4,
    type: "tip",
    icon: Lightbulb,
    title: "Tax optimization",
    description: "You can offset $3,000 in capital losses this year to reduce your tax liability.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    progress: 60,
    isPinned: false,
  },
]

export const insightsFeed: InsightFeedItem[] = [
  {
    id: 1,
    type: "spending",
    icon: DollarSign,
    title: "Dining expenses increased",
    description: "You spent 18% more on dining this month compared to your average.",
    category: "Spending Trends",
    variant: "spending",
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
    variant: "investment",
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
    variant: "goals",
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
    variant: "spending",
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
    variant: "alert",
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
    variant: "goals",
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

export const cashFlowInsights: DocumentInsight[] = [
  {
    icon: AlertTriangle,
    text: "Unusual spike in dining expenses this month (+$420 vs. average). Review recent transactions.",
    color: "text-[var(--color-warning)]",
    bgColor: "bg-[var(--color-warning)]/10",
    action: "View Details",
  },
  {
    icon: TrendingUp,
    text: "You could save $180/month by consolidating 3 subscriptions. Automation available.",
    color: "text-[var(--color-positive)]",
    bgColor: "bg-[var(--color-positive)]/10",
    action: "Optimize",
  },
]

export const budgetInsights: DocumentInsight[] = [
  {
    icon: TrendingDown,
    text: "You're 15% over budget in Entertainment. Reduce by $120 to stay on track this month.",
    color: "text-[var(--color-negative)]",
    bgColor: "bg-[var(--color-negative)]/10",
    action: "Adjust Budget",
  },
  {
    icon: Target,
    text: "Great job! You're under budget in 4 categories. Consider reallocating $200 to savings.",
    color: "text-[var(--color-positive)]",
    bgColor: "bg-[var(--color-positive)]/10",
    action: "Reallocate",
  },
]

export const goalsInsights: DocumentInsight[] = [
  {
    icon: TrendingUp,
    text: "Increase your monthly contribution by $150 to reach your Home Down Payment goal 6 months earlier.",
    color: "text-[var(--color-info)]",
    bgColor: "bg-[var(--color-info)]/10",
    action: "Adjust Goal",
  },
  {
    icon: Target,
    text: "You're ahead of schedule on Emergency Fund! Consider starting a new investment goal.",
    color: "text-[var(--color-positive)]",
    bgColor: "bg-[var(--color-positive)]/10",
    action: "Add Goal",
  },
]

export const cryptoInsights: DocumentInsight[] = [
  {
    icon: Fuel,
    text: "Network fees are currently high (25 gwei). Consider waiting for lower gas prices to optimize transaction costs.",
    color: "text-[var(--color-warning)]",
    bgColor: "bg-[var(--color-warning)]/10",
    action: "Set Alert",
    priority: "high",
  },
  {
    icon: Sparkles,
    text: "ETH staking is enabled with 4.2% APY. You could earn an additional $689/year by staking your full ETH balance.",
    color: "text-[var(--color-info)]",
    bgColor: "bg-[var(--color-info)]/10",
    action: "Enable Staking",
    priority: "medium",
  },
  {
    icon: TrendingUp,
    text: "BTC is showing strong momentum. Historical patterns suggest potential 8-12% upside in next 30 days.",
    color: "text-[var(--color-positive)]",
    bgColor: "bg-[var(--color-positive)]/10",
    action: "View Analysis",
    priority: "low",
  },
  {
    icon: AlertCircle,
    text: "Your portfolio is heavily concentrated in BTC (46%). Consider rebalancing to reduce risk exposure.",
    color: "text-[var(--color-warning)]",
    bgColor: "bg-[var(--color-warning)]/10",
    action: "Rebalance",
    priority: "medium",
  },
]

export const portfolioInsights: DocumentInsight[] = [
  {
    icon: TrendingDown,
    text: "3 holdings are underperforming the S&P 500 by more than 15% this quarter.",
    color: "text-[var(--color-warning)]",
    bgColor: "bg-[var(--color-warning)]/10",
    action: "Review Assets",
  },
  {
    icon: Target,
    text: "Your portfolio is overweight in Tech (42%). Consider rebalancing to reduce sector risk.",
    color: "text-[var(--color-info)]",
    bgColor: "bg-[var(--color-info)]/10",
    action: "Rebalance",
  },
]
