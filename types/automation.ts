export type AutomationRiskLevel = "low" | "medium" | "high"

export interface AutomationMetricDelta {
  id: string
  label: string
  before: number
  after: number
  unit: "currency" | "percent" | "number" | "score"
  precision?: number
  direction?: "increase" | "decrease"
  rationale?: string
}

export interface AutomationDiffNarrative {
  headline: string
  summary: string
  tradeOffs?: string[]
}

export interface AutomationSuggestion {
  id: string
  surface: "portfolio" | "taxes" | "budget" | "crypto"
  title: string
  description: string
  risk: AutomationRiskLevel
  category: "rebalance" | "savings" | "tax" | "documents" | "budget" | "allocation"
  moneyGraphReferences: string[]
  diffNarrative: AutomationDiffNarrative
  metrics: AutomationMetricDelta[]
  confidence: number
  recommendedSchedule: string
  relatedScenarioId?: string
  ctaLabel?: string
}

export interface ScenarioMetric {
  id: string
  label: string
  unit: "currency" | "percent" | "number" | "score"
  baseline: number
  cases: Array<{
    caseId: string
    value: number
  }>
}

export interface ScenarioCaseDefinition {
  id: string
  title: string
  description: string
  highlight?: string
  risk?: AutomationRiskLevel
  scheduleHint?: string
}

export interface ScenarioPlaybookDefinition {
  id: string
  surface: "portfolio" | "taxes" | "budget"
  title: string
  description: string
  cases: ScenarioCaseDefinition[]
  metrics: ScenarioMetric[]
  insightPrompt?: string
}

export interface AutomationHistoryEntry {
  id: string
  suggestionId: string
  label: string
  executedAt: string
  scheduledFor?: string
  status: "scheduled" | "executed" | "undone" | "declined"
  decision: "accepted" | "declined"
  reason?: string
}
