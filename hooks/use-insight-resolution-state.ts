"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useSecureStorage } from "@/hooks/use-secure-storage"

const STORAGE_KEY = "resolved-insights"

function parseStored(value: string | null): Set<string> {
  if (!value) {
    return new Set()
  }

  try {
    const parsed = JSON.parse(value) as string[]
    if (Array.isArray(parsed)) {
      return new Set(parsed)
    }
  } catch {
    // fall through to empty set
  }

  return new Set()
}

export function useInsightResolutionState() {
  const storage = useSecureStorage({ namespace: "insights" })
  const [hydrated, setHydrated] = useState(false)
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(() => new Set())
  const persistQueue = useRef<Promise<void>>(Promise.resolve())

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!storage) {
        setHydrated(true)
        return
      }

      try {
        const stored = await storage.getItem(STORAGE_KEY)
        if (!cancelled) {
          setResolvedIds(parseStored(stored))
        }
      } catch {
        if (!cancelled) {
          setResolvedIds(new Set())
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

  const setResolved = useCallback(
    (insightId: string, resolved: boolean) => {
      setResolvedIds((current) => {
        const next = new Set(current)
        if (resolved) {
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

  const markResolved = useCallback((insightId: string) => {
    setResolved(insightId, true)
  }, [setResolved])

  const markUnresolved = useCallback((insightId: string) => {
    setResolved(insightId, false)
  }, [setResolved])

  return useMemo(
    () => ({
      hydrated,
      resolvedIds,
      markResolved,
      markUnresolved,
      setResolved,
    }),
    [hydrated, markResolved, markUnresolved, resolvedIds, setResolved],
  )
}
