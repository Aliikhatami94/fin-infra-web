"use client"

import { useMemo, useState, useEffect, type MouseEvent } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, DollarSign, Target, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { useOnboardingState } from "@/hooks/use-onboarding-state"
import { KPIIcon } from "@/components/ui/kpi-icon"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

const sparklineData = [
  { month: "Jan", value: 42000 },
  { month: "Feb", value: 44000 },
  { month: "Mar", value: 46500 },
  { month: "Apr", value: 48000 },
  { month: "May", value: 51000 },
  { month: "Jun", value: 54000 },
  { month: "Jul", value: 59500 },
]

const contributionData = [
  { month: "Jan", value: 800 },
  { month: "Feb", value: 900 },
  { month: "Mar", value: 1000 },
  { month: "Apr", value: 1100 },
  { month: "May", value: 1150 },
  { month: "Jun", value: 1180 },
  { month: "Jul", value: 1200 },
]

function MiniSparkline({ data, color }: { data: { value: number }[]; color: string }) {
  const max = Math.max(...data.map((d) => d.value))
  const min = Math.min(...data.map((d) => d.value))
  const range = max - min

  return (
    <svg width="80" height="40" className="overflow-visible">
      <polyline
        points={data
          .map((d, i) => {
            const x = (i / (data.length - 1)) * 80
            const y = 40 - ((d.value - min) / range) * 40
            return `${x},${y}`
          })
          .join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function GoalsSummaryKPIs() {
  const { state, hydrated } = useOnboardingState()
  const persona = hydrated ? state.persona : undefined
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hiddenCards, setHiddenCards] = useState<Set<string>>(new Set())
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)

  const totalSaved = 59500
  const totalTarget = 188000
  const percentComplete = Math.round((totalSaved / totalTarget) * 100)
  const monthlyContribution = 1200
  const targetContribution = 1400
  const contributionRate = Math.round((monthlyContribution / targetContribution) * 100)

  const primaryLabel = useMemo(() => {
    if (persona?.goalsFocus === "debt_paydown") {
      return "Debt Freedom Progress"
    }
    if (persona?.goalsFocus === "financial_stability") {
      return "Safety Net Progress"
    }
    return "Total Goal Progress"
  }, [persona?.goalsFocus])

  const monthlyLabel = persona?.goalsFocus === "debt_paydown" ? "Monthly Debt Payment" : "Monthly Contribution"
  const fundingHeadline = persona?.goalsFocus === "wealth_building" ? "Growth Funding" : "Funding Status"

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

  const kpiCards = [
    {
      label: primaryLabel,
      saved: totalSaved,
      target: totalTarget,
      percentComplete,
      sparkline: sparklineData,
      icon: Target,
      tone: "info" as const,
    },
    {
      label: monthlyLabel,
      contribution: monthlyContribution,
      targetContribution,
      contributionRate,
      sparkline: contributionData,
      icon: DollarSign,
      tone: "positive" as const,
    },
    {
      label: fundingHeadline,
      icon: TrendingUp,
      tone: "positive" as const,
    },
  ]

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
            className="overflow-hidden pt-4"
          >
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
                  {kpiCards.map((kpi, index) => {
                    const isHidden = hiddenCards.has(kpi.label)
                    return (
                      <CarouselItem key={kpi.label} className="pl-4 basis-[85%]">
                        <motion.div {...createStaggeredCardVariants(index, 0)} className="h-full">
                          {index === 0 ? (
                            <Card className="card-standard card-lift h-full min-h-[260px] md:min-h-[280px]">
                              <CardContent className="flex h-full flex-col gap-3 p-4 md:p-6">
                                <div className="flex items-start justify-between gap-2">
                                  <LastSyncBadge timestamp="5 min ago" source="Manual" />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 -mr-1"
                                    onClick={(e) => toggleCardVisibility(kpi.label, e)}
                                    aria-label={isHidden ? "Show values" : "Hide values"}
                                  >
                                    {isHidden ? (
                                      <Eye className="h-3.5 w-3.5" />
                                    ) : (
                                      <EyeOff className="h-3.5 w-3.5" />
                                    )}
                                  </Button>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                  <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="text-label-sm text-muted-foreground">{kpi.label}</p>
                                    </div>
                                    {isHidden ? (
                                      <p className="text-kpi font-semibold font-tabular text-foreground">••••••</p>
                                    ) : (
                                      <div className="space-y-2">
                                        <div className="flex items-baseline justify-between text-label-sm text-muted-foreground font-normal">
                                          <span>
                                            Saved <span className="font-medium text-foreground font-tabular">${kpi.saved!.toLocaleString()}</span>
                                          </span>
                                          <span className="font-tabular">Target ${kpi.target!.toLocaleString()}</span>
                                        </div>
                                        <Progress value={kpi.percentComplete!} aria-label={`${kpi.percentComplete}% of goal funded`} />
                                        <div className="flex items-center justify-between">
                                          <span className="text-kpi font-semibold font-tabular">{kpi.percentComplete}%</span>
                                          <span className="text-label-xs text-muted-foreground font-normal">complete</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <KPIIcon icon={kpi.icon} tone={kpi.tone} shape="circle" className="shrink-0" />
                                </div>
                                {!isHidden && (
                                  <div className="flex items-end justify-between gap-4 mt-auto">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            type="button"
                                            className="inline-flex items-center rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors cursor-help text-label-sm text-[var(--color-positive)]"
                                            aria-label="Goal progress in the last 6 months"
                                          >
                                            Last 6 months
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="text-label-xs font-normal">Previous balance: $54,000</p>
                                          <p className="text-label-xs font-normal">Current balance: ${kpi.saved!.toLocaleString()}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <div className="shrink-0">
                                      <MiniSparkline data={kpi.sparkline!} color="hsl(217, 91%, 60%)" />
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ) : index === 1 ? (
                            <Card className="card-standard card-lift h-full min-h-[260px] md:min-h-[280px]">
                              <CardContent className="flex h-full flex-col gap-3 p-4 md:p-6">
                                <div className="flex items-start justify-between gap-2">
                                  <LastSyncBadge timestamp="5 min ago" source="Manual" />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 -mr-1"
                                    onClick={(e) => toggleCardVisibility(kpi.label, e)}
                                    aria-label={isHidden ? "Show values" : "Hide values"}
                                  >
                                    {isHidden ? (
                                      <Eye className="h-3.5 w-3.5" />
                                    ) : (
                                      <EyeOff className="h-3.5 w-3.5" />
                                    )}
                                  </Button>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                  <div className="space-y-1 min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="text-label-sm text-muted-foreground">{kpi.label}</p>
                                    </div>
                                    {isHidden ? (
                                      <p className="text-kpi font-semibold font-tabular text-foreground">••••••</p>
                                    ) : (
                                      <p className="text-kpi font-semibold font-tabular">
                                        ${kpi.contribution!.toLocaleString()}
                                        <span className="text-body-sm font-normal text-muted-foreground">/mo</span>
                                      </p>
                                    )}
                                  </div>
                                  <KPIIcon icon={kpi.icon} tone={kpi.tone} shape="circle" className="shrink-0" />
                                </div>
                                {!isHidden && (
                                  <div className="flex items-end justify-between gap-4 mt-auto">
                                    <div className="flex items-center gap-2">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button
                                              type="button"
                                              className="delta-chip text-delta font-medium rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors cursor-help"
                                              aria-label={`${kpi.contributionRate!}% of target contribution`}
                                            >
                                              <span className="text-label-sm text-[var(--color-warning)]">{kpi.contributionRate}%</span>
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="text-label-xs font-normal">Target: ${kpi.targetContribution!.toLocaleString()}/mo</p>
                                            <p className="text-label-xs font-normal">Current: ${kpi.contribution!.toLocaleString()}/mo</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <span className="text-label-xs text-muted-foreground font-normal">of target</span>
                                    </div>
                                    <div className="shrink-0">
                                      <MiniSparkline data={kpi.sparkline!} color="var(--color-positive)" />
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ) : (
                            <Card className="card-standard card-lift h-full min-h-[260px] md:min-h-[280px]">
                              <CardContent className="flex h-full flex-col gap-3 p-4 md:p-6">
                                <div className="flex items-start justify-between gap-2">
                                  <LastSyncBadge timestamp="5 min ago" source="Manual" />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 -mr-1"
                                    onClick={(e) => toggleCardVisibility(kpi.label, e)}
                                    aria-label={isHidden ? "Show values" : "Hide values"}
                                  >
                                    {isHidden ? (
                                      <Eye className="h-3.5 w-3.5" />
                                    ) : (
                                      <EyeOff className="h-3.5 w-3.5" />
                                    )}
                                  </Button>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                  <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="text-label-sm text-muted-foreground">{kpi.label}</p>
                                    </div>
                                    {isHidden ? (
                                      <p className="text-title-sm font-semibold text-foreground">••••••</p>
                                    ) : (
                                      <p className="text-title-sm font-semibold text-foreground">On Track</p>
                                    )}
                                  </div>
                                  <KPIIcon icon={kpi.icon} tone={kpi.tone} shape="circle" className="shrink-0" />
                                </div>
                                {!isHidden && (
                                  <div className="space-y-1 mt-auto">
                                    <div className="flex items-center justify-between text-label-xs text-muted-foreground font-normal">
                                      <span>Emergency Fund</span>
                                      <span className="font-medium text-foreground font-tabular">$500/mo</span>
                                    </div>
                                    <div className="flex items-center justify-between text-label-xs text-muted-foreground font-normal">
                                      <span>House Down Payment</span>
                                      <span className="font-medium text-foreground font-tabular">$600/mo</span>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </motion.div>
                      </CarouselItem>
                    )
                  })}
                </CarouselContent>
              </Carousel>

              {/* Carousel indicators */}
              <div className="flex justify-center gap-1.5">
                {kpiCards.map((_, index) => (
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
              {kpiCards.map((kpi, index) => {
                const isHidden = hiddenCards.has(kpi.label)
                return (
                  <motion.div key={kpi.label} {...createStaggeredCardVariants(index, 0)} className="h-full">
                    {index === 0 ? (
                      <Card className="card-standard card-lift h-full min-h-[260px] md:min-h-[280px]">
                        <CardContent className="flex h-full flex-col gap-3 p-4 md:p-6">
                          <div className="flex items-start justify-between gap-2">
                            <LastSyncBadge timestamp="5 min ago" source="Manual" />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 -mr-1"
                              onClick={(e) => toggleCardVisibility(kpi.label, e)}
                              aria-label={isHidden ? "Show values" : "Hide values"}
                            >
                              {isHidden ? (
                                <Eye className="h-3.5 w-3.5" />
                              ) : (
                                <EyeOff className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-label-sm text-muted-foreground">{kpi.label}</p>
                              </div>
                              {isHidden ? (
                                <p className="text-kpi font-semibold font-tabular text-foreground">••••••</p>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex items-baseline justify-between text-label-sm text-muted-foreground font-normal">
                                    <span>
                                      Saved <span className="font-medium text-foreground font-tabular">${kpi.saved!.toLocaleString()}</span>
                                    </span>
                                    <span className="font-tabular">Target ${kpi.target!.toLocaleString()}</span>
                                  </div>
                                  <Progress value={kpi.percentComplete!} aria-label={`${kpi.percentComplete}% of goal funded`} />
                                  <div className="flex items-center justify-between">
                                    <span className="text-kpi font-semibold font-tabular">{kpi.percentComplete}%</span>
                                    <span className="text-label-xs text-muted-foreground font-normal">complete</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <KPIIcon icon={kpi.icon} tone={kpi.tone} shape="circle" className="shrink-0" />
                          </div>
                          {!isHidden && (
                            <div className="flex items-end justify-between gap-4 mt-auto">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      className="inline-flex items-center rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors cursor-help text-label-sm text-[var(--color-positive)]"
                                      aria-label="Goal progress in the last 6 months"
                                    >
                                      Last 6 months
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-label-xs font-normal">Previous balance: $54,000</p>
                                    <p className="text-label-xs font-normal">Current balance: ${kpi.saved!.toLocaleString()}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <div className="shrink-0">
                                <MiniSparkline data={kpi.sparkline!} color="hsl(217, 91%, 60%)" />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ) : index === 1 ? (
                      <Card className="card-standard card-lift h-full min-h-[260px] md:min-h-[280px]">
                        <CardContent className="flex h-full flex-col gap-3 p-4 md:p-6">
                          <div className="flex items-start justify-between gap-2">
                            <LastSyncBadge timestamp="5 min ago" source="Manual" />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 -mr-1"
                              onClick={(e) => toggleCardVisibility(kpi.label, e)}
                              aria-label={isHidden ? "Show values" : "Hide values"}
                            >
                              {isHidden ? (
                                <Eye className="h-3.5 w-3.5" />
                              ) : (
                                <EyeOff className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-label-sm text-muted-foreground">{kpi.label}</p>
                              </div>
                              {isHidden ? (
                                <p className="text-kpi font-semibold font-tabular text-foreground">••••••</p>
                              ) : (
                                <p className="text-kpi font-semibold font-tabular">
                                  ${kpi.contribution!.toLocaleString()}
                                  <span className="text-body-sm font-normal text-muted-foreground">/mo</span>
                                </p>
                              )}
                            </div>
                            <KPIIcon icon={kpi.icon} tone={kpi.tone} shape="circle" className="shrink-0" />
                          </div>
                          {!isHidden && (
                            <div className="flex items-end justify-between gap-4 mt-auto">
                              <div className="flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        type="button"
                                        className="delta-chip text-delta font-medium rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors cursor-help"
                                        aria-label={`${kpi.contributionRate!}% of target contribution`}
                                      >
                                        <span className="text-label-sm text-[var(--color-warning)]">{kpi.contributionRate}%</span>
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-label-xs font-normal">Target: ${kpi.targetContribution!.toLocaleString()}/mo</p>
                                      <p className="text-label-xs font-normal">Current: ${kpi.contribution!.toLocaleString()}/mo</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <span className="text-label-xs text-muted-foreground font-normal">of target</span>
                              </div>
                              <div className="shrink-0">
                                <MiniSparkline data={kpi.sparkline!} color="var(--color-positive)" />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="card-standard card-lift h-full min-h-[260px] md:min-h-[280px]">
                        <CardContent className="flex h-full flex-col gap-3 p-4 md:p-6">
                          <div className="flex items-start justify-between gap-2">
                            <LastSyncBadge timestamp="5 min ago" source="Manual" />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 -mr-1"
                              onClick={(e) => toggleCardVisibility(kpi.label, e)}
                              aria-label={isHidden ? "Show values" : "Hide values"}
                            >
                              {isHidden ? (
                                <Eye className="h-3.5 w-3.5" />
                              ) : (
                                <EyeOff className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-label-sm text-muted-foreground">{kpi.label}</p>
                              </div>
                              {isHidden ? (
                                <p className="text-title-sm font-semibold text-foreground">••••••</p>
                              ) : (
                                <p className="text-title-sm font-semibold text-foreground">On Track</p>
                              )}
                            </div>
                            <KPIIcon icon={kpi.icon} tone={kpi.tone} shape="circle" className="shrink-0" />
                          </div>
                          {!isHidden && (
                            <div className="space-y-1 mt-auto">
                              <div className="flex items-center justify-between text-label-xs text-muted-foreground font-normal">
                                <span>Emergency Fund</span>
                                <span className="font-medium text-foreground font-tabular">$500/mo</span>
                              </div>
                              <div className="flex items-center justify-between text-label-xs text-muted-foreground font-normal">
                                <span>House Down Payment</span>
                                <span className="font-medium text-foreground font-tabular">$600/mo</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
