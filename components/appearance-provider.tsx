"use client"

import { useEffect } from "react"

type FontScale = "compact" | "default" | "comfort" | "focus"

const APPEARANCE_STORAGE_KEY = "fin-infra-appearance"

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load and apply appearance settings on mount
    if (typeof window === "undefined") {
      return
    }

    try {
      const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY)
      if (!stored) {
        return
      }

      const parsed = JSON.parse(stored) as Partial<{
        fontScale: FontScale
        dyslexia: boolean
        highContrast: boolean
      }>

      const root = document.documentElement

      // Apply font scale
      if (parsed.fontScale && ["compact", "default", "comfort", "focus"].includes(parsed.fontScale)) {
        if (parsed.fontScale === "default") {
          root.removeAttribute("data-font-scale")
        } else {
          root.setAttribute("data-font-scale", parsed.fontScale)
        }
      }

      // Apply dyslexia mode
      if (typeof parsed.dyslexia === "boolean") {
        if (parsed.dyslexia) {
          root.setAttribute("data-dyslexia", "true")
        } else {
          root.removeAttribute("data-dyslexia")
        }
      }

      // Apply high contrast mode
      if (typeof parsed.highContrast === "boolean") {
        if (parsed.highContrast) {
          root.setAttribute("data-contrast", "high")
        } else {
          root.removeAttribute("data-contrast")
        }
      }
    } catch (error) {
      console.error("Failed to load appearance settings:", error)
    }
  }, [])

  return <>{children}</>
}
