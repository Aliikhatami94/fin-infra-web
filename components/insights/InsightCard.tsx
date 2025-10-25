"use client"

import Link from "next/link"
import { useCallback, useEffect, useId, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ArrowDownUp,
  Check,
  Coins,
  FileText,
  HelpCircle,
  Landmark,
  LineChart,
  PieChart,
  Pin,
  PinOff,
  RotateCcw,
  Shield,
  Target,
  Wallet,
} from "lucide-react"

import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { cn } from "@/lib/utils"
import { getAnchorRel, getAnchorTarget, isInternalNavigation } from "@/lib/linking"
import type { InsightAction, InsightDefinition, InsightAccent, InsightCategory } from "@/lib/insights/definitions"
import {
  trackInsightAction,
  trackInsightPinChange,
  trackInsightReadState,
  trackInsightResolution,
} from "@/lib/analytics/events"
import { usePrivacy } from "@/components/privacy-provider"

type InsightCardProps = {
  insight: InsightDefinition
  index?: number
  className?: string
  onAction?: (payload: { insight: InsightDefinition; action: InsightAction }) => void
  onPinChange?: (payload: { insight: InsightDefinition; pinned: boolean }) => void
  unread?: boolean
  onMarkRead?: () => void
  resolved?: boolean
  onResolutionChange?: (payload: { insight: InsightDefinition; resolved: boolean }) => void
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

const categoryIconMap: Record<InsightCategory, typeof Wallet> = {
  spending: Wallet,
  investment: LineChart,
  goals: Target,
  documents: FileText,
  "cash-flow": ArrowDownUp,
  budget: PieChart,
  tax: Landmark,
  crypto: Coins,
}

const categoryLabelMap: Record<InsightCategory, string> = {
  spending: "Spending",
  investment: "Investment",
  goals: "Goals",
  documents: "Documents",
  "cash-flow": "Cash Flow",
  budget: "Budget",
  tax: "Tax",
  crypto: "Crypto",
}

export function InsightCard({
  insight,
  index = 0,
  className,
  onAction,
  onPinChange,
  unread = false,
  onMarkRead,
  resolved,
  onResolutionChange,
}: InsightCardProps) {
  const styles = accentStyles[insight.accent]
  const [isPinned, setIsPinned] = useState(Boolean(insight.pinned))
  const [isResolved, setIsResolved] = useState(Boolean(resolved))
  const [showExplanation, setShowExplanation] = useState(false)
  const explanationId = useId()
  const headingId = useId()
  const descriptionId = useId()
  const explanationRef = useRef<HTMLParagraphElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const hasLoggedHighlight = useRef(false)
  const hasLoggedRead = useRef(false)
  const inView = useInView(cardRef, { once: true, amount: 0.6 })
  const { masked } = usePrivacy()

  useEffect(() => {
    if (showExplanation && explanationRef.current) {
      explanationRef.current.focus()
    }
  }, [showExplanation])

  useEffect(() => {
    setIsResolved(Boolean(resolved))
  }, [resolved])

  useEffect(() => {
    setIsPinned(Boolean(insight.pinned))
  }, [insight.pinned])

  useEffect(() => {
    if (unread && !hasLoggedHighlight.current) {
      trackInsightReadState({ insight, state: "highlighted" })
      hasLoggedHighlight.current = true
    }
  }, [insight, unread])

  const registerRead = useCallback(() => {
    if (!hasLoggedRead.current) {
      trackInsightReadState({ insight, state: "read" })
      hasLoggedRead.current = true
    }
    onMarkRead?.()
  }, [insight, onMarkRead])

  useEffect(() => {
    if (unread && inView) {
      registerRead()
    }
  }, [inView, registerRead, unread])

  const handlePinToggle = () => {
    const nextPinned = !isPinned
    setIsPinned(nextPinned)
    registerRead()
    trackInsightPinChange({ insight, pinned: nextPinned })
    onPinChange?.({ insight, pinned: nextPinned })
  }

  const handleResolveToggle = () => {
    const nextResolved = !isResolved
    setIsResolved(nextResolved)
    registerRead()
    if (nextResolved) {
      trackInsightResolution({ insight })
    }
    onResolutionChange?.({ insight, resolved: nextResolved })
  }

  const handleAction = (action: InsightAction) => {
    registerRead()
    trackInsightAction({ insight, action })
    onAction?.({ insight, action })
  }

  const toggleExplanation = () => {
    setShowExplanation((prev) => !prev)
  }

  const CategoryIcon = categoryIconMap[insight.category]
  const categoryLabel = categoryLabelMap[insight.category]
  const resolutionLabel = isResolved ? "Mark insight as active" : "Mark insight as resolved"
  const primaryActionIndex = Math.max(
    insight.actions.findIndex((action) => (action.variant ?? "default") === "default"),
    0,
  )

  return (
    <motion.div
      ref={cardRef}
      variants={createStaggeredCardVariants(index, 0)}
      initial="initial"
      animate="animate"
      className={cn("group", className)}
    >
      <Card
        aria-labelledby={headingId}
        aria-describedby={descriptionId}
        className={cn(
          "relative h-full border border-border/40 bg-card/95 backdrop-blur-sm transition-shadow",
          "hover:shadow-lg",
          "focus-within:ring-2 focus-within:ring-primary/40",
          unread && "border-primary/60 shadow-[0_0_0_1px_theme(colors.primary/50)] focus-within:ring-primary",
          isResolved && "border-border/30 bg-muted/40 saturate-75",
        )}
        data-state={isResolved ? "resolved" : "active"}
      >
        <CardContent className={cn("space-y-4 p-6", isResolved && "opacity-80 transition-opacity")}
          data-resolved={isResolved}
        >
          {unread && !isResolved && (
            <div className="absolute left-6 top-6">
              <Badge variant="default" className="text-xs uppercase tracking-wide">
                New
              </Badge>
            </div>
          )}
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
                    aria-pressed={isResolved}
                    aria-label={resolutionLabel}
                    onClick={handleResolveToggle}
                  >
                    {isResolved ? <RotateCcw className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isResolved ? "Undo resolution" : "Mark as resolved"}</TooltipContent>
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
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 text-xs border-border/40 bg-card/80 text-muted-foreground"
                >
                  <CategoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {categoryLabel}
                </Badge>
                <Badge variant="outline" className={cn("text-xs", styles.badge)}>
                  {insight.topic}
                </Badge>
                {isPinned && (
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                    Pinned
                  </Badge>
                )}
                {isResolved && (
                  <Badge
                    variant="outline"
                    className="text-xs border-emerald-300 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  >
                    Resolved
                  </Badge>
                )}
                {insight.sensitive && (
                  <Badge variant="outline" className="text-xs border-amber-300 bg-amber-500/10 text-amber-700">
                    Sensitive data masked
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
            {masked && insight.redactedBody ? insight.redactedBody : insight.body}
          </p>

          {insight.metrics && insight.metrics.length > 0 && (
            <div className="grid gap-4 border-t border-border/30 pt-4 sm:grid-cols-3">
              {insight.metrics.map((metric) => (
                <div key={metric.id} className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                  <div className="flex items-center gap-1">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        metric.highlight ? "text-foreground" : "text-muted-foreground",
                      )}
                      aria-label={metric.srLabel}
                    >
                      {metric.sensitive && masked ? metric.fallbackValue ?? "Hidden" : metric.value}
                    </span>
                    {metric.sensitive && masked && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Shield className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-xs">
                            {metric.tooltip ?? "Sensitive value hidden. Disable privacy masking to reveal."}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  {(metric.targetLabel || metric.targetValue) && (
                    <span className="text-xs text-muted-foreground">
                      {metric.targetLabel ?? "Target"}: {masked && metric.sensitive
                        ? metric.targetFallbackValue ?? metric.targetValue ?? ""
                        : metric.targetValue ?? ""}
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
                onClick={() => {
                  registerRead()
                  toggleExplanation()
                }}
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
              {insight.actions.map((action, actionIndex) => {
                const isPrimaryAction = actionIndex === primaryActionIndex
                const effectiveVariant = action.variant ?? (isPrimaryAction ? "default" : "outline")
                const intent = isPrimaryAction && effectiveVariant === "default" ? "primary" : "secondary"
                const commonProps = {
                  variant: effectiveVariant,
                  size: "sm" as const,
                  className: cn(
                    "text-xs transition-all data-[intent=primary]:shadow-sm data-[intent=primary]:shadow-primary/20",
                    "data-[intent=secondary]:border-border/50 data-[intent=secondary]:text-muted-foreground",
                    "data-[intent=secondary]:hover:text-foreground",
                    isResolved && "opacity-80",
                  ),
                  "data-intent": intent,
                  onClick: () => handleAction(action),
                  "aria-label": action.ariaLabel ?? action.label,
                }

                if (action.href) {
                  const isInternalLink = isInternalNavigation(action.href)
                  const anchorProps = {
                    href: action.href,
                    "aria-label": action.ariaLabel ?? action.label,
                  } as const

                  return (
                    <Button key={action.id} {...commonProps} asChild>
                      {isInternalLink ? (
                        <Link {...anchorProps}>{action.label}</Link>
                      ) : (
                        <a
                          {...anchorProps}
                          target={getAnchorTarget(action.href)}
                          rel={getAnchorRel(action.href)}
                        >
                          {action.label}
                        </a>
                      )}
                    </Button>
                  )
                }

                return (
                  <Button key={action.id} {...commonProps}>
                    {action.label}
                  </Button>
                )
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
