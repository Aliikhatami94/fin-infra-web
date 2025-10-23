"use client"

import { useEffect, useId, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Check, HelpCircle, Pin, PinOff } from "lucide-react"

import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { cn } from "@/lib/utils"
import type { InsightAction, InsightDefinition, InsightAccent } from "@/lib/insights/definitions"

type InsightCardProps = {
  insight: InsightDefinition
  index?: number
  className?: string
  onAction?: (payload: { insight: InsightDefinition; action: InsightAction }) => void
  onPinChange?: (payload: { insight: InsightDefinition; pinned: boolean }) => void
}

const accentStyles: Record<InsightAccent, { icon: string; badge: string; background: string; progress: string }> = {
  amber: {
    icon: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200",
    background: "bg-amber-500/10",
    progress: "bg-amber-400/60",
  },
  emerald: {
    icon: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200",
    background: "bg-emerald-500/10",
    progress: "bg-emerald-400/60",
  },
  sky: {
    icon: "text-sky-600 dark:text-sky-400",
    badge: "bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-200",
    background: "bg-sky-500/10",
    progress: "bg-sky-400/60",
  },
  violet: {
    icon: "text-violet-600 dark:text-violet-400",
    badge: "bg-violet-50 text-violet-800 dark:bg-violet-950 dark:text-violet-300 border-violet-200",
    background: "bg-violet-500/10",
    progress: "bg-violet-400/60",
  },
  orange: {
    icon: "text-orange-600 dark:text-orange-400",
    badge: "bg-orange-50 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-200",
    background: "bg-orange-500/10",
    progress: "bg-orange-400/60",
  },
  rose: {
    icon: "text-rose-600 dark:text-rose-400",
    badge: "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200",
    background: "bg-rose-500/10",
    progress: "bg-rose-400/60",
  },
  cyan: {
    icon: "text-cyan-600 dark:text-cyan-400",
    badge: "bg-cyan-50 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200",
    background: "bg-cyan-500/10",
    progress: "bg-cyan-400/60",
  },
  slate: {
    icon: "text-slate-600 dark:text-slate-300",
    badge: "bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200 border-slate-200",
    background: "bg-slate-500/10",
    progress: "bg-slate-400/60",
  },
}

export function InsightCard({ insight, index = 0, className, onAction, onPinChange }: InsightCardProps) {
  const styles = accentStyles[insight.accent]
  const [isPinned, setIsPinned] = useState(Boolean(insight.pinned))
  const [resolved, setResolved] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const explanationId = useId()
  const headingId = useId()
  const descriptionId = useId()
  const explanationRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (showExplanation && explanationRef.current) {
      explanationRef.current.focus()
    }
  }, [showExplanation])

  if (resolved) {
    return null
  }

  const handlePinToggle = () => {
    const nextPinned = !isPinned
    setIsPinned(nextPinned)
    onPinChange?.({ insight, pinned: nextPinned })
  }

  const handleResolve = () => {
    setResolved(true)
  }

  const handleAction = (action: InsightAction) => {
    onAction?.({ insight, action })
  }

  const toggleExplanation = () => {
    setShowExplanation((prev) => !prev)
  }

  return (
    <motion.div variants={createStaggeredCardVariants(index, 0)} initial="initial" animate="animate" className={cn("group", className)}>
      <Card
        aria-labelledby={headingId}
        aria-describedby={descriptionId}
        className={cn(
          "relative h-full border border-border/40 bg-background/95 backdrop-blur-sm transition-shadow", "hover:shadow-lg", "focus-within:ring-2 focus-within:ring-primary/40",
        )}
      >
        <CardContent className="space-y-4 p-6">
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    type="button"
                    aria-pressed={isPinned}
                    aria-label={isPinned ? "Unpin insight" : "Pin insight"}
                    onClick={handlePinToggle}
                  >
                    {isPinned ? <PinOff className="h-4 w-4 text-primary" /> : <Pin className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isPinned ? "Unpin from overview" : "Pin to overview"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    type="button"
                    aria-label="Mark insight as resolved"
                    onClick={handleResolve}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mark as resolved</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-start gap-3 pr-14">
            <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", styles.background)}>
              <insight.icon className={cn("h-5 w-5", styles.icon)} aria-hidden="true" />
            </div>
            <div>
              <h3 id={headingId} className="text-sm font-semibold text-foreground">
                {insight.title}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline" className={cn("text-xs", styles.badge)}>
                  {insight.topic}
                </Badge>
                {isPinned && (
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                    Pinned
                  </Badge>
                )}
                {insight.updatedAt && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    Updated {insight.updatedAt}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <p id={descriptionId} className="text-sm leading-relaxed text-muted-foreground">
            {insight.body}
          </p>

          {insight.metrics && insight.metrics.length > 0 && (
            <div className="grid gap-4 border-t border-border/30 pt-4 sm:grid-cols-3">
              {insight.metrics.map((metric) => (
                <div key={metric.id} className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                  <span
                    className={cn("text-sm font-semibold", metric.highlight ? "text-foreground" : "text-muted-foreground")}
                    aria-label={metric.srLabel}
                  >
                    {metric.value}
                  </span>
                  {(metric.targetLabel || metric.targetValue) && (
                    <span className="text-xs text-muted-foreground">
                      {metric.targetLabel ?? "Target"}: {metric.targetValue ?? ""}
                    </span>
                  )}
                  {metric.delta && (
                    <span
                      className={cn(
                        "text-xs font-medium",
                        metric.trend === "down"
                          ? "text-emerald-500"
                          : metric.trend === "up"
                            ? "text-rose-500"
                            : "text-muted-foreground",
                      )}
                    >
                      {metric.delta}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {insight.explanation && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                aria-expanded={showExplanation}
                aria-controls={explanationId}
                onClick={toggleExplanation}
              >
                <HelpCircle className="h-4 w-4" aria-hidden="true" />
                Why?
              </Button>
            </div>
          )}

          {showExplanation && insight.explanation && (
            <div
              id={explanationId}
              className="rounded-md border border-border/40 bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground"
            >
              <p ref={explanationRef} tabIndex={-1}>
                {insight.explanation}
              </p>
            </div>
          )}

          {insight.actions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {insight.actions.map((action) => {
                const button = (
                  <Button
                    key={action.id}
                    variant={action.variant ?? "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={() => handleAction(action)}
                    aria-label={action.ariaLabel ?? action.label}
                  >
                    {action.label}
                  </Button>
                )

                if (action.href) {
                  return (
                    <Button
                      key={action.id}
                      asChild
                      variant={action.variant ?? "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => handleAction(action)}
                    >
                      <a href={action.href} aria-label={action.ariaLabel ?? action.label}>
                        {action.label}
                      </a>
                    </Button>
                  )
                }

                return button
              })}
            </div>
          )}

          {insight.progress && (
            <div className="pt-2">
              {insight.progress.label && (
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{insight.progress.label}</span>
                  <span className="font-medium text-foreground">{insight.progress.value}%</span>
                </div>
              )}
              <motion.div
                className={cn("h-1.5 w-full rounded-full", styles.progress)}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: Math.min(insight.progress.value, 100) / 100 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                role="presentation"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
