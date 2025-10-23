import type { InsightAction, InsightDefinition } from "@/lib/insights/definitions"
import type { AutomationSuggestion, AutomationMetricDelta } from "@/types/automation"
import { createRedactingLogger, sanitizeForLogging } from "@/lib/security/redaction"
import {
  FeatureFlagKey,
  ExperimentVariant,
  getAttributionSource,
  getExperimentCohort,
  getExperimentVariant,
  shouldSampleEvent,
} from "@/lib/analytics/experiments"

const shouldLogAnalytics = process.env.NODE_ENV === "development"
const analyticsLogger = createRedactingLogger("analytics")

type BaseAnalyticsEvent = {
  timestamp: string
  seed?: string
}

type InsightActionEvent = BaseAnalyticsEvent & {
  type: "insight_action"
  insightId: string
  actionId: string
  actionLabel: string
  category: InsightDefinition["category"]
  topic: string
  surfaces: InsightDefinition["surfaces"]
  priority: InsightDefinition["priority"] | undefined
}

type InsightPinEvent = BaseAnalyticsEvent & {
  type: "insight_pin"
  insightId: string
  pinned: boolean
  category: InsightDefinition["category"]
  topic: string
}

type InsightResolvedEvent = BaseAnalyticsEvent & {
  type: "insight_resolved"
  insightId: string
  category: InsightDefinition["category"]
  topic: string
}

type InsightReadStateEvent = BaseAnalyticsEvent & {
  type: "insight_read_state"
  insightId: string
  state: "highlighted" | "read"
  surface: InsightDefinition["surfaces"]
}

type PreferenceToggleEvent = BaseAnalyticsEvent & {
  type: "preference_toggle"
  preferenceId: string
  label: string
  section?: string
  value: boolean
}

type PreferenceSliderEvent = BaseAnalyticsEvent & {
  type: "preference_slider"
  sliderId: string
  label?: string
  values: number[]
}

type DocumentUploadEvent = BaseAnalyticsEvent & {
  type: "document_upload"
  fileName: string
  size: number
  status: "success" | "error"
}

type TransactionBulkActionEvent = BaseAnalyticsEvent & {
  type: "transaction_bulk_action"
  action: "categorize" | "tag" | "export"
  count: number
  filterIds: string[]
}

type TransactionFilterEvent = BaseAnalyticsEvent & {
  type: "transaction_filter"
  filterId: string
  active: boolean
}

type AutomationDecisionEvent = BaseAnalyticsEvent & {
  type: "automation_decision"
  suggestionId: string
  surface: AutomationSuggestion["surface"]
  category: AutomationSuggestion["category"]
  decision: "accepted" | "declined"
  reason?: string
  scheduledFor?: string
  metrics: Array<Pick<AutomationMetricDelta, "id" | "before" | "after" | "unit">>
}

type AutomationUndoEvent = BaseAnalyticsEvent & {
  type: "automation_undo"
  suggestionId: string
  surface: AutomationSuggestion["surface"]
  category: AutomationSuggestion["category"]
}

type ExperimentExposureEvent = BaseAnalyticsEvent & {
  type: "experiment_exposure"
  flag: FeatureFlagKey
  variant: ExperimentVariant
  cohort: string
}

type OnboardingStepEvent = BaseAnalyticsEvent & {
  type: "onboarding_step"
  stepId: string
  status: "viewed" | "completed"
  progress: number
}

type OnboardingDropoffEvent = BaseAnalyticsEvent & {
  type: "onboarding_dropoff"
  stepId: string
  status: "skipped" | "abandoned"
  reason?: string
  progress: number
}

type FeedbackEvent = BaseAnalyticsEvent & {
  type: "feedback"
  surface: string
  phase: "requested" | "submitted" | "skipped"
  rating?: number
  comment?: string
}

type ShareExportEvent = BaseAnalyticsEvent & {
  type: "share_export"
  surface: string
  format: "pdf" | "csv"
  channel: string
  attribution: string
  items?: number
}

