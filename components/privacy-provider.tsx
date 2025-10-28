"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useSearchParams } from "next/navigation"

import { useSecureStorage } from "@/hooks/use-secure-storage"
import { isMarketingMode } from "@/lib/marketingMode"

type PrivacyContextValue = {
  masked: boolean
  toggleMasked: () => void
  setMasked: (v: boolean) => void
}

const PrivacyContext = createContext<PrivacyContextValue | undefined>(undefined)

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [masked, setMaskedState] = useState<boolean>(true)
  const searchParams = useSearchParams()
  const secureStorage = useSecureStorage({ namespace: "privacy" })
  
  // In marketing mode, always show values (masked = false)
  const inMarketingMode = isMarketingMode(searchParams)

  // hydrate from localStorage on client
  useEffect(() => {
    let mounted = true

    if (!secureStorage) {
      return () => {
        mounted = false
      }
    }

    secureStorage
      .getItem("masked")
      .then((raw) => {
        if (!mounted || raw == null) return
        setMaskedState(raw === "true")
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [secureStorage])

  const setMasked = useCallback((v: boolean) => {
    // In marketing mode, always keep unmasked
    if (inMarketingMode) return
    
    setMaskedState(v)
    secureStorage?.setItem("masked", String(v)).catch(() => {})
  }, [secureStorage, inMarketingMode])

  const toggleMasked = useCallback(() => setMasked(!masked), [masked, setMasked])

  // Return unmasked state in marketing mode
  const effectiveMasked = inMarketingMode ? false : masked
  const value = useMemo(() => ({ masked: effectiveMasked, toggleMasked, setMasked }), [effectiveMasked, toggleMasked, setMasked])

  return <PrivacyContext.Provider value={value}>{children}</PrivacyContext.Provider>
}

export function usePrivacy() {
  const ctx = useContext(PrivacyContext)
  if (!ctx) throw new Error("usePrivacy must be used within a PrivacyProvider")
  return ctx
}

export function useMaskToggleDetails() {
  const { masked, toggleMasked, setMasked } = usePrivacy()
  const Icon = masked ? EyeOff : Eye
  const label = masked ? "Show amounts" : "Hide amounts"

  return {
    masked,
    toggleMasked,
    setMasked,
    label,
    Icon,
  }
}

// A value component that masks its children visually while keeping accessible name/description optional
export function MaskableValue({
  value,
  maskedFallback = "••••",
  srLabel,
  className,
}: {
  value: React.ReactNode
  maskedFallback?: React.ReactNode
  srLabel?: string
  className?: string
}) {
  const { masked } = usePrivacy()
  return (
    <span className={className} aria-label={typeof srLabel === "string" ? srLabel : undefined}>
      {masked ? maskedFallback : value}
    </span>
  )
}
