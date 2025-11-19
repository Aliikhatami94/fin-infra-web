"use client"

import { memo } from "react"

import { cn } from "@/lib/utils"

type MicroSparklineProps = {
  data: number[]
  color?: string
  className?: string
  ariaLabel: string
  strokeWidth?: number
}

const normalize = (values: number[]) => {
  if (!values?.length) {
    return ""
  }

  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min

  return values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * 100
      const y = range === 0 ? 50 : 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    .join(" ")
}

function MicroSparklineComponent({
  data,
  color = "currentColor",
  className,
  ariaLabel,
  strokeWidth = 3,
}: MicroSparklineProps) {
  const path = normalize(data)

  if (!path) {
    return null
  }

  return (
    <svg
      className={cn("h-10 w-24", className)}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      role="img"
      aria-label={ariaLabel}
    >
      <polyline
        points={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const MicroSparkline = memo(MicroSparklineComponent)
