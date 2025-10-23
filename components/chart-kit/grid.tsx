"use client"

import { CartesianGrid, type CartesianGridProps } from "recharts"

export function ChartGrid({ className, ...props }: CartesianGridProps) {
  return (
    <CartesianGrid
      strokeDasharray="3 3"
      stroke="hsl(var(--border))"
      opacity={0.35}
      vertical={false}
      className={className}
      {...props}
    />
  )
}
