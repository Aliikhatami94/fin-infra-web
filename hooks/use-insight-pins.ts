"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useSecureStorage } from "@/hooks/use-secure-storage"
import { insightDefinitions } from "@/lib/insights/definitions"

const STORAGE_KEY = "pinned-insights"

const defaultPinnedIds = insightDefinitions
  .filter((insight) => insight.pinned)
  .map((insight) => insight.id)

function parseStored(value: string | null): Set<string> {
  if (!value) {
    return new Set(defaultPinnedIds)
  }

  try {
    const parsed = JSON.parse(value) as string[]
    if (Array.isArray(parsed)) {
      return new Set(parsed)
    }
  } catch {
    // fall through
  }

  return new Set(defaultPinnedIds)
}

export function useInsightPins() {
  const storage = useSecureStorage({ namespace: "insights" })
  const [hydrated, setHydrated] = useState(false)
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(() => new Set(defaultPinnedIds))
  const persistQueue = useRef<Promise<void>>(Promise.resolve())

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!storage) {
        setHydrated(true)
        return
      }

      try {
        const value = await storage.getItem(STORAGE_KEY)
        if (!cancelled) {
          setPinnedIds(parseStored(value))
        }
      } catch {
        if (!cancelled) {
          setPinnedIds(new Set(defaultPinnedIds))
        }
      } finally {
        if (!cancelled) {
          setHydrated(true)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [storage])

  const persist = useCallback(
    (next: Set<string>) => {
      if (!storage) {
        return
      }

      const payload = JSON.stringify(Array.from(next))

      const persistNext = () => storage.setItem(STORAGE_KEY, payload).catch(() => {})
      persistQueue.current = persistQueue.current.catch(() => {}).then(persistNext)
    },
    [storage],
  )

  const setPinned = useCallback(
    (insightId: string, pinned: boolean) => {
      setPinnedIds((current) => {
        const next = new Set(current)
        if (pinned) {
          next.add(insightId)
        } else {
          next.delete(insightId)
        }
        persist(next)
        return next
      })
    },
    [persist],
  )

  const togglePinned = useCallback(
    (insightId: string) => {
      setPinnedIds((current) => {
        const next = new Set(current)
        if (next.has(insightId)) {
          next.delete(insightId)
        } else {
          next.add(insightId)
        }
        persist(next)
        return next
      })
    },
    [persist],
  )

  const isPinned = useCallback((insightId: string) => pinnedIds.has(insightId), [pinnedIds])

  const value = useMemo(
    () => ({
      hydrated,
      isPinned,
      pinnedIds,
      setPinned,
      togglePinned,
    }),
    [hydrated, isPinned, pinnedIds, setPinned, togglePinned],
  )

  return value
}

