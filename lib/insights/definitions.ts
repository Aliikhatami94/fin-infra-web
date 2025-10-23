import { AlertCircle, AlertTriangle, DollarSign, FileText, Fuel, HelpCircle, Lightbulb, PieChart, Sparkles, Target, TrendingDown, TrendingUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { ButtonVariant } from "@/types/domain"

export type InsightCategory =
  | "spending"
  | "investment"
  | "goals"
  | "documents"
  | "cash-flow"
  | "budget"
  | "tax"
  | "crypto"

export type InsightSurface =
  | "overview"
  | "documents"
  | "portfolio"
  | "cash-flow"
  | "budget"
  | "goals"
  | "crypto"
  | "taxes"
  | "insights"

export type InsightAccent =
  | "amber"
  | "emerald"
  | "sky"
  | "violet"
  | "orange"
  | "rose"
  | "cyan"
  | "slate"

export interface InsightMetric {
  id: string
  label: string
  value: string
  targetLabel?: string
  targetValue?: string
  delta?: string
  trend?: "up" | "down" | "neutral"
  highlight?: boolean
  srLabel?: string
}

export interface InsightAction {
  id: string
  label: string
  href?: string
  variant?: ButtonVariant
  ariaLabel?: string
}

export interface InsightDefinition {
  id: string
  title: string
  body: string
  category: InsightCategory
  topic: string
  surfaces: InsightSurface[]
  icon: LucideIcon
  accent: InsightAccent
  metrics?: InsightMetric[]
  actions: InsightAction[]
  explanation?: string
  progress?: {
    value: number
    label?: string
  }
  pinned?: boolean
  priority?: "low" | "medium" | "high"
  updatedAt?: string
}

export const insightDefinitions: ReadonlyArray<InsightDefinition> = [
  {
    id: "overview-savings-progress",
    title: "Great savings progress",
    body: "You saved $420 this month by canceling unused subscriptions.",
    category: "spending",
    topic: "Savings Rate",
    surfaces: ["overview", "cash-flow", "insights"],
    icon: TrendingUp,
    accent: "emerald",
    metrics: [
      { id: "savings-month", label: "This Month", value: "$420", highlight: true },
      { id: "savings-average", label: "Average", value: "$280" },
      { id: "savings-goal", label: "Goal", value: "$500" },
    ],
    actions: [
      { id: "view-cashflow", label: "View Cash Flow", href: "/cash-flow", variant: "outline" },
    ],
    explanation:
      "Based on your last 6 months of spending, your average discretionary savings is $280/month. Canceling three unused subscriptions increased your savings to $420 in March.",
    progress: { value: 85, label: "Goal completion" },
    pinned: true,
    priority: "medium",
  },
  {
    id: "overview-diversification-opportunity",
    title: "Diversification opportunity",
    body: "US Tech represents 48% of your portfolio. Consider diversifying into other sectors.",
    category: "investment",
    topic: "Investment Health",
    surfaces: ["overview", "portfolio", "insights"],
    icon: AlertTriangle,
    accent: "rose",
    metrics: [
      { id: "current-weight", label: "Current", value: "48%", highlight: true },
      { id: "target-weight", label: "Target", value: "35%" },
      { id: "overweight", label: "Overweight", value: "+13%", delta: "+13%", trend: "up" },
    ],
    actions: [
      { id: "rebalance", label: "Rebalance", href: "/portfolio", variant: "outline" },
    ],
    explanation:
      "Your target allocation for US Tech is 35%, but recent performance increased it to 48%. Rebalancing $12,400 into underweight sectors (International at 12%, Fixed Income at 18%) would restore your policy mix.",
    progress: { value: 48, label: "Tech allocation" },
    pinned: true,
    priority: "high",
  },
  {
    id: "overview-tax-optimization",
    title: "Tax optimization",
    body: "You can offset $3,000 in capital losses this year to reduce your tax liability.",
    category: "tax",
    topic: "Tax Planning",
    surfaces: ["overview", "taxes", "insights"],
    icon: Lightbulb,
    accent: "orange",
    metrics: [
      { id: "losses", label: "Harvestable Losses", value: "$3,000", highlight: true },
      { id: "estimated-savings", label: "Est. Savings", value: "$720" },
      { id: "deadline", label: "Deadline", value: "Dec 31" },
    ],
    actions: [
      { id: "plan-harvest", label: "Plan Harvest", href: "/taxes", variant: "default" },
    ],
    explanation:
      "Five positions have unrealized losses greater than $1,000. Tax-loss harvesting before December 31 could offset short-term gains and lower your 2025 tax bill by an estimated $720.",
    progress: { value: 60, label: "Harvest readiness" },
    pinned: true,
    priority: "medium",
  },
  {
    id: "goals-emergency-fund-milestone",
    title: "Emergency fund milestone",
    body: "You've reached 60% of your emergency fund goal, ahead of schedule by 2 months.",
    category: "goals",
    topic: "Goals Forecast",
    surfaces: ["overview", "goals", "insights"],
    icon: Target,
    accent: "emerald",
    metrics: [
      { id: "current-balance", label: "Current Balance", value: "$12,000", highlight: true },
      { id: "target", label: "Target", value: "$20,000" },
      { id: "remaining", label: "Remaining", value: "$8,000" },
    ],
    actions: [
      { id: "adjust-goal", label: "Adjust Goal", href: "/goals", variant: "outline" },
    ],
    explanation:
      "Your emergency fund goal is $20,000 (six months of expenses). Saving $800/month keeps you two months ahead of schedule.",
    progress: { value: 60, label: "Goal completion" },
    pinned: true,
    priority: "low",
  },
  {
    id: "cashflow-dining-spike",
    title: "Dining expenses increased",
    body: "You spent 18% more on dining this month compared to your average.",
    category: "spending",
    topic: "Spending Trends",
    surfaces: ["cash-flow", "insights"],
    icon: DollarSign,
    accent: "amber",
    metrics: [
      { id: "this-month", label: "This Month", value: "$680", highlight: true },
      { id: "average", label: "Average", value: "$576" },
      { id: "over-budget", label: "Over Budget", value: "+$104", delta: "+18%", trend: "up" },
    ],
    actions: [
      { id: "review-dining", label: "View Details", href: "/cash-flow", variant: "outline" },
    ],
    explanation:
      "Three weekend dinners accounted for $310 of the increase. Consider setting a weekly dining limit or scheduling an alert when spending exceeds $150 per week.",
    priority: "medium",
  },
  {
    id: "cashflow-subscription-savings",
    title: "Subscription savings opportunity",
    body: "You have 3 unused subscriptions totaling $45/month. Cancel them to save $540 annually.",
    category: "spending",
    topic: "Spending Trends",
    surfaces: ["cash-flow", "insights"],
    icon: Sparkles,
    accent: "sky",
    metrics: [
      { id: "monthly-cost", label: "Monthly Cost", value: "$45", highlight: true },
      { id: "annual-savings", label: "Annual Savings", value: "$540" },
      { id: "unused-days", label: "Unused Days", value: "90+" },
    ],
    actions: [
      { id: "optimize", label: "Optimize", href: "/cash-flow", variant: "secondary" },
    ],
    explanation:
      "Streaming Service A, Fitness App Pro, and Cloud Storage Plus haven't been used in more than 90 days. Canceling all three would free up $540/year for savings goals.",
    priority: "low",
  },
  {
    id: "budget-entertainment-overspend",
    title: "Entertainment budget over by 15%",
    body: "You're 15% over budget in Entertainment. Reduce by $120 to stay on track this month.",
    category: "budget",
    topic: "Budget Health",
    surfaces: ["budget"],
    icon: TrendingDown,
    accent: "rose",
    metrics: [
      { id: "budget-used", label: "Spent", value: "$920", highlight: true },
      { id: "budget-target", label: "Budget", value: "$800" },
      { id: "variance", label: "Variance", value: "+$120", delta: "+15%", trend: "up" },
    ],
    actions: [
      { id: "adjust-budget", label: "Adjust Budget", href: "/budget", variant: "outline" },
    ],
    explanation:
      "Concert tickets and two streaming rentals accounted for the variance. Rolling back discretionary spending by $40/week keeps the category within target.",
    priority: "medium",
  },
  {
    id: "budget-reallocate-surplus",
    title: "Reallocate unused budget",
    body: "You're under budget in 4 categories. Consider reallocating $200 to savings.",
    category: "budget",
    topic: "Budget Health",
    surfaces: ["budget", "insights"],
    icon: Target,
    accent: "emerald",
    metrics: [
      { id: "surplus", label: "Available", value: "$200", highlight: true },
      { id: "categories", label: "Categories", value: "4 under" },
      { id: "opportunity", label: "Opportunity", value: "+$200/mo" },
    ],
    actions: [
      { id: "reallocate", label: "Reallocate", href: "/budget", variant: "secondary" },
    ],
    explanation:
      "Groceries, Utilities, Transportation, and Wellness are running a combined $200 below plan. You can redirect that surplus toward the Emergency Fund goal without impacting essentials.",
    priority: "low",
  },
  {
    id: "portfolio-underperformers",
    title: "3 holdings underperformed the S&P 500",
    body: "Three holdings are lagging the S&P 500 by more than 15% this quarter.",
    category: "investment",
    topic: "Investment Health",
    surfaces: ["portfolio", "insights"],
    icon: TrendingDown,
    accent: "orange",
    metrics: [
      { id: "laggards", label: "Holdings", value: "3", highlight: true },
      { id: "underperformance", label: "Underperformance", value: "-15%" },
      { id: "impact", label: "Portfolio Impact", value: "-$2,300" },
    ],
    actions: [
      { id: "review-assets", label: "Review Assets", href: "/portfolio", variant: "outline" },
    ],
    explanation:
      "XYZ Cloud (-18%), ABC Retail (-16%), and DEF Biotech (-15%) have lagged the benchmark. Setting performance alerts or trimming positions can reduce downside risk.",
    priority: "high",
  },
  {
    id: "portfolio-rebalance-tech",
    title: "Portfolio overweight in Tech",
    body: "Your portfolio is overweight in Tech (42%). Consider rebalancing to reduce sector risk.",
    category: "investment",
    topic: "Sector Allocation",
    surfaces: ["portfolio", "insights"],
    icon: PieChart,
    accent: "sky",
    metrics: [
      { id: "current-tech", label: "Current", value: "42%", highlight: true },
      { id: "target-tech", label: "Target", value: "30%" },
      { id: "difference", label: "Overweight", value: "+12%", delta: "+12%", trend: "up" },
    ],
    actions: [
      { id: "rebalance-tech", label: "Rebalance", href: "/portfolio", variant: "secondary" },
    ],
    explanation:
      "Technology has grown 12 percentage points over target in the last two quarters. Shifting $9,800 into International Equity and Fixed Income brings the allocation back within tolerance bands.",
    priority: "medium",
  },
  {
    id: "crypto-gas-fees",
    title: "ETH network fees elevated",
    body: "Network fees are currently high (25 gwei). Consider waiting for lower gas prices to optimize transaction costs.",
    category: "crypto",
    topic: "Market Conditions",
    surfaces: ["crypto"],
    icon: Fuel,
    accent: "orange",
    metrics: [
      { id: "current-gas", label: "Current Gas", value: "25 gwei", highlight: true },
      { id: "average-gas", label: "30-day Avg", value: "14 gwei" },
      { id: "potential-savings", label: "Potential Savings", value: "$18/tx" },
    ],
    actions: [
      { id: "set-alert", label: "Set Alert", href: "/crypto", variant: "outline" },
    ],
    explanation:
      "Gas fees spike during U.S. market hours. Scheduling swaps after 8pm ET typically reduces costs by 35%.",
    priority: "medium",
  },
  {
    id: "crypto-staking-opportunity",
    title: "ETH staking yield available",
    body: "ETH staking is enabled with 4.2% APY. You could earn an additional $689/year by staking your full ETH balance.",
    category: "crypto",
    topic: "Yield Opportunities",
    surfaces: ["crypto", "insights"],
    icon: Sparkles,
    accent: "emerald",
    metrics: [
      { id: "balance", label: "Eligible Balance", value: "16.4 ETH", highlight: true },
      { id: "estimated-yield", label: "Est. Yield", value: "$689/yr" },
      { id: "lockup", label: "Lockup", value: "Flexible" },
    ],
    actions: [
      { id: "enable-staking", label: "Enable Staking", href: "/crypto", variant: "default" },
    ],
    explanation:
      "Restaking through Lido keeps liquidity while earning 4.2% APY. Enabling auto-compound increases projected rewards to $742/year.",
    priority: "low",
  },
  {
    id: "crypto-btc-momentum",
    title: "BTC momentum building",
    body: "BTC is showing strong momentum. Historical patterns suggest potential 8-12% upside in the next 30 days.",
    category: "crypto",
    topic: "Market Signals",
    surfaces: ["crypto", "insights"],
    icon: TrendingUp,
    accent: "amber",
    metrics: [
      { id: "momentum-score", label: "Momentum Score", value: "74", highlight: true },
      { id: "support", label: "Support", value: "$58,400" },
      { id: "resistance", label: "Resistance", value: "$64,800" },
    ],
    actions: [
      { id: "view-analysis", label: "View Analysis", href: "/crypto", variant: "secondary" },
    ],
    explanation:
      "BTC's 14-day RSI is 61 and price has reclaimed the 50-day moving average. Consider staggered buys with alerts at $60K and $63K.",
    priority: "low",
  },
  {
    id: "crypto-concentration-risk",
    title: "Crypto portfolio concentrated in BTC",
    body: "Your portfolio is heavily concentrated in BTC (46%). Consider rebalancing to reduce risk exposure.",
    category: "crypto",
    topic: "Risk Management",
    surfaces: ["crypto", "portfolio", "insights"],
    icon: AlertCircle,
    accent: "rose",
    metrics: [
      { id: "btc-weight", label: "BTC Weight", value: "46%", highlight: true },
      { id: "eth-weight", label: "ETH", value: "28%" },
      { id: "alts-weight", label: "Alts", value: "26%" },
    ],
    actions: [
      { id: "rebalance-crypto", label: "Rebalance", href: "/crypto", variant: "outline" },
    ],
    explanation:
      "Diversifying into ETH and SOL reduces concentration risk while preserving upside. A 35/35/30 allocation keeps volatility in line with your risk score.",
    priority: "medium",
  },
  {
    id: "documents-missing-tax-docs",
    title: "Missing Q4 tax documents",
    body: "Missing Q4 2024 tax documents from 2 brokers. Upload by March 15 to avoid delays.",
    category: "documents",
    topic: "Document Checklist",
    surfaces: ["documents", "taxes", "insights"],
    icon: AlertCircle,
    accent: "orange",
    metrics: [
      { id: "missing-docs", label: "Missing", value: "2", highlight: true },
      { id: "institutions", label: "Institutions", value: "Fidelity, Robinhood" },
      { id: "due-date", label: "Due", value: "Mar 15" },
    ],
    actions: [
      { id: "upload-docs", label: "Upload Now", href: "/documents", variant: "default" },
    ],
    explanation:
      "Fidelity 1099-B and Robinhood consolidated statements are outstanding. Upload before March 15 so your CPA has five business days to reconcile trades.",
    priority: "high",
  },
  {
    id: "documents-tax-review",
    title: "2024 tax documents ready",
    body: "Your 2024 tax documents are ready for review. Estimated refund: $2,340.",
    category: "documents",
    topic: "Document Checklist",
    surfaces: ["documents", "taxes", "insights"],
    icon: FileText,
    accent: "violet",
    metrics: [
      { id: "documents-ready", label: "Documents", value: "5 ready", highlight: true },
      { id: "estimated-refund", label: "Est. Refund", value: "$2,340" },
      { id: "last-updated", label: "Updated", value: "Feb 28" },
    ],
    actions: [
      { id: "review-docs", label: "Review", href: "/documents", variant: "secondary" },
    ],
    explanation:
      "Statements from Chase, BofA, Fidelity, and Robinhood are reconciled. Reviewing now gives you a 3-week cushion before filing deadlines.",
    priority: "medium",
  },
  {
    id: "goals-accelerate-home-goal",
    title: "Reach your home goal sooner",
    body: "Increase your monthly contribution by $150 to reach your Home Down Payment goal 6 months earlier.",
    category: "goals",
    topic: "Goals Forecast",
    surfaces: ["goals", "insights"],
    icon: TrendingUp,
    accent: "sky",
    metrics: [
      { id: "current-rate", label: "Current Rate", value: "$500/mo" },
      { id: "suggested-rate", label: "Suggested", value: "$650/mo", highlight: true },
      { id: "time-saved", label: "Time Saved", value: "6 months" },
    ],
    actions: [
      { id: "adjust-contribution", label: "Adjust Contribution", href: "/goals", variant: "default" },
    ],
    explanation:
      "Adding $150/month increases projected 3-year savings by $5,400, pulling your projected closing date into Q2 2027.",
    priority: "medium",
  },
  {
    id: "goals-new-investment",
    title: "You're ahead on your emergency fund",
    body: "You're ahead of schedule on Emergency Fund. Consider starting a new investment goal.",
    category: "goals",
    topic: "Goals Forecast",
    surfaces: ["goals", "insights"],
    icon: Lightbulb,
    accent: "violet",
    metrics: [
      { id: "ahead", label: "Ahead By", value: "2 months", highlight: true },
      { id: "current-balance-goal", label: "Balance", value: "$12,000" },
      { id: "next-step", label: "Next Step", value: "Open Roth IRA" },
    ],
    actions: [
      { id: "add-goal", label: "Add Goal", href: "/goals", variant: "secondary" },
    ],
    explanation:
      "Emergency fund contributions exceeded plan three months in a row. Redirecting $200/month toward a Roth IRA could add $48,000 over 10 years.",
    priority: "low",
  },
  {
    id: "tax-loss-opportunities",
    title: "Tax-loss harvesting opportunities",
    body: "5 positions identified with potential savings of $3,200. Review and act before December 31st.",
    category: "tax",
    topic: "Tax Planning",
    surfaces: ["taxes", "insights"],
    icon: TrendingDown,
    accent: "orange",
    metrics: [
      { id: "positions", label: "Positions", value: "5", highlight: true },
      { id: "potential-savings", label: "Potential Savings", value: "$3,200" },
      { id: "deadline-tax", label: "Deadline", value: "Dec 31" },
    ],
    actions: [
      { id: "review-positions", label: "Review Positions", href: "/taxes", variant: "default" },
    ],
    explanation:
      "Selling XYZ Cloud, ABC Retail, and three other holdings would realize $3,200 in losses. Re-enter after 31 days to avoid wash-sale rules.",
    priority: "high",
  },
  {
    id: "tax-withholding-alert",
    title: "Update your withholding",
    body: "Your current withholding leaves a projected balance due of $640. Adjust settings to avoid penalties.",
    category: "tax",
    topic: "Tax Planning",
    surfaces: ["taxes", "insights"],
    icon: HelpCircle,
    accent: "slate",
    metrics: [
      { id: "balance-due", label: "Projected Due", value: "$640", highlight: true },
      { id: "last-update", label: "Last Updated", value: "Jan 15" },
      { id: "recommended", label: "Recommended", value: "+$85/mo" },
    ],
    actions: [
      { id: "update-withholding", label: "Update Withholding", href: "/taxes", variant: "outline" },
    ],
    explanation:
      "Payroll withholding has not changed since 2023. Increasing by $85/month covers the projected balance and avoids underpayment penalties.",
    priority: "medium",
  },
]
