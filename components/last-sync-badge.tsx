"use client"

import { Clock, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { useConnectivity } from "@/components/connectivity-provider"

interface LastSyncBadgeProps {
  timestamp: string
  source?: string
  className?: string
}

export function LastSyncBadge({ timestamp, source, className }: LastSyncBadgeProps) {
  const { isOffline } = useConnectivity()

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] text-muted-foreground",
        isOffline ? "bg-amber-500/15 text-amber-900 dark:text-amber-100" : "bg-muted/50",
        className,
      )}
    >
      {isOffline ? <WifiOff className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
      <span>
        {isOffline ? `Stale · ${timestamp}` : timestamp}
        {source && <span className="text-muted-foreground/70"> via {source}</span>}
      </span>
    </div>
  )
}
