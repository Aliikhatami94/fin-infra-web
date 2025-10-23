import { insightDefinitions } from "./definitions"
import type { InsightCategory, InsightDefinition, InsightSurface } from "./definitions"

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
