"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

import { useSecureStorage } from "@/hooks/use-secure-storage"

type PrivacyContextValue = {
  masked: boolean
  toggleMasked: () => void
  setMasked: (v: boolean) => void
}

const PrivacyContext = createContext<PrivacyContextValue | undefined>(undefined)

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [masked, setMaskedState] = useState<boolean>(true)
  const secureStorage = useSecureStorage({ namespace: "privacy" })

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
    setMaskedState(v)
    secureStorage?.setItem("masked", String(v)).catch(() => {})
  }, [secureStorage])

  const toggleMasked = useCallback(() => setMasked(!masked), [masked, setMasked])

  const value = useMemo(() => ({ masked, toggleMasked, setMasked }), [masked, toggleMasked, setMasked])

  return <PrivacyContext.Provider value={value}>{children}</PrivacyContext.Provider>
}

export function usePrivacy() {
  const ctx = useContext(PrivacyContext)
  if (!ctx) throw new Error("usePrivacy must be used within a PrivacyProvider")
  return ctx
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
