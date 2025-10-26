"use client"

import { useMemo, useState, type MouseEvent } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { MaskableValue } from "@/components/privacy-provider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LastSyncBadge } from "@/components/last-sync-badge"
import Link from "next/link"
import { motion } from "framer-motion"
import { createStaggeredCardVariants, cardHoverVariants } from "@/lib/motion-variants"
import { getTrendSemantic } from "@/lib/color-utils"
import { getDashboardKpis } from "@/lib/services"
import { useOnboardingState } from "@/hooks/use-onboarding-state"
import { Button } from "@/components/ui/button"
import { navigateInApp } from "@/lib/linking"
import { PlanAdjustModal } from "@/components/plan-adjust-modal"
import { KPIIcon } from "@/components/ui/kpi-icon"

const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg className="w-16 h-8" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function KPICards() {
  const { state, hydrated } = useOnboardingState()
  const router = useRouter()
  const kpis = useMemo(() => getDashboardKpis(hydrated ? state.persona : undefined), [hydrated, state.persona])
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)

  const handlePlanModalChange = (open: boolean) => {
    setIsPlanModalOpen(open)
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 items-stretch">
      {kpis.map((kpi, index) => {
        const trendValue = kpi.trend === "up" ? 1 : kpi.trend === "down" ? -1 : 0
        const trendStyles = getTrendSemantic(trendValue)
        const hasQuickActions = kpi.quickActions && kpi.quickActions.length > 0

        return (
          <TooltipProvider key={kpi.label}>
            <Link href={kpi.href}>
              <motion.div {...createStaggeredCardVariants(index, 0)} {...cardHoverVariants}>
                <Card className="cursor-pointer card-standard card-lift h-full">
                  <CardContent className="grid h-full grid-rows-[auto_auto_1fr_auto] gap-4 p-6">
                    <div className="flex items-center justify-between">
                      <div className="sr-only" aria-live="polite">{`View more insight about ${kpi.label}.`}</div>
                      <LastSyncBadge timestamp={kpi.lastSynced} source={kpi.source} />
                    </div>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">{kpi.label}</p>
                        <p className="text-2xl font-bold font-mono tabular-nums truncate">
                          <MaskableValue value={kpi.value} srLabel={`${kpi.label} value`} />
                        </p>
                      </div>
                      <KPIIcon icon={kpi.icon} tone={trendStyles.tone} size="md" />
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 text-xs font-medium cursor-help">
                            {kpi.trend === "up" ? (
                              <TrendingUp className={cn("h-3.5 w-3.5", trendStyles.iconClass)} aria-hidden="true" />
                            ) : (
                              <TrendingDown className={cn("h-3.5 w-3.5", trendStyles.iconClass)} aria-hidden="true" />
                            )}
                            <span className={cn(trendStyles.textClass)}>
                              <MaskableValue value={kpi.change} srLabel={`${kpi.label} change`} />
                            </span>
                            <span className="sr-only">
                              {trendStyles.tone === "positive"
                                ? "Improving"
                                : trendStyles.tone === "negative"
                                  ? "Declining"
                                  : "No change"}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            vs. last month: <span className="font-mono">{kpi.baselineValue}</span>
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      <Sparkline data={kpi.sparkline} color={trendStyles.strokeColor} />
                    </div>
                    <div
                      className={cn(
                        "border-t border-border/40 pt-3",
                        hasQuickActions
                          ? "flex max-w-full items-center gap-x-2 gap-y-1 flex-wrap sm:flex-nowrap overflow-hidden"
                          : "min-h-[28px]",
                      )}
                    >
                      {hasQuickActions && kpi.quickActions?.map((action) => {
                          const isDisabled = action.disabled
                          const actionLabel = action.description ?? `${action.label} for ${kpi.label}`
                          const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
                            event.preventDefault()
                            event.stopPropagation()
                            if (isDisabled) {
                              return
                            }

                            if (action.intent === "plan-adjust") {
                              setIsPlanModalOpen(true)
                              return
                            }

                            if (action.href) {
                              await navigateInApp(router, action.href, {
                                toastMessage: `We couldn't open ${action.label}.`,
                                toastDescription: `Try again shortly or head back to your dashboard to continue exploring.`,
                              })
                            }
                          }

                          const button = (
                            <Button
                              key={`${kpi.label}-${action.label}`}
                              variant="ghost"
                              size="sm"
                              type="button"
                              className="h-7 px-2 text-xs font-medium whitespace-nowrap shrink-0"
                              aria-label={actionLabel}
                              onClick={handleClick}
                              disabled={isDisabled}
                            >
                              <span className="inline-flex items-center gap-1">
                                <span>{action.label}</span>
                                {!isDisabled && <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />}
                              </span>
                            </Button>
                          )

                          if (!action.tooltip) {
                            return button
                          }

                          return (
                            <Tooltip key={`${kpi.label}-${action.label}`}>
                              <TooltipTrigger asChild>
                                <span className="inline-flex">{button}</span>
                              </TooltipTrigger>
                              <TooltipContent>{action.tooltip}</TooltipContent>
                            </Tooltip>
                          )
                        })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </TooltipProvider>
        )
      })}
      <PlanAdjustModal open={isPlanModalOpen} onOpenChange={handlePlanModalChange} />
    </div>
  )
}
