"use client"

import { useMemo, useState, type MouseEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { KPI, KPIQuickAction } from "@/types/domain"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react"
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

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
  kpi: KPI
  index: number
  isHidden: boolean
  onPlanModalOpen: () => void
  router: ReturnType<typeof useRouter>
}

function KPICardContent({ kpi, index, isHidden, onPlanModalOpen, router }: KPICardContentProps) {
  const trendValue = kpi.trend === "up" ? 1 : kpi.trend === "down" ? -1 : 0
  const trendStyles = getTrendSemantic(trendValue)
  const hasQuickActions = kpi.quickActions && kpi.quickActions.length > 0

  return (
    <TooltipProvider>
      <Link href={kpi.href} className="h-full block">
        <motion.div {...createStaggeredCardVariants(index, 0)} {...cardHoverVariants} className="h-full">
          <Card className="cursor-pointer card-standard card-lift h-full min-h-[180px] md:min-h-[200px]">
            <CardContent className="flex flex-col h-full gap-3 p-4 md:p-5">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <LastSyncBadge timestamp={kpi.lastSynced} source={kpi.source} />
                {kpi.badge && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant={kpi.badge.variant} className="text-xs font-medium flex items-center gap-1">
                        {kpi.badge.icon && <kpi.badge.icon className="h-3 w-3" />}
                        {kpi.badge.label}
                      </Badge>
                    </TooltipTrigger>
                    {kpi.badge.tooltip && (
                      <TooltipContent>
                        <p className="text-xs max-w-xs">{kpi.badge.tooltip}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                )}
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
                  <div className="flex items-center gap-4">
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
                  </div>
                  <div
                    className={cn(
                      "border-t border-border/40 pt-3 mt-auto h-[52px] overflow-hidden",
                      hasQuickActions
                        ? "flex max-w-full items-start gap-2 flex-wrap content-start"
                        : "",
                    )}
                  >
                    {hasQuickActions && kpi.quickActions?.map((action: KPIQuickAction) => {
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

export function OverviewKPIs() {
  const { state, hydrated } = useOnboardingState()
  const router = useRouter()
  const [kpis, setKpis] = useState<ReturnType<typeof getDashboardKpis> extends Promise<infer T> ? T : never>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [hiddenCards] = useState<Set<string>>(new Set())
  
  // Load KPIs asynchronously
  useEffect(() => {
    let mounted = true
    
    const loadKpis = async () => {
      try {
        const data = await getDashboardKpis(hydrated ? state.persona : undefined)
        if (mounted) {
          setKpis(data)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Failed to load KPIs:", error)
        if (mounted) {
          setIsLoading(false)
        }
      }
    }
    
    loadKpis()
    
    return () => {
      mounted = false
    }
  }, [hydrated, state.persona])

  const handlePlanModalChange = (open: boolean) => {
    setIsPlanModalOpen(open)
  }

  // Handle carousel slide change
  useEffect(() => {
    if (!carouselApi) return

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap())
    }

    carouselApi.on("select", onSelect)
    onSelect()

    return () => {
      carouselApi.off("select", onSelect)
    }
  }, [carouselApi])

  return (
    <div className="space-y-1">
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
            className="overflow-hidden pt-2"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                Loading metrics...
              </div>
            ) : kpis.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                No metrics available
              </div>
            ) : (
              <>
                {/* Mobile: Horizontal carousel */}
                <div className="md:hidden space-y-3">
              <Carousel
                setApi={setCarouselApi}
                opts={{
                  align: "center",
                  loop: false,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {kpis.map((kpi, index) => (
                    <CarouselItem key={kpi.label} className="pl-4 pt-2 basis-[85%] sm:basis-[48%]">
                      <KPICardContent
                        kpi={kpi}
                        index={index}
                        isHidden={hiddenCards.has(kpi.label)}
                        onPlanModalOpen={() => setIsPlanModalOpen(true)}
                        router={router}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Carousel indicators */}
              <div className="flex justify-center gap-1.5">
                {kpis.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => carouselApi?.scrollTo(index)}
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
                      onPlanModalOpen={() => setIsPlanModalOpen(true)}
                      router={router}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <PlanAdjustModal open={isPlanModalOpen} onOpenChange={handlePlanModalChange} />
    </div>
  )
}
