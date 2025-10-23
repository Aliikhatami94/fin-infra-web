"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

import { useSecureStorage } from "@/hooks/use-secure-storage"
import type { DashboardPersona, PersonaDefinition } from "@/types/domain"

const PERSONA_STORAGE_KEY = "activePersona"

const personaDefinitions: PersonaDefinition[] = [
  {
    id: "wealth_builder",
    label: "Wealth Builder",
    description: "Focus on compounding returns, long-term investing, and portfolio health.",
    spotlight: "Keep growth plans ahead of market benchmarks.",
    highlightTone: "info",
  },
  {
    id: "debt_destroyer",
    label: "Debt Destroyer",
    description: "Aggressively reduce liabilities and protect credit momentum.",
    spotlight: "Shrink balances and celebrate payoff milestones.",
    highlightTone: "warning",
  },
  {
    id: "stability_seeker",
    label: "Stability Seeker",
    description: "Grow buffers, improve cash confidence, and safeguard against shocks.",
    spotlight: "Extend runway and maintain savings streaks.",
    highlightTone: "success",
  },
]

interface PersonaContextValue {
  persona: DashboardPersona
  setPersona: (persona: DashboardPersona) => void
  definition: PersonaDefinition
  definitions: PersonaDefinition[]
  isHydrated: boolean
}

const PersonaContext = createContext<PersonaContextValue | undefined>(undefined)

const isDashboardPersona = (value: string): value is DashboardPersona => {
  return personaDefinitions.some((definition) => definition.id === value)
}

export function PersonaProvider({ children }: { children: ReactNode }) {
  const secureStorage = useSecureStorage({ namespace: "persona" })
  const [persona, setPersona] = useState<DashboardPersona>("wealth_builder")
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    let active = true

    const loadPersona = async () => {
      if (!secureStorage) {
        setIsHydrated(true)
        return
      }

      try {
        const storedValue = await secureStorage.getItem(PERSONA_STORAGE_KEY)
        if (storedValue && isDashboardPersona(storedValue) && active) {
          setPersona(storedValue)
        }
      } finally {
        if (active) {
          setIsHydrated(true)
        }
      }
    }

    loadPersona()

    return () => {
      active = false
    }
  }, [secureStorage])

  const handleSetPersona = useCallback(
    (nextPersona: DashboardPersona) => {
      setPersona(nextPersona)
      if (secureStorage) {
        void secureStorage.setItem(PERSONA_STORAGE_KEY, nextPersona)
      }
    },
    [secureStorage],
  )

  const definition = useMemo(() => {
    return personaDefinitions.find((item) => item.id === persona) ?? personaDefinitions[0]
  }, [persona])

  const value = useMemo<PersonaContextValue>(
    () => ({
      persona,
      setPersona: handleSetPersona,
      definition,
      definitions: personaDefinitions,
      isHydrated,
    }),
    [definition, handleSetPersona, isHydrated, persona],
  )

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
}

export function usePersona() {
  const context = useContext(PersonaContext)
  if (!context) {
    throw new Error("usePersona must be used within a PersonaProvider")
  }
  return context
}

export function usePersonaDefinitions() {
  const context = usePersona()
  return context.definitions
}
