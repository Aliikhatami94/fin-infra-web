import type {
  AutomationHistoryEntry,
  AutomationMetricDelta,
  AutomationSuggestion,
  ScenarioPlaybookDefinition,
} from "@/types/automation"

const portfolioMetrics: AutomationMetricDelta[] = [
  {
    id: "tech-weight",
    label: "US Tech Weight",
    before: 48,
    after: 35,
    unit: "percent",
    direction: "decrease",
    rationale: "Reduces drift against policy band derived from MoneyGraph account allocations.",
  },
  {
    id: "intl-weight",
    label: "International Equity",
    before: 12,
    after: 20,
    unit: "percent",
    direction: "increase",
    rationale: "Adds exposure to underweight regions highlighted in the MoneyGraph goals layer.",
  },
  {
    id: "risk-score",
    label: "Portfolio Risk Score",
    before: 62,
    after: 56,
    unit: "score",
    direction: "decrease",
    rationale: "Expected volatility normalized against 3-year MoneyGraph volatility nodes.",
  },
]

const automationSuggestions: AutomationSuggestion[] = [
  {
    id: "rebalance-tech-overweight",
    surface: "portfolio",
    title: "Rebalance overweight Tech holdings",
    description:
      "Shift $12,400 from US Tech into International Equity and municipal bonds to restore your policy allocation bands.",
    risk: "medium",
    category: "rebalance",
    moneyGraphReferences: [
      "accounts:brokerage:primary",
      "holdings:us-tech",
      "targets:policy-allocation",
    ],
    diffNarrative: {
      headline: "Bring sector drift back within 5% bands",
      summary:
        "MoneyGraph detected your brokerage node drifting 13% above the target Tech allocation. Executing this rebalance lowers expected volatility by 6 points while improving diversification.",
      tradeOffs: [
        "Triggers ~$420 of long-term gains—covered by harvested losses",
        "Maintains liquidity threshold required for upcoming goal withdrawals",
      ],
    },
    metrics: portfolioMetrics,
    confidence: 0.78,
    recommendedSchedule: "Next smart rebalance window (48 hours)",
    relatedScenarioId: "portfolio-rebalance",
    ctaLabel: "Rebalance now",
  },
  {
    id: "tax-harvest-december",
    surface: "taxes",
    title: "Schedule tax-loss harvest batch",
    description:
      "Harvest three positions with unrealized losses to offset $3,200 in gains and reduce your projected tax bill by 11%.",
    risk: "low",
    category: "tax",
    moneyGraphReferences: [
      "accounts:brokerage:primary",
      "transactions:unrealized-losses",
      "tax:liability:2025",
    ],
    diffNarrative: {
      headline: "Lock in losses before December 31",
      summary:
        "MoneyGraph's tax layer paired your unrealized loss nodes with this year's capital gains, projecting a $720 savings if executed before the filing deadline.",
      tradeOffs: ["Short-term wash sale window enforced for 30 days", "Requires reinvestment into correlated ETFs"],
    },
    metrics: [
      {
        id: "projected-savings",
        label: "Projected Savings",
        before: 0,
        after: 720,
        unit: "currency",
        direction: "increase",
      },
      {
        id: "capital-gains",
        label: "Capital Gains Offset",
        before: 0,
        after: 3200,
        unit: "currency",
        direction: "increase",
      },
      {
        id: "tax-liability",
        label: "2025 Tax Liability",
        before: 6400,
        after: 5680,
        unit: "currency",
        direction: "decrease",
      },
    ],
    confidence: 0.82,
    recommendedSchedule: "Execute before Dec 20 to avoid holiday illiquidity",
    relatedScenarioId: "tax-harvest",
    ctaLabel: "Plan harvest",
  },
  {
    id: "budget-sweep-autosave",
    surface: "budget",
    title: "Automate surplus sweep",
    description:
      "Sweep $450 of average monthly surplus into your high-yield savings once essential spending settles each Friday.",
    risk: "low",
    category: "savings",
    moneyGraphReferences: [
      "cashflow:surplus",
      "accounts:high-yield-savings",
      "goals:emergency-fund",
    ],
    diffNarrative: {
      headline: "Keep your savings streak compounding",
      summary:
        "MoneyGraph linked your cash-flow surplus nodes with the emergency fund goal, showing you can accelerate completion by 3 months with an automated sweep.",
      tradeOffs: ["Leaves $1,800 cash buffer in checking", "Pause automation anytime from the Copilot drawer"],
    },
    metrics: [
      {
        id: "surplus-captured",
        label: "Monthly Surplus Captured",
        before: 0,
        after: 450,
        unit: "currency",
        direction: "increase",
      },
      {
        id: "goal-timeline",
        label: "Emergency Fund Timeline",
        before: 9,
        after: 6,
        unit: "number",
        direction: "decrease",
        rationale: "Months to goal completion based on MoneyGraph goal velocity.",
      },
      {
        id: "savings-rate",
        label: "Savings Rate",
        before: 14,
        after: 19,
        unit: "percent",
        direction: "increase",
      },
    ],
    confidence: 0.74,
    recommendedSchedule: "Friday auto-sweep at 4pm local",
    relatedScenarioId: "budget-surplus",
    ctaLabel: "Schedule sweep",
  },
  {
    id: "crypto-diversify-btc",
    surface: "crypto",
    title: "Reduce BTC concentration",
    description:
      "Shift 6% of BTC exposure into ETH and SOL to keep your crypto sleeve aligned with policy bands.",
    risk: "medium",
    category: "allocation",
    moneyGraphReferences: [
      "accounts:crypto:primary",
      "holdings:btc",
      "targets:crypto-policy",
    ],
    diffNarrative: {
      headline: "Ease concentration risk while preserving upside",
      summary:
        "MoneyGraph flagged BTC at 46% of your crypto sleeve. This automation trims $3,200 into ETH and SOL, lifting staking yield and reducing downside correlation.",
      tradeOffs: [
        "Slightly higher trading fees across two exchanges",
        "Triggers a 30-day cooling period on fresh BTC buys",
      ],
    },
    metrics: [
      {
        id: "btc-weight",
        label: "BTC Weight",
        before: 46,
        after: 35,
        unit: "percent",
        direction: "decrease",
      },
      {
        id: "eth-weight",
        label: "ETH Weight",
        before: 28,
        after: 33,
        unit: "percent",
        direction: "increase",
      },
      {
        id: "yield",
        label: "Staking Yield",
        before: 4.2,
        after: 4.8,
        unit: "percent",
        direction: "increase",
      },
    ],
    confidence: 0.7,
    recommendedSchedule: "Execute after tonight's network lull",
    ctaLabel: "Diversify now",
  },
]

