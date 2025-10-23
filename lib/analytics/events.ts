import type { InsightAction, InsightDefinition } from "@/lib/insights/definitions"

const shouldLogAnalytics = process.env.NODE_ENV === "development"

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

type AnalyticsEvent =
  | InsightActionEvent
  | InsightPinEvent
  | InsightResolvedEvent
  | PreferenceToggleEvent
  | PreferenceSliderEvent

const emit = (event: AnalyticsEvent) => {
  if (!shouldLogAnalytics) {
    return
  }

  // eslint-disable-next-line no-console -- dev-only analytics instrumentation
  console.info(`[analytics] ${event.type}`, event)
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
