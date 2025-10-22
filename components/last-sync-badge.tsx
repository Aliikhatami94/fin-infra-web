"use client"

import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface LastSyncBadgeProps {
  timestamp: string
  source?: string
  className?: string
}

export function LastSyncBadge({ timestamp, source, className }: LastSyncBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50 text-[10px] text-muted-foreground",
        className,
      )}
    >
      <Clock className="h-2.5 w-2.5" />
      <span>
        {timestamp}
        {source && <span className="text-muted-foreground/70"> via {source}</span>}
      </span>
    </div>
  )
}
