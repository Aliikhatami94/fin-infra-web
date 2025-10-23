"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useSecureStorage } from "@/hooks/use-secure-storage"

const STORAGE_KEY = "read-insights"

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
    // fall through
  }

  return new Set()
}

export function useInsightReadState() {
  const storage = useSecureStorage({ namespace: "insights" })
  const [hydrated, setHydrated] = useState(false)
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set())
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
          setReadIds(parseStored(value))
        }
      } catch {
        if (!cancelled) {
          setReadIds(new Set())
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

  const markRead = useCallback(
    (insightId: string) => {
      setReadIds((current) => {
        if (current.has(insightId)) {
          return current
        }
        const next = new Set(current)
        next.add(insightId)
        persist(next)
        return next
      })
    },
    [persist],
  )

  const markUnread = useCallback((insightId: string) => {
    setReadIds((current) => {
      if (!current.has(insightId)) {
        return current
      }
      const next = new Set(current)
      next.delete(insightId)
      persist(next)
      return next
    })
  }, [persist])

  const isUnread = useCallback((insightId: string) => !readIds.has(insightId), [readIds])

  const value = useMemo(
    () => ({
      hydrated,
      isUnread,
      markRead,
      markUnread,
      readIds,
    }),
    [hydrated, isUnread, markRead, markUnread, readIds],
  )

  return value
}