type CohortViewEvent = BaseAnalyticsEvent & {
  type: "cohort_view"
  metric: "activation" | "retention" | "automation"
  cohort: string
  segment?: string
}

type AnalyticsEvent =
  | InsightActionEvent
  | InsightPinEvent
  | InsightResolvedEvent
  | InsightReadStateEvent
  | PreferenceToggleEvent
  | PreferenceSliderEvent
  | DocumentUploadEvent
  | TransactionBulkActionEvent
  | TransactionFilterEvent
  | AutomationDecisionEvent
  | AutomationUndoEvent
  | ExperimentExposureEvent
  | OnboardingStepEvent
  | OnboardingDropoffEvent
  | FeedbackEvent
  | ShareExportEvent
  | CohortViewEvent

const emit = (event: AnalyticsEvent) => {
  if (!shouldLogAnalytics) {
    return
  }

  if (!shouldSampleEvent(event.seed)) {
    return
  }

  const sanitizedEvent = sanitizeForLogging(event)

  // eslint-disable-next-line no-console -- dev-only analytics instrumentation
  analyticsLogger.info(event.type, sanitizedEvent)
}

export function trackInsightAction(payload: { insight: InsightDefinition; action: InsightAction }) {
  const { insight, action } = payload

  emit({
    type: "insight_action",
    insightId: insight.id,
    actionId: action.id,
    actionLabel: action.label,
    category: insight.category,
    topic: insight.topic,
    surfaces: insight.surfaces,
    priority: insight.priority,
    timestamp: new Date().toISOString(),
    seed: insight.id,
  })
}

export function trackInsightPinChange(payload: { insight: InsightDefinition; pinned: boolean }) {
  const { insight, pinned } = payload

  emit({
    type: "insight_pin",
    insightId: insight.id,
    pinned,
    category: insight.category,
    topic: insight.topic,
    timestamp: new Date().toISOString(),
    seed: insight.id,
  })
}

export function trackInsightResolution(payload: { insight: InsightDefinition }) {
  const { insight } = payload

  emit({
    type: "insight_resolved",
    insightId: insight.id,
    category: insight.category,
    topic: insight.topic,
    timestamp: new Date().toISOString(),
    seed: insight.id,
  })
}

export function trackInsightReadState(payload: { insight: InsightDefinition; state: "highlighted" | "read" }) {
  emit({
    type: "insight_read_state",
    insightId: payload.insight.id,
    state: payload.state,
    surface: payload.insight.surfaces,
    timestamp: new Date().toISOString(),
    seed: payload.insight.id,
  })
}

export function trackPreferenceToggle(payload: {
  preferenceId: string
  label: string
  section?: string
  value: boolean
}) {
  emit({
    type: "preference_toggle",
    preferenceId: payload.preferenceId,
    label: payload.label,
    section: payload.section,
    value: payload.value,
    timestamp: new Date().toISOString(),
    seed: payload.preferenceId,
  })
}

export function trackPreferenceSlider(payload: { sliderId: string; label?: string; values: number[] }) {
  emit({
    type: "preference_slider",
    sliderId: payload.sliderId,
    label: payload.label,
    values: payload.values,
    timestamp: new Date().toISOString(),
    seed: payload.sliderId,
  })
}

export function trackDocumentUpload(payload: { fileName: string; status: "success" | "error"; size: number }) {
  emit({
    type: "document_upload",
    fileName: payload.fileName,
    size: payload.size,
    status: payload.status,
    timestamp: new Date().toISOString(),
    seed: payload.fileName,
  })
}

export function trackTransactionBulkAction(payload: {
  action: "categorize" | "tag" | "export"
  count: number
  filterIds: string[]
}) {
  emit({
    type: "transaction_bulk_action",
    action: payload.action,
    count: payload.count,
    filterIds: payload.filterIds,
    timestamp: new Date().toISOString(),
    seed: payload.action,
  })
}

