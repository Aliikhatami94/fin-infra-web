const metricCopy = {
  "Net Worth": {
    title: "Net worth",
    description:
      "Includes all linked assets minus liabilities. Pending transactions and unsettled trades may take up to 24 hours to appear.",
    disclaimer: "Values are masked according to your privacy settings.",
  },
  "Investable Assets": {
    title: "Investable assets",
    description:
      "Liquid brokerage, retirement, and cash equivalents that are available to trade. Locked employer accounts are excluded.",
    disclaimer: "Market values update intraday from your connected custodians.",
  },
  "Cash Available": {
    title: "Cash available",
    description:
      "Combined balances from bank and brokerage sweep accounts that are cleared for withdrawal or transfer.",
    disclaimer: "Holds from recent deposits may temporarily reduce this number.",
  },
  "Debt Balance": {
    title: "Debt balance",
    description:
      "Total outstanding principal across credit, loan, and mortgage accounts. Interest and fees update once statements close.",
    disclaimer: "We never display full account numbers—tap to manage masking.",
  },
  "Today's P/L": {
    title: "Today's profit / loss",
    description:
      "Intraday gain or loss across all trading accounts relative to yesterday's closing value.",
    disclaimer: "Includes realized and unrealized moves reported by each custodian.",
  },
  "Credit Score": {
    title: "Credit score",
    description:
      "FICO® 8 score retrieved securely from Experian. Soft inquiries only—checking here will not impact your score.",
    disclaimer: "Scores refresh weekly; request a manual refresh from the Security Center if needed.",
  },
} as const

export type MetricTooltipKey = keyof typeof metricCopy

export const METRIC_TOOLTIPS: Record<MetricTooltipKey, typeof metricCopy[MetricTooltipKey]> = metricCopy

export function getMetricTooltipCopy(label: string) {
  return metricCopy[label as MetricTooltipKey] ?? null
}
