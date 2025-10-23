import type { InsightAction, InsightDefinition } from "@/lib/insights/definitions"
import { createRedactingLogger, sanitizeForLogging } from "@/lib/security/redaction"

const shouldLogAnalytics = process.env.NODE_ENV === "development"
const analyticsLogger = createRedactingLogger("analytics")

type BaseAnalyticsEvent = {
  timestamp: string
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

type AnalyticsEvent =
  | InsightActionEvent
  | InsightPinEvent
  | InsightResolvedEvent
  | PreferenceToggleEvent
  | PreferenceSliderEvent
  | DocumentUploadEvent
  | TransactionBulkActionEvent
  | TransactionFilterEvent

const emit = (event: AnalyticsEvent) => {
  if (!shouldLogAnalytics) {
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
  })
}

export function trackPreferenceSlider(payload: { sliderId: string; label?: string; values: number[] }) {
  emit({
    type: "preference_slider",
    sliderId: payload.sliderId,
    label: payload.label,
    values: payload.values,
    timestamp: new Date().toISOString(),
  })
}

export function trackDocumentUpload(payload: { fileName: string; status: "success" | "error"; size: number }) {
  emit({
    type: "document_upload",
    fileName: payload.fileName,
    size: payload.size,
    status: payload.status,
    timestamp: new Date().toISOString(),
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
  })
}

export function trackTransactionFilter(payload: { filterId: string; active: boolean }) {
  emit({
    type: "transaction_filter",
    filterId: payload.filterId,
    active: payload.active,
    timestamp: new Date().toISOString(),
  })
}
