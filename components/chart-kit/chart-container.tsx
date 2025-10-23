"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ChartComparisonOption {
  id: string
  label: string
  description?: string
}

interface ChartContainerProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
  contentClassName?: string
  actions?: ReactNode
  timeRanges?: readonly string[]
  selectedRange?: string
  onRangeChange?: (range: string) => void
  comparisonOptions?: readonly ChartComparisonOption[]
  selectedComparisons?: readonly string[]
  onComparisonToggle?: (id: string) => void
  unitLabel?: string
}

export function ChartContainer({
  title,
  description,
  children,
  className,
  contentClassName,
  actions,
  timeRanges,
  selectedRange,
  onRangeChange,
  comparisonOptions,
  selectedComparisons = [],
  onComparisonToggle,
  unitLabel,
}: ChartContainerProps) {
  const hasToolbar = (timeRanges?.length ?? 0) > 0 || (comparisonOptions?.length ?? 0) > 0 || unitLabel

  return (
    <Card className={cn("card-standard", className)}>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {actions ? <div className="flex flex-col items-start gap-2 sm:items-end">{actions}</div> : null}
        </div>
        {hasToolbar ? (
          <div className="flex flex-col gap-3">
            {unitLabel ? (
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
                Unit • {unitLabel}
              </span>
            ) : null}
            {timeRanges && timeRanges.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {timeRanges.map((range) => {
                  const isActive = range === selectedRange
                  return (
                    <Button
                      key={range}
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-pressed={isActive}
                      className={cn(
                        "h-8 rounded-full border-border/50 px-3 text-xs font-medium transition-colors",
                        "aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:shadow-sm",
                      )}
                      onClick={() => onRangeChange?.(range)}
                    >
                      {range}
                    </Button>
                  )
                })}
              </div>
            ) : null}
            {comparisonOptions && comparisonOptions.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {comparisonOptions.map((option) => {
                  const isSelected = selectedComparisons.includes(option.id)
                  return (
                    <Button
                      key={option.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-pressed={isSelected}
                      className={cn(
                        "h-8 rounded-full border-border/50 px-3 text-xs",
                        "aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-primary",
                      )}
                      onClick={() => onComparisonToggle?.(option.id)}
                    >
                      {option.label}
                    </Button>
                  )
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className={cn("pt-0", contentClassName)}>{children}</CardContent>
    </Card>
  )
}
