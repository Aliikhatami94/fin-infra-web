"use client"

import { useId, type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface AccessibleChartProps {
  title: string
  description: string
  children: ReactNode
  className?: string
  contentClassName?: string
}

export function AccessibleChart({
  title,
  description,
  children,
  className,
  contentClassName,
}: AccessibleChartProps) {
  const captionId = useId()

  return (
    <figure className={cn("relative h-full", className)}>
      <div
        role="img"
        aria-labelledby={captionId}
        className={cn("h-full w-full", contentClassName)}
      >
        {children}
      </div>
      <figcaption id={captionId} className="sr-only">
        {title}. {description}
      </figcaption>
    </figure>
  )
}
