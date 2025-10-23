"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type TooltipEntry<TValue extends number | string, TName extends string> = {
  value?: TValue
  name: TName
  color?: string
  dataKey?: string | number
}

interface TooltipCardProps<TValue extends number | string, TName extends string> {
  active?: boolean
  payload?: Array<TooltipEntry<TValue, TName>>
  label?: string | number
  labelFormatter?: (label: string | number | undefined) => ReactNode
  valueFormatter?: (value: TValue, name: TName, payload: TooltipEntry<TValue, TName>) => ReactNode
  footer?: (payload: Array<TooltipEntry<TValue, TName>>) => ReactNode
  className?: string
}

export function TooltipCard<TValue extends number | string, TName extends string>({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  footer,
  className,
}: TooltipCardProps<TValue, TName>) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const entries = (payload.filter(Boolean) as Array<TooltipEntry<TValue, TName>>)
  const resolvedLabel = labelFormatter ? labelFormatter(label) : label

  return (
    <div
      className={cn(
        "min-w-[12rem] rounded-xl border border-border/50 bg-background/95 p-3 text-xs shadow-lg backdrop-blur",
        className,
      )}
    >
      {resolvedLabel ? <p className="mb-2 font-medium text-muted-foreground">{resolvedLabel}</p> : null}
      <div className="flex flex-col gap-1.5">
        {entries.map((entry, index) => {
          const numericValue = entry.value as TValue
          const formatted = valueFormatter ? valueFormatter(numericValue, entry.name as TName, entry) : entry.value

          return (
            <div key={`${entry.dataKey}-${index}`} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span
                  className="inline-flex size-2.5 rounded-full"
                  style={{ backgroundColor: entry.color ?? "hsl(var(--primary))" }}
                  aria-hidden
                />
                <span className="font-medium text-foreground/90">{entry.name}</span>
              </div>
              <span className="font-mono text-sm font-semibold text-foreground">{formatted}</span>
            </div>
          )
        })}
      </div>
      {footer ? (
        <div className="mt-2 border-t border-border/40 pt-2 text-[0.7rem] text-muted-foreground">{footer(entries)}</div>
      ) : null}
    </div>
  )
}
