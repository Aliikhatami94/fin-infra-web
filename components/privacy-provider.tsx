"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

type PrivacyContextValue = {
  masked: boolean
  toggleMasked: () => void
  setMasked: (v: boolean) => void
}

const PrivacyContext = createContext<PrivacyContextValue | undefined>(undefined)

const STORAGE_KEY = "ui.masked"

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [masked, setMaskedState] = useState<boolean>(true)

  // hydrate from localStorage on client
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw != null) setMaskedState(raw === "true")
    } catch {}
  }, [])

  const setMasked = useCallback((v: boolean) => {
    setMaskedState(v)
    try {
      window.localStorage.setItem(STORAGE_KEY, String(v))
    } catch {}
  }, [])

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
