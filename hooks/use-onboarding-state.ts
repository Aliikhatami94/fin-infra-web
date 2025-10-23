"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useSecureStorage } from "@/hooks/use-secure-storage"
import type {
  LinkedInstitution,
  OnboardingPersona,
  OnboardingState,
  OnboardingStatus,
} from "@/types/domain"

const STORAGE_KEY = "state"
const FALLBACK_STORAGE_KEY = "onboarding::state"

const defaultState: OnboardingState = {
  status: "not_started",
  completedSteps: [],
  persona: undefined,
  linkedInstitutions: [],
  lastUpdated: new Date().toISOString(),
  skippedAt: undefined,
}

function readFallback(): OnboardingState | null {
  if (typeof window === "undefined") return null
  try {
    const stored = window.sessionStorage.getItem(FALLBACK_STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored) as OnboardingState
  } catch {
    return null
  }
}

function writeFallback(state: OnboardingState) {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore fallback persistence errors
  }
}

type UpdateFn = (state: OnboardingState) => OnboardingState

export function useOnboardingState() {
  const secureStorage = useSecureStorage({ namespace: "onboarding" })
  const [hydrated, setHydrated] = useState(false)
  const [state, setState] = useState<OnboardingState>(defaultState)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        if (secureStorage) {
          const stored = await secureStorage.getItem(STORAGE_KEY)
          if (stored && !cancelled) {
            setState(JSON.parse(stored) as OnboardingState)
          }
        } else {
          const fallback = readFallback()
          if (fallback && !cancelled) {
            setState(fallback)
          }
        }
      } catch {
        // ignore hydration failures; we'll fall back to defaults
      } finally {
        if (!cancelled) {
          setHydrated(true)
        }
      }
    }

    if (!hydrated) {
      void load()
    }

    return () => {
      cancelled = true
    }
  }, [hydrated, secureStorage])

  const persistenceQueue = useRef<Promise<void>>(Promise.resolve())

  const persist = useCallback(
    (next: OnboardingState) => {
      const persistNext = async () => {
        if (secureStorage) {
          try {
            await secureStorage.setItem(STORAGE_KEY, JSON.stringify(next))
            return
          } catch {
            // fall through to fallback persistence
          }
        }

        writeFallback(next)
      }

      persistenceQueue.current = persistenceQueue.current
        .catch(() => undefined)
        .then(persistNext)

      return persistenceQueue.current
    },
    [secureStorage],
  )

  const applyUpdate = useCallback(
    (updater: UpdateFn) => {
      setState((current) => {
        const next = updater(current)
        void persist(next)
        return next
      })
    },
    [persist],
  )

  const markStatus = useCallback(
    (status: OnboardingStatus) => {
      applyUpdate((current) => ({
        ...current,
        status,
        lastUpdated: new Date().toISOString(),
        skippedAt: status === "skipped" ? new Date().toISOString() : current.skippedAt,
      }))
    },
    [applyUpdate],
  )

  const markStepComplete = useCallback(
    (step: string) => {
      applyUpdate((current) => {
        const completed = new Set(current.completedSteps)
        completed.add(step)
        return {
          ...current,
          completedSteps: Array.from(completed),
          lastUpdated: new Date().toISOString(),
        }
      })
    },
    [applyUpdate],
  )

  const unlinkInstitution = useCallback(
    (institutionId: string) => {
      applyUpdate((current) => ({
        ...current,
        linkedInstitutions: current.linkedInstitutions.filter((institution) => institution.id !== institutionId),
        lastUpdated: new Date().toISOString(),
      }))
    },
    [applyUpdate],
  )

  const upsertInstitution = useCallback(
    (institution: LinkedInstitution) => {
      applyUpdate((current) => {
        const existing = current.linkedInstitutions.filter((item) => item.id !== institution.id)
        return {
          ...current,
          linkedInstitutions: [...existing, institution],
          lastUpdated: new Date().toISOString(),
        }
      })
    },
    [applyUpdate],
  )

  const updatePersona = useCallback(
    (persona: OnboardingPersona) => {
      applyUpdate((current) => ({
        ...current,
        persona,
        lastUpdated: new Date().toISOString(),
      }))
    },
    [applyUpdate],
  )

  const progress = useMemo(() => {
    const totalSteps = 3 as number
    return Math.min(100, Math.round((state.completedSteps.length / totalSteps) * 100))
  }, [state.completedSteps.length])

  return {
    state,
    hydrated,
    markStatus,
    markStepComplete,
    upsertInstitution,
    unlinkInstitution,
    updatePersona,
    progress,
  }
}
