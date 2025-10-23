"use client"

import { createContext, useContext, useMemo } from "react"

import { useOfflineStatus, type OfflineStatus } from "@/hooks/use-offline-status"

const ConnectivityContext = createContext<OfflineStatus | null>(null)

export function ConnectivityProvider({ children }: { children: React.ReactNode }) {
  const status = useOfflineStatus()
  const value = useMemo(() => status, [status])

  return <ConnectivityContext.Provider value={value}>{children}</ConnectivityContext.Provider>
}

export function useConnectivity() {
  const context = useContext(ConnectivityContext)
  if (!context) {
    throw new Error("useConnectivity must be used within a ConnectivityProvider")
  }
  return context
}