const scenarioPlaybooks: ScenarioPlaybookDefinition[] = [
  {
    id: "portfolio-rebalance",
    surface: "portfolio",
    title: "Rebalance Playbook",
    description: "Compare how different rebalance mixes impact drift, yield, and goal funding.",
    cases: [
      {
        id: "gradual",
        title: "Staggered (3 trades)",
        description: "Execute over 3 weeks to minimize tax friction.",
        highlight: "Lowers gains impact",
        risk: "low",
        scheduleHint: "Kick-off next Monday window",
      },
      {
        id: "immediate",
        title: "Immediate (single trade)",
        description: "One-time rebalance restoring targets within 48h.",
        highlight: "Fastest drift correction",
        risk: "medium",
      },
      {
        id: "enhanced",
        title: "Smart beta tilt",
        description: "Adds 5% factor exposure while trimming Tech.",
        highlight: "Boosts projected yield",
        risk: "medium",
      },
    ],
    metrics: [
      {
        id: "drift",
        label: "Target Drift",
        unit: "percent",
        baseline: 13,
        cases: [
          { caseId: "gradual", value: 5 },
          { caseId: "immediate", value: 2 },
          { caseId: "enhanced", value: 3 },
        ],
      },
      {
        id: "yield",
        label: "Projected Yield",
        unit: "percent",
        baseline: 4.1,
        cases: [
          { caseId: "gradual", value: 4.2 },
          { caseId: "immediate", value: 4.0 },
          { caseId: "enhanced", value: 4.6 },
        ],
      },
      {
        id: "goal-funding",
        label: "Goal Funding Probability",
        unit: "percent",
        baseline: 71,
        cases: [
          { caseId: "gradual", value: 74 },
          { caseId: "immediate", value: 73 },
          { caseId: "enhanced", value: 76 },
        ],
      },
    ],
    insightPrompt: "Ask the Copilot how each rebalance option impacts your MoneyGraph goal nodes.",
  },
  {
    id: "tax-harvest",
    surface: "taxes",
    title: "Tax Harvest Playbook",
    description: "Explore how harvesting positions now vs. later changes liability and wash sale windows.",
    cases: [
      {
        id: "now",
        title: "Harvest now",
        description: "Lock gains offset immediately.",
        risk: "low",
        highlight: "Max savings",
        scheduleHint: "Trigger within 48h",
      },
      {
        id: "staggered",
        title: "Staggered",
        description: "Split trades across two tax lots to manage wash sale rules.",
        risk: "low",
        highlight: "Smooth compliance",
      },
      {
        id: "defer",
        title: "Defer",
        description: "Monitor for deeper losses before year-end.",
        risk: "medium",
      },
    ],
    metrics: [
      {
        id: "savings",
        label: "Tax Savings",
        unit: "currency",
        baseline: 0,
        cases: [
          { caseId: "now", value: 720 },
          { caseId: "staggered", value: 640 },
          { caseId: "defer", value: 380 },
        ],
      },
      {
        id: "wash",
        label: "Wash Sale Risk",
        unit: "score",
        baseline: 72,
        cases: [
          { caseId: "now", value: 30 },
          { caseId: "staggered", value: 20 },
          { caseId: "defer", value: 48 },
        ],
      },
      {
        id: "liability",
        label: "Year-End Liability",
        unit: "currency",
        baseline: 6400,
        cases: [
          { caseId: "now", value: 5680 },
          { caseId: "staggered", value: 5750 },
          { caseId: "defer", value: 6020 },
        ],
      },
    ],
    insightPrompt: "Use Copilot to draft a reminder for supporting tax documents.",
  },
  {
    id: "budget-surplus",
    surface: "budget",
    title: "Cash Flow Automation",
    description: "Compare surplus routing options and their impact on savings streaks.",
    cases: [
      {
        id: "hy-savings",
        title: "High-Yield Savings",
        description: "Route surplus to emergency fund (default).",
        risk: "low",
        highlight: "Goal aligned",
      },
      {
        id: "brokerage",
        title: "Invest surplus",
        description: "Automate ETF buys every two weeks.",
        risk: "medium",
        highlight: "Higher upside",
      },
      {
        id: "debt",
        title: "Debt snowball",
        description: "Accelerate student loan payoff.",
        risk: "low",
        highlight: "Guaranteed return",
      },
    ],
    metrics: [
      {
        id: "goal-months",
        label: "Months to Emergency Fund Goal",
        unit: "number",
        baseline: 9,
        cases: [
          { caseId: "hy-savings", value: 6 },
          { caseId: "brokerage", value: 7 },
          { caseId: "debt", value: 8 },
        ],
      },
      {
        id: "savings-rate",
        label: "Savings Rate",
        unit: "percent",
        baseline: 14,
        cases: [
          { caseId: "hy-savings", value: 19 },
          { caseId: "brokerage", value: 17 },
          { caseId: "debt", value: 16 },
        ],
      },
      {
        id: "debt-paid",
        label: "Debt Paid Off",
        unit: "currency",
        baseline: 0,
        cases: [
          { caseId: "hy-savings", value: 0 },
          { caseId: "brokerage", value: 0 },
          { caseId: "debt", value: 3200 },
        ],
      },
    ],
    insightPrompt: "Ask Copilot which automation keeps cash buffers above $1.5k.",
  },
]

