"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useSecureStorage } from "@/hooks/use-secure-storage"
import { insightDefinitions } from "@/lib/insights/definitions"
import { namespacedKey } from "@/lib/security/secure-storage"

const STORAGE_KEY = "pinned-insights"
const FALLBACK_STORAGE_KEY = namespacedKey("insights", STORAGE_KEY)

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
      try {
        if (storage) {
          const value = await storage.getItem(STORAGE_KEY)
          if (!cancelled) {
            setPinnedIds(parseStored(value))
          }
        } else if (typeof window !== "undefined") {
          const value = window.localStorage.getItem(FALLBACK_STORAGE_KEY)
          if (!cancelled) {
            setPinnedIds(parseStored(value))
          }
        } else if (!cancelled) {
          setPinnedIds(new Set(defaultPinnedIds))
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
      const payload = JSON.stringify(Array.from(next))

      if (storage) {
        const persistNext = () => storage.setItem(STORAGE_KEY, payload).catch(() => {})
        persistQueue.current = persistQueue.current.catch(() => {}).then(persistNext)
        return
      }

      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(FALLBACK_STORAGE_KEY, payload)
        } catch {
          // Swallow errors when localStorage is unavailable (e.g., private mode)
        }
      }
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

