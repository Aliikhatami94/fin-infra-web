import type React from "react"
import { cn } from "@/lib/utils"

const radiusMap = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
} as const

type RoundedKey = keyof typeof radiusMap

interface SkeletonProps {
  className?: string
  rounded?: RoundedKey
  style?: React.CSSProperties
}

export function Skeleton({ className, rounded = "md", style }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted/70",
        radiusMap[rounded],
        className,
      )}
      style={style}
      aria-hidden="true"
    />
  )
}
