"use client"

import { useMemo, useState, useEffect } from "react"
import { AlertTriangle, Wifi, WifiOff } from "lucide-react"
import { formatDistanceToNowStrict } from "date-fns"

import { cn } from "@/lib/utils"
import { useConnectivity } from "@/components/connectivity-provider"

export function OfflineBanner() {
  const { status, lastSyncedAt, isOffline } = useConnectivity()
  const [showOnlineBadge, setShowOnlineBadge] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)
  
  // Show online badge temporarily when reconnecting
  useEffect(() => {
    if (wasOffline && !isOffline) {
      // Just reconnected
      setShowOnlineBadge(true)
      const timer = setTimeout(() => setShowOnlineBadge(false), 3000)
      return () => clearTimeout(timer)
    }
    
    if (isOffline) {
      setWasOffline(true)
      setShowOnlineBadge(false)
    }
  }, [isOffline, wasOffline])

  const message = useMemo(() => {
    // Skip showing banner during initialization - let skeleton/loading handle this
    if (status === "initializing") {
      return null
    }

    if (isOffline) {
      return {
        icon: WifiOff,
        label: lastSyncedAt
          ? `Offline · Last synced ${formatDistanceToNowStrict(lastSyncedAt, { addSuffix: true })}`
          : "Offline · Sync pending",
        className: "bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100 border-amber-200 dark:border-amber-800",
      }
    }

    // Only show online badge temporarily after reconnecting
    if (showOnlineBadge && lastSyncedAt) {
      return {
        icon: Wifi,
        label: `Back online · Synced ${formatDistanceToNowStrict(lastSyncedAt, { addSuffix: true })}`,
        className: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800",
      }
    }

    return null
  }, [isOffline, lastSyncedAt, status, showOnlineBadge])

  if (!message) {
    return null
  }

  const Icon = message.icon

  return (
    <div
      className={cn(
        "sticky top-16 z-40 flex items-center justify-center gap-2 border-b px-4 py-2.5 text-sm font-medium md:px-6 transition-colors",
        message.className,
      )}
      role={status === "initializing" ? "status" : isOffline ? "alert" : "status"}
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" aria-hidden />
        <span>{message.label}</span>
        {isOffline && (
          <span className="ml-2 flex items-center gap-1.5 text-xs opacity-90">
            <AlertTriangle className="h-3.5 w-3.5" />
            Automations paused
          </span>
        )}
      </div>
    </div>
  )
}
