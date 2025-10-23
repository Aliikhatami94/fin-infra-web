"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useSecureStorage } from "@/hooks/use-secure-storage"

const STORAGE_KEY = "preferences"

type InsightPreferences = {
  hideResolved: boolean
}

const DEFAULT_PREFERENCES: InsightPreferences = {
  hideResolved: false,
}

function parseStoredPreferences(raw: string | null): InsightPreferences {
  if (!raw) {
    return DEFAULT_PREFERENCES
  }

  try {
    const parsed = JSON.parse(raw) as Partial<InsightPreferences>
    if (parsed && typeof parsed.hideResolved === "boolean") {
      return { hideResolved: parsed.hideResolved }
    }
  } catch {
    // Ignore malformed payloads and fall back to defaults
  }

  return DEFAULT_PREFERENCES
}

export function useInsightPreferences() {
  const storage = useSecureStorage({ namespace: "insights" })
  const [hydrated, setHydrated] = useState(false)
  const [preferences, setPreferences] = useState<InsightPreferences>(DEFAULT_PREFERENCES)
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
          setPreferences(parseStoredPreferences(stored))
        }
      } catch {
        if (!cancelled) {
          setPreferences(DEFAULT_PREFERENCES)
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
    (next: InsightPreferences) => {
      if (!storage) {
        return
      }

      const payload = JSON.stringify(next)
      const persistNext = () => storage.setItem(STORAGE_KEY, payload).catch(() => {})
      persistQueue.current = persistQueue.current.catch(() => {}).then(persistNext)
    },
    [storage],
  )

  const updatePreferences = useCallback(
    (updater: Partial<InsightPreferences> | ((current: InsightPreferences) => InsightPreferences)) => {
      setPreferences((current) => {
        const next = typeof updater === "function" ? (updater as (value: InsightPreferences) => InsightPreferences)(current) : {
            ...current,
            ...updater,
          }

        persist(next)
        return next
      })
    },
    [persist],
  )

  const setHideResolved = useCallback(
    (value: boolean) => {
      updatePreferences({ hideResolved: value })
    },
    [updatePreferences],
  )

  const toggleHideResolved = useCallback(() => {
    updatePreferences((current) => ({ ...current, hideResolved: !current.hideResolved }))
  }, [updatePreferences])

  return useMemo(
    () => ({
      hydrated,
      hideResolved: preferences.hideResolved,
      setHideResolved,
      toggleHideResolved,
    }),
    [hydrated, preferences.hideResolved, setHideResolved, toggleHideResolved],
  )
}
