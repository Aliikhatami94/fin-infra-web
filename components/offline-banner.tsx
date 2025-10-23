"use client"

import { useMemo } from "react"
import { AlertTriangle, Wifi, WifiOff } from "lucide-react"
import { formatDistanceToNowStrict } from "date-fns"

import { cn } from "@/lib/utils"
import { useConnectivity } from "@/components/connectivity-provider"

export function OfflineBanner() {
  const { status, lastSyncedAt, isOffline } = useConnectivity()

  const message = useMemo(() => {
    if (status === "initializing") {
      return {
        icon: Wifi,
        label: "Checking connection…",
        className: "bg-muted/60 text-muted-foreground",
      }
    }

    if (isOffline) {
      return {
        icon: WifiOff,
        label: lastSyncedAt
          ? `Offline mode · Last synced ${formatDistanceToNowStrict(lastSyncedAt, { addSuffix: true })}`
          : "Offline mode · Sync pending",
        className: "bg-amber-500/10 text-amber-900 dark:text-amber-100",
      }
    }

    if (lastSyncedAt) {
      return {
        icon: Wifi,
        label: `Online · Synced ${formatDistanceToNowStrict(lastSyncedAt, { addSuffix: true })}`,
        className: "bg-success/10 text-success dark:text-success-foreground/90",
      }
    }

    return null
  }, [isOffline, lastSyncedAt, status])

  if (!message || (!isOffline && status !== "initializing")) {
    return null
  }

  const Icon = message.icon

  return (
    <div
      className={cn(
        "sticky top-16 z-40 flex items-center gap-2 border-b border-border/60 px-4 py-2 text-sm font-medium md:px-6",
        message.className,
      )}
      role={status === "initializing" ? "status" : isOffline ? "alert" : "status"}
      aria-live="polite"
    >
      <Icon className="h-4 w-4" aria-hidden />
      <span className="truncate">{message.label}</span>
      {isOffline ? (
        <span className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-200">
          <AlertTriangle className="h-3 w-3" /> Automations paused
        </span>
      ) : null}
    </div>
  )
}
