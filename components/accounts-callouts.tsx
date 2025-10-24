"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Gauge, PiggyBank, TrendingDown, TrendingUp, X } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSecureStorage } from "@/hooks/use-secure-storage"
import { cn } from "@/lib/utils"
import { ReviewSavingsPlanButton } from "@/components/review-savings-plan-button"

interface CalloutConfig {
  id: string
  title: string
  description: string
  icon: LucideIcon
  accentClass: string
  indicatorClass: string
  metrics: { label: string; value: string; trendLabel: string; isPositive: boolean }[]
  ctaLabel: string
}

const CALLOUTS: CalloutConfig[] = [
  {
    id: "utilization",
    title: "Credit utilization is trending down",
    description: "You're using 24% of available credit. Keeping it under 30% helps your score.",
    icon: Gauge,
    accentClass: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
    indicatorClass: "bg-blue-500/20 text-blue-600 dark:text-blue-200",
    metrics: [
      { label: "Utilization", value: "24%", trendLabel: "-4 pts vs. last month", isPositive: true },
      { label: "On-time payments", value: "12", trendLabel: "months streak", isPositive: true },
    ],
    ctaLabel: "View credit tips",
  },
  {
    id: "emergency-fund",
    title: "Emergency fund is almost at goal",
    description: "You've saved 4.5 months of expenses. Add $400 to lock in the 6-month cushion.",
    icon: PiggyBank,
    accentClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    indicatorClass: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-200",
    metrics: [
      { label: "Coverage", value: "4.5 mo", trendLabel: "+0.5 this quarter", isPositive: true },
      { label: "Goal", value: "6 mo", trendLabel: "", isPositive: true },
    ],
    ctaLabel: "Review savings plan",
  },
]

const STORAGE_KEY = "dismissed-callouts"

export function AccountsCallouts() {
  const storage = useSecureStorage({ namespace: "accounts" })
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  useEffect(() => {
    let isMounted = true

    if (!storage) {
      return () => {
        isMounted = false
      }
    }

    storage
      .getItem(STORAGE_KEY)
      .then((stored) => {
        if (!stored || !isMounted) return
        try {
          const parsed = JSON.parse(stored) as string[]
          setDismissed(new Set(parsed))
        } catch {
          // corrupted payloads should not break UI – fall back to empty state
          setDismissed(new Set())
        }
      })
      .catch(() => {
        /* swallow errors silently */
      })

    return () => {
      isMounted = false
    }
  }, [storage])

  const persistDismissed = useCallback(
    (next: Set<string>) => {
      if (!storage) return
      storage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next))).catch(() => {
        /* ignore persistence failures */
      })
    },
    [storage],
  )

  const visibleCallouts = useMemo(
    () => CALLOUTS.filter((callout) => !dismissed.has(callout.id)),
    [dismissed],
  )

  const handleDismiss = useCallback(
    (id: string) => {
      setDismissed((current) => {
        const next = new Set(current)
        next.add(id)
        persistDismissed(next)
        return next
      })
    },
    [persistDismissed],
  )

  if (visibleCallouts.length === 0) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {visibleCallouts.map((callout) => {
        const Icon = callout.icon
        return (
          <Card key={callout.id} className="card-standard border-dashed border-border/40">
            <CardContent className="flex gap-4 p-5">
              <div className={cn("mt-1 flex h-10 w-10 items-center justify-center rounded-lg", callout.accentClass)}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{callout.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{callout.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    aria-label={`Dismiss ${callout.title}`}
                    onClick={() => handleDismiss(callout.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  {callout.metrics.map((metric) => (
                    <div key={metric.label} className="space-y-1">
                      <p className="text-[0.7rem] uppercase text-muted-foreground">{metric.label}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-foreground">{metric.value}</span>
                        {metric.trendLabel && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "border-transparent text-xs",
                              metric.isPositive
                                ? "text-emerald-600 dark:text-emerald-300"
                                : "text-destructive",
                            )}
                          >
                            {metric.isPositive ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                            {metric.trendLabel}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  {callout.id === "emergency-fund" ? (
                    <ReviewSavingsPlanButton className={cn("text-xs", callout.indicatorClass)} />
                  ) : (
                    <Button variant="outline" size="sm" className={cn("text-xs", callout.indicatorClass)}>
                      {callout.ctaLabel}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
