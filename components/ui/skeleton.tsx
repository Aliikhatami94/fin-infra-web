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
}

export function Skeleton({ className, rounded = "md" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted/70",
        radiusMap[rounded],
        className,
      )}
      aria-hidden="true"
    />
  )
}
