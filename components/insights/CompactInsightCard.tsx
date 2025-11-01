"use client"

import { useState } from "react"
import { Check, Pin, PinOff, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { InsightAction, InsightDefinition, InsightAccent, InsightCategory } from "@/lib/insights/definitions"
import { usePrivacy } from "@/components/privacy-provider"
import {
  Coins,
  FileText,
  LineChart,
  Target,
  Wallet,
} from "lucide-react"

const accentStyles: Record<InsightAccent, { icon: string; badge: string; background: string }> = {
  amber: {
    icon: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200",
    background: "bg-amber-500/10",
  },
  emerald: {
    icon: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200",
    background: "bg-emerald-500/10",
  },
  sky: {
    icon: "text-sky-600 dark:text-sky-400",
    badge: "bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-200",
    background: "bg-sky-500/10",
  },
  violet: {
    icon: "text-violet-600 dark:text-violet-400",
    badge: "bg-violet-50 text-violet-800 dark:bg-violet-950 dark:text-violet-300 border-violet-200",
    background: "bg-violet-500/10",
  },
  orange: {
    icon: "text-orange-600 dark:text-orange-400",
    badge: "bg-orange-50 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-200",
    background: "bg-orange-500/10",
  },
  rose: {
    icon: "text-rose-600 dark:text-rose-400",
    badge: "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200",
    background: "bg-rose-500/10",
  },
  cyan: {
    icon: "text-cyan-600 dark:text-cyan-400",
    badge: "bg-cyan-50 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200",
    background: "bg-cyan-500/10",
  },
  slate: {
    icon: "text-slate-600 dark:text-slate-400",
    badge: "bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-300 border-slate-200",
    background: "bg-slate-500/10",
  },
}

const categoryIconMap: Record<InsightCategory, typeof LineChart> = {
  spending: Wallet,
  investment: LineChart,
  goals: Target,
  documents: FileText,
  "cash-flow": Coins,
  budget: Wallet,
  tax: FileText,
  crypto: Target,
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

interface CompactInsightCardProps {
  insight: InsightDefinition
  onAction?: ({ insight, action }: { insight: InsightDefinition; action: InsightAction }) => void
  onPinChange?: ({ insight, pinned }: { insight: InsightDefinition; pinned: boolean }) => void
  onResolutionChange?: ({ insight, resolved }: { insight: InsightDefinition; resolved: boolean }) => void
  resolved?: boolean
}

export function CompactInsightCard({
  insight,
  onAction,
  onPinChange,
  onResolutionChange,
  resolved = false,
}: CompactInsightCardProps) {
  const styles = accentStyles[insight.accent]
  const [isPinned, setIsPinned] = useState(Boolean(insight.pinned))
  const [isResolved, setIsResolved] = useState(Boolean(resolved))
  const { masked } = usePrivacy()

  const CategoryIcon = categoryIconMap[insight.category]
  const categoryLabel = categoryLabelMap[insight.category]

  const handlePinToggle = () => {
    const nextPinned = !isPinned
    setIsPinned(nextPinned)
    onPinChange?.({ insight, pinned: nextPinned })
  }

  const handleResolveToggle = () => {
    const nextResolved = !isResolved
    setIsResolved(nextResolved)
    onResolutionChange?.({ insight, resolved: nextResolved })
  }

  const handleAction = (action: InsightAction) => {
    onAction?.({ insight, action })
  }

  const primaryAction = insight.actions.find((action) => (action.variant ?? "default") === "default")
  const secondaryActions = insight.actions.filter((action) => action.variant !== "default")

  return (
    <Card
      className={cn(
        "card-standard h-full transition-shadow",
        isResolved && "border-border/40 bg-muted/40 opacity-75",
      )}
    >
      <CardContent className="flex h-full flex-col p-4">
        {/* Header with icon, title, and actions */}
        <div className="flex items-start gap-3">
          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", styles.background)}>
            <insight.icon className={cn("h-4 w-4", styles.icon)} aria-hidden="true" />
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground leading-tight">
              {insight.title}
            </h3>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <Badge
                variant="outline"
                className="flex items-center gap-1 text-xs px-2 py-0.5 border-border/40 bg-card/80 text-muted-foreground"
              >
                <CategoryIcon className="h-3 w-3" aria-hidden="true" />
                {categoryLabel}
              </Badge>
              <Badge variant="outline" className={cn("text-xs px-2 py-0.5", styles.badge)}>
                {insight.topic}
              </Badge>
            </div>
          </div>

          {/* Pin and Resolve buttons */}
          <div className="flex shrink-0 items-center gap-0.5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    type="button"
                    onClick={handlePinToggle}
                  >
                    {isPinned ? <PinOff className="h-3.5 w-3.5 text-primary" /> : <Pin className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isPinned ? "Unpin" : "Pin"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    type="button"
                    onClick={handleResolveToggle}
                  >
                    {isResolved ? <RotateCcw className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isResolved ? "Undo" : "Resolve"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Body text */}
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {masked && insight.redactedBody ? insight.redactedBody : insight.body}
        </p>

        {/* Metrics - compact horizontal layout */}
        {insight.metrics && insight.metrics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-border/30 pt-3">
            {insight.metrics.map((metric) => (
              <div key={metric.id} className="flex items-baseline gap-1.5">
                <span className="text-xs text-muted-foreground">{metric.label}</span>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    metric.highlight ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {metric.sensitive && masked ? metric.fallbackValue ?? "Hidden" : metric.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Actions - compact buttons */}
        <div className="mt-auto pt-3 flex flex-wrap gap-2">
          {primaryAction && (
            <Button
              size="sm"
              className="h-9 text-sm flex-1"
              onClick={() => handleAction(primaryAction)}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryActions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-sm"
              onClick={() => handleAction(secondaryActions[0])}
            >
              {secondaryActions[0].label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
