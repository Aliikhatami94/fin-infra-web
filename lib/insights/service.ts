import { insightDefinitions } from "./definitions"
import type { InsightCategory, InsightDefinition, InsightSurface } from "./definitions"
import type { DashboardPersona } from "@/types/domain"

export interface InsightQuery {
  surface?: InsightSurface | InsightSurface[]
  category?: InsightCategory | InsightCategory[]
  search?: string
  limit?: number
  offset?: number
  pinnedOnly?: boolean
  priority?: "low" | "medium" | "high"
}

const normalizeArray = <T,>(value?: T | T[]): T[] | undefined => {
  if (!value) return undefined
  return Array.isArray(value) ? value : [value]
}

const matchesSearch = (insight: InsightDefinition, search?: string) => {
  if (!search) return true
  const normalized = search.trim().toLowerCase()
  if (!normalized) return true
  return (
    insight.title.toLowerCase().includes(normalized) ||
    insight.body.toLowerCase().includes(normalized) ||
    insight.topic.toLowerCase().includes(normalized)
  )
}

const priorityWeight: Record<"low" | "medium" | "high", number> = {
  low: 0,
  medium: 1,
  high: 2,
}

export function getInsights(query: InsightQuery = {}): InsightDefinition[] {
  const surfaces = normalizeArray(query.surface)
  const categories = normalizeArray(query.category)
  const priorities = normalizeArray(query.priority)

  let results = insightDefinitions.filter((insight) => {
    const matchesSurface = surfaces ? insight.surfaces.some((surface) => surfaces.includes(surface)) : true
    const matchesCategory = categories ? categories.includes(insight.category) : true
    const matchesPriority = priorities ? priorities.includes(insight.priority ?? "medium") : true

    return matchesSurface && matchesCategory && matchesPriority && matchesSearch(insight, query.search)
  })

  if (query.pinnedOnly) {
    results = results.filter((insight) => insight.pinned)
  }

  results = [...results].sort((a, b) => {
    const aPinned = a.pinned ? 1 : 0
    const bPinned = b.pinned ? 1 : 0

    if (aPinned !== bPinned) {
      return bPinned - aPinned
    }

    const aPriority = priorityWeight[a.priority ?? "medium"]
    const bPriority = priorityWeight[b.priority ?? "medium"]

    if (aPriority !== bPriority) {
      return bPriority - aPriority
    }

    return a.title.localeCompare(b.title)
  })

  const offset = Math.max(query.offset ?? 0, 0)
  const limit = query.limit ?? results.length

  return results.slice(offset, offset + limit)
}

export async function fetchInsights(query: InsightQuery = {}): Promise<InsightDefinition[]> {
  const insights = getInsights(query)
  return new Promise((resolve) => {
    setTimeout(() => resolve(insights), 50)
  })
}

export function getInsightById(id: string): InsightDefinition | undefined {
  return insightDefinitions.find((insight) => insight.id === id)
}

interface TimelinePoint {
  actual: number
  planned: number
}

const personaFocusMap: Record<DashboardPersona, string> = {
  wealth_builder: "growth plan",
  debt_destroyer: "paydown roadmap",
  stability_seeker: "stability track",
}

export function summarizeTimelinePerformance({
  points,
  persona,
  milestoneHits,
}: {
  points: TimelinePoint[]
  persona: DashboardPersona
  milestoneHits: number
}): string {
  if (!points.length) {
    return "Timeline data is unavailable right now."
  }

  const latest = points[points.length - 1]
  const delta = latest.actual - latest.planned
  const deltaPct = latest.planned === 0 ? 0 : (delta / latest.planned) * 100
  const direction = delta >= 0 ? "ahead" : "behind"
  const absDelta = Math.abs(delta)
  const personaFocus = personaFocusMap[persona]
  const milestoneCopy =
    milestoneHits > 0
      ? `You've hit ${milestoneHits} planned milestone${milestoneHits > 1 ? "s" : ""} this period.`
      : "No planned milestones completed yet—keep the momentum going."

  const deltaCopy = `Actual balance is ${direction} of plan by $${absDelta.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} (${deltaPct.toFixed(1)}%).`

  if (direction === "ahead") {
    return `${deltaCopy} ${milestoneCopy} Your ${personaFocus} is compounding faster than expected.`
  }

  return `${deltaCopy} ${milestoneCopy} Adjust contributions or timing to realign your ${personaFocus}.`
}