const taxDeadlines = [
  {
    id: "estimated-q4",
    label: "Q4 Estimated Taxes",
    date: "Jan 15, 2025",
    icon: "calendar",
    detail: "Submit final estimated payment to avoid penalties.",
  },
  {
    id: "w2-arrival",
    label: "Employers mail W-2",
    date: "Jan 31, 2025",
    icon: "mail",
    detail: "Track arrival of wage statements for filing completeness.",
  },
  {
    id: "ira-deadline",
    label: "IRA contribution deadline",
    date: "Apr 15, 2025",
    icon: "piggy",
    detail: "Contribute to reach $6,500 limit tied to retirement goal node.",
  },
  {
    id: "file-return",
    label: "File 2024 return",
    date: "Apr 15, 2025",
    icon: "file",
    detail: "Submit federal & state filings or request extension.",
  },
]

const taxExplanations: Record<string, { title: string; summary: string; sources: string[] }> = {
  liability: {
    title: "How we calculate your projected liability",
    summary:
      "MoneyGraph links your wage, brokerage, and self-employment nodes to estimate taxable income. We net expected deductions and credits, then apply your marginal bracket to show a conservative liability range.",
    sources: ["IRS Publication 505", "Brokerage 1099 composite", "Payroll withholding feed"],
  },
  harvest: {
    title: "Why we recommend harvesting now",
    summary:
      "Loss positions surfaced in the capital gains cluster exceed your tolerance band. Harvesting now offsets short-term gains while respecting wash-sale windows across connected accounts.",
    sources: ["MoneyGraph loss monitor", "Capital gains ledger", "Risk policy configuration"],
  },
}

export function getAutomationSuggestions(surface?: AutomationSuggestion["surface"]) {
  if (!surface) {
    return automationSuggestions
  }

  return automationSuggestions.filter((suggestion) => suggestion.surface === surface)
}

export function getAutomationSuggestionById(id: string) {
  return automationSuggestions.find((suggestion) => suggestion.id === id)
}

export function getScenarioPlaybook(surface: ScenarioPlaybookDefinition["surface"]) {
  return scenarioPlaybooks.find((playbook) => playbook.surface === surface) ?? null
}

export function getTaxDeadlines() {
  return taxDeadlines
}

export function getTaxExplanation(key: keyof typeof taxExplanations) {
  return taxExplanations[key]
}

export function upsertAutomationHistory(
  entries: AutomationHistoryEntry[],
  entry: AutomationHistoryEntry,
): AutomationHistoryEntry[] {
  const filtered = entries.filter((item) => item.id !== entry.id)
  return [...filtered, entry].sort((a, b) => b.executedAt.localeCompare(a.executedAt))
}