export function trackTransactionFilter(payload: { filterId: string; active: boolean }) {
  emit({
    type: "transaction_filter",
    filterId: payload.filterId,
    active: payload.active,
    timestamp: new Date().toISOString(),
    seed: payload.filterId,
  })
}

export function trackAutomationDecision(payload: {
  suggestion: AutomationSuggestion
  decision: "accepted" | "declined"
  reason?: string
  scheduledFor?: string
}) {
  const { suggestion, decision } = payload

  emit({
    type: "automation_decision",
    suggestionId: suggestion.id,
    surface: suggestion.surface,
    category: suggestion.category,
    decision,
    reason: payload.reason,
    scheduledFor: payload.scheduledFor,
    metrics: suggestion.metrics.map((metric) => ({
      id: metric.id,
      before: metric.before,
      after: metric.after,
      unit: metric.unit,
    })),
    timestamp: new Date().toISOString(),
    seed: suggestion.id,
  })
}

export function trackAutomationUndo(payload: { suggestion: AutomationSuggestion }) {
  const { suggestion } = payload

  emit({
    type: "automation_undo",
    suggestionId: suggestion.id,
    surface: suggestion.surface,
    category: suggestion.category,
    timestamp: new Date().toISOString(),
    seed: suggestion.id,
  })
}

export function trackExperimentExposure(flag: FeatureFlagKey) {
  emit({
    type: "experiment_exposure",
    flag,
    variant: getExperimentVariant(flag),
    cohort: getExperimentCohort(),
    timestamp: new Date().toISOString(),
    seed: flag,
  })
}

export function trackOnboardingStepViewed(payload: { stepId: string; progress: number }) {
  emit({
    type: "onboarding_step",
    stepId: payload.stepId,
    status: "viewed",
    progress: payload.progress,
    timestamp: new Date().toISOString(),
    seed: payload.stepId,
  })
}

export function trackOnboardingStepCompleted(payload: { stepId: string; progress: number }) {
  emit({
    type: "onboarding_step",
    stepId: payload.stepId,
    status: "completed",
    progress: payload.progress,
    timestamp: new Date().toISOString(),
    seed: payload.stepId,
  })
}

export function trackOnboardingDropoff(payload: {
  stepId: string
  progress: number
  reason?: string
  status: "skipped" | "abandoned"
}) {
  emit({
    type: "onboarding_dropoff",
    stepId: payload.stepId,
    status: payload.status,
    reason: payload.reason,
    progress: payload.progress,
    timestamp: new Date().toISOString(),
    seed: payload.stepId,
  })
}

export function trackFeedbackRequested(payload: { surface: string }) {
  emit({
    type: "feedback",
    surface: payload.surface,
    phase: "requested",
    timestamp: new Date().toISOString(),
    seed: payload.surface,
  })
}

export function trackFeedbackSubmitted(payload: {
  surface: string
  rating?: number
  comment?: string
  skipped?: boolean
}) {
  emit({
    type: "feedback",
    surface: payload.surface,
    phase: payload.skipped ? "skipped" : "submitted",
    rating: payload.rating,
    comment: payload.comment,
    timestamp: new Date().toISOString(),
    seed: payload.surface,
  })
}

export function trackShareExport(payload: { surface: string; format: "pdf" | "csv"; channel: string; items?: number }) {
  emit({
    type: "share_export",
    surface: payload.surface,
    format: payload.format,
    channel: payload.channel,
    items: payload.items,
    attribution: getAttributionSource(),
    timestamp: new Date().toISOString(),
    seed: `${payload.surface}:${payload.format}`,
  })
}

export function trackCohortView(payload: { metric: "activation" | "retention" | "automation"; cohort: string; segment?: string }) {
  emit({
    type: "cohort_view",
    metric: payload.metric,
    cohort: payload.cohort,
    segment: payload.segment,
    timestamp: new Date().toISOString(),
    seed: `${payload.metric}:${payload.cohort}`,
  })
}
