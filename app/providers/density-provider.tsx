"use client"

import * as React from "react"

type Density = "comfortable" | "compact"

interface DensityContextValue {
  density: Density
  setDensity: (density: Density) => void
  toggleDensity: () => void
}

const DensityContext = React.createContext<DensityContextValue | undefined>(undefined)

const STORAGE_KEY = "ui::density-mode"

function resolveInitialDensity(): Density {
  if (typeof window === "undefined") {
    return "comfortable"
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "comfortable" || stored === "compact") {
      return stored
    }
  } catch {
    // ignore read errors
  }

  const prefersCompact =
    window.innerWidth <= 1280 ||
    (typeof window.matchMedia === "function" &&
      (window.matchMedia("(max-width: 1280px)").matches || window.matchMedia("(pointer: coarse)").matches))

  return prefersCompact ? "compact" : "comfortable"
}

export function DensityProvider({ children }: { children: React.ReactNode }) {
  const [density, setDensity] = React.useState<Density>(() => resolveInitialDensity())
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const resolved = resolveInitialDensity()
    setDensity(resolved)
    setHydrated(true)
  }, [])

  React.useEffect(() => {
    if (typeof document === "undefined") return
    document.documentElement.dataset.density = density

    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, density)
    } catch {
      // ignore write errors
    }
  }, [density, hydrated])

  const toggleDensity = React.useCallback(() => {
    setDensity((prev) => (prev === "comfortable" ? "compact" : "comfortable"))
  }, [])

  const value = React.useMemo(
    () => ({
      density,
      setDensity,
      toggleDensity,
    }),
    [density, toggleDensity],
  )

  return <DensityContext.Provider value={value}>{children}</DensityContext.Provider>
}

export function useDensity() {
  const context = React.useContext(DensityContext)
  if (!context) {
    throw new Error("useDensity must be used within a DensityProvider")
  }
  return context
}
