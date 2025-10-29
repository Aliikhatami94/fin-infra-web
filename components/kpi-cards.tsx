"use client"

import { useMemo, useState, type MouseEvent, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ArrowUpRight, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { MaskableValue } from "@/components/privacy-provider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LastSyncBadge } from "@/components/last-sync-badge"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
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

interface KPICardContentProps {
  kpi: ReturnType<typeof getDashboardKpis>[0]
  index: number
  isHidden: boolean
  onToggleVisibility: (e: MouseEvent<HTMLButtonElement>) => void
  onPlanModalOpen: () => void
  router: ReturnType<typeof useRouter>
}

function KPICardContent({ kpi, index, isHidden, onToggleVisibility, onPlanModalOpen, router }: KPICardContentProps) {
  const trendValue = kpi.trend === "up" ? 1 : kpi.trend === "down" ? -1 : 0
  const trendStyles = getTrendSemantic(trendValue)
  const hasQuickActions = kpi.quickActions && kpi.quickActions.length > 0

  return (
    <TooltipProvider>
      <Link href={kpi.href} className="h-full block">
        <motion.div {...createStaggeredCardVariants(index, 0)} {...cardHoverVariants} className="h-full">
          <Card className="cursor-pointer card-standard card-lift h-full min-h-[260px] md:min-h-[280px]">
            <CardContent className="flex flex-col h-full gap-3 p-4 md:p-6">
              <div className="flex items-start justify-between gap-2">
                <LastSyncBadge timestamp={kpi.lastSynced} source={kpi.source} />
                {/* Per-card visibility toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 -mr-1"
                  onClick={onToggleVisibility}
                  aria-label={isHidden ? "Show values" : "Hide values"}
                >
                  {isHidden ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-label-xs text-muted-foreground">{kpi.label}</p>
                  {isHidden ? (
                    <p className="text-kpi font-semibold font-tabular text-foreground">••••••</p>
                  ) : (
                    <p className="text-kpi font-semibold font-tabular break-words text-foreground">
                      <MaskableValue value={kpi.value} srLabel={`${kpi.label} value`} className="font-tabular" />
                    </p>
                  )}
                </div>
                <KPIIcon icon={kpi.icon} tone={trendStyles.tone} size="md" />
              </div>
              {!isHidden && (
                <>
                  <div className="flex items-end justify-between gap-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="delta-chip text-delta font-medium cursor-help">
                          {kpi.trend === "up" ? (
                            <TrendingUp className={cn("h-3.5 w-3.5", trendStyles.iconClass)} aria-hidden="true" />
                          ) : (
                            <TrendingDown className={cn("h-3.5 w-3.5", trendStyles.iconClass)} aria-hidden="true" />
                          )}
                          <span className={cn("text-delta font-medium font-tabular", trendStyles.textClass)}>
                            <MaskableValue
                              value={kpi.change}
                              srLabel={`${kpi.label} change`}
                              className="font-tabular"
                            />
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
                      "border-t border-border/40 pt-3 mt-auto h-[52px] overflow-hidden",
                      hasQuickActions
                        ? "flex max-w-full items-start gap-2 flex-wrap content-start"
                        : "",
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
                            onPlanModalOpen()
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
                              <span className="truncate">{action.label}</span>
                              {!isDisabled && <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
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
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Link>
    </TooltipProvider>
  )
}

export function KPICards() {
  const { state, hydrated } = useOnboardingState()
  const router = useRouter()
  const kpis = useMemo(() => getDashboardKpis(hydrated ? state.persona : undefined), [hydrated, state.persona])
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [hiddenCards, setHiddenCards] = useState<Set<string>>(new Set())
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handlePlanModalChange = (open: boolean) => {
    setIsPlanModalOpen(open)
  }

  const toggleCardVisibility = (label: string, e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setHiddenCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(label)) {
        newSet.delete(label)
      } else {
        newSet.add(label)
      }
      return newSet
    })
  }

  // Handle scroll to update carousel indicator
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = container.firstElementChild?.clientWidth || 0
      const gap = 16 // gap-4 = 16px
      const slideIndex = Math.round(scrollLeft / (cardWidth + gap))
      setCurrentSlide(slideIndex)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSlide = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return
    
    const cardWidth = container.firstElementChild?.clientWidth || 0
    const gap = 16
    container.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth'
    })
  }

  return (
    <div className="space-y-3">
      {/* Collapse toggle button */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">Key Metrics</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 text-xs"
        >
          {isCollapsed ? (
            <>
              <ChevronDown className="mr-1 h-3.5 w-3.5" />
              Show metrics
            </>
          ) : (
            <>
              <ChevronUp className="mr-1 h-3.5 w-3.5" />
              Hide metrics
            </>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Mobile: Horizontal carousel */}
            <div className="md:hidden space-y-3">
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {kpis.map((kpi, index) => (
                  <div
                    key={kpi.label}
                    className="min-w-[85vw] max-w-[85vw] snap-center"
                  >
                    <KPICardContent
                      kpi={kpi}
                      index={index}
                      isHidden={hiddenCards.has(kpi.label)}
                      onToggleVisibility={(e) => toggleCardVisibility(kpi.label, e)}
                      onPlanModalOpen={() => setIsPlanModalOpen(true)}
                      router={router}
                    />
                  </div>
                ))}
              </div>

              {/* Carousel indicators */}
              <div className="flex justify-center gap-1.5">
                {kpis.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSlide(index)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      currentSlide === index
                        ? "w-6 bg-primary"
                        : "w-1.5 bg-muted-foreground/30"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Tablet/Desktop: Grid layout */}
            <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
              {kpis.map((kpi, index) => (
                <KPICardContent
                  key={kpi.label}
                  kpi={kpi}
                  index={index}
                  isHidden={hiddenCards.has(kpi.label)}
                  onToggleVisibility={(e) => toggleCardVisibility(kpi.label, e)}
                  onPlanModalOpen={() => setIsPlanModalOpen(true)}
                  router={router}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PlanAdjustModal open={isPlanModalOpen} onOpenChange={handlePlanModalChange} />
    </div>
  )
}
