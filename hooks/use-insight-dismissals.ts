"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useSecureStorage } from "@/hooks/use-secure-storage"

const STORAGE_KEY_PREFIX = "resolved-insights"

type UseInsightDismissalsOptions = {
  surface: string
}

type ResolutionState = {
  fromStorage: boolean
  values: Set<string>
}

const FALLBACK_STORAGE_NAMESPACE = "fin-infra-web"

const isBrowser = typeof window !== "undefined"

export function useInsightDismissals({ surface }: UseInsightDismissalsOptions) {
  const storage = useSecureStorage({ namespace: `${STORAGE_KEY_PREFIX}` })
  const [state, setState] = useState<ResolutionState>({ fromStorage: false, values: new Set() })
  const isMounted = useRef(false)
  const hasHydrated = useRef(false)

  const storageKey = useMemo(() => `${surface}::resolved`, [surface])

  useEffect(() => {
    if (hasHydrated.current) {
      return
    }

    let cancelled = false

    async function hydrate() {
      if (storage) {
        try {
          const stored = await storage.getItem(storageKey)
          if (!cancelled) {
            const parsed = stored ? (JSON.parse(stored) as string[]) : []
            setState({ fromStorage: true, values: new Set(parsed) })
            hasHydrated.current = true
          }
          return
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            // eslint-disable-next-line no-console -- hydration failures should surface during development
            console.warn("Failed to hydrate insight dismissals from secure storage", error)
          }
        }
      }

      if (!cancelled) {
        if (isBrowser) {
          try {
            const fallbackKey = `${FALLBACK_STORAGE_NAMESPACE}:${STORAGE_KEY_PREFIX}:${storageKey}`
            const stored = window.localStorage.getItem(fallbackKey)
            const parsed = stored ? (JSON.parse(stored) as string[]) : []
            setState({ fromStorage: true, values: new Set(parsed) })
            hasHydrated.current = true
            return
          } catch (error) {
            if (process.env.NODE_ENV === "development") {
              // eslint-disable-next-line no-console -- hydration failures should surface during development
              console.warn("Failed to hydrate insight dismissals from localStorage", error)
            }
          }
        }

        setState({ fromStorage: true, values: new Set() })
        hasHydrated.current = true
      }
    }

    void hydrate()

    return () => {
      cancelled = true
    }
  }, [storage, storageKey])

  useEffect(() => {
    if (!state.fromStorage) {
      return
    }

    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    const payload = JSON.stringify(Array.from(state.values))

    async function persist() {
      if (storage) {
        try {
          await storage.setItem(storageKey, payload)
          return
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            // eslint-disable-next-line no-console -- persisting failures should surface during development
            console.warn("Failed to persist insight dismissals to secure storage", error)
          }
        }
      }

      if (isBrowser) {
        try {
          const fallbackKey = `${FALLBACK_STORAGE_NAMESPACE}:${STORAGE_KEY_PREFIX}:${storageKey}`
          window.localStorage.setItem(fallbackKey, payload)
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            // eslint-disable-next-line no-console -- persisting failures should surface during development
            console.warn("Failed to persist insight dismissals to localStorage", error)
          }
        }
      }
    }

    void persist()
  }, [state, storage, storageKey])

  const dismiss = useCallback((insightId: string) => {
    setState((previous) => {
      const next = new Set(previous.values)
      next.add(insightId)
      return { ...previous, values: next }
    })
  }, [])

  const reset = useCallback(() => {
    setState((previous) => ({ ...previous, values: new Set() }))
  }, [])

  const undismiss = useCallback((insightId: string) => {
    setState((previous) => {
      const next = new Set(previous.values)
      next.delete(insightId)
      return { ...previous, values: next }
    })
  }, [])

  const isDismissed = useCallback((insightId: string) => state.values.has(insightId), [state.values])

  return {
    dismiss,
    undismiss,
    reset,
    isDismissed,
    resolvedIds: Array.from(state.values),
    hydrated: state.fromStorage,
  }
}
