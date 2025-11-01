"use client"

import { useMemo, useState, useEffect } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, DollarSign, Target, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { useOnboardingState } from "@/hooks/use-onboarding-state"
import { KPIIcon } from "@/components/ui/kpi-icon"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

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

  useEffect(() => {
    if (!carouselApi) {
      return
    }

    setCurrentSlide(carouselApi.selectedScrollSnap())

    carouselApi.on("select", () => {
      setCurrentSlide(carouselApi.selectedScrollSnap())
    })
  }, [carouselApi])

  const kpiCards = [
    { id: 'progress', index: 0 },
    { id: 'contribution', index: 1 },
    { id: 'funding', index: 2 },
  ]

  const renderKPICard = (cardId: string, index: number) => {
    if (cardId === 'progress') {
      return (
        <Card className="card-standard card-lift h-full min-h-[200px] md:min-h-[220px] overflow-hidden">
          <CardContent className="flex h-full flex-col gap-2 p-4 md:p-5 w-full min-w-0">
            <div className="flex items-start justify-between gap-2 min-w-0">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <p className="text-label-xs text-muted-foreground truncate">{primaryLabel}</p>
                  <LastSyncBadge timestamp="5 min ago" source="Manual" />
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-label-xs text-muted-foreground font-normal">
                    <div className="min-w-0">
                      <span className="block">Saved</span>
                      <span className="block font-medium text-foreground font-tabular truncate">${totalSaved.toLocaleString()}</span>
                    </div>
                    <div className="min-w-0 text-right">
                      <span className="block">Target</span>
                      <span className="block font-medium text-foreground font-tabular truncate">${totalTarget.toLocaleString()}</span>
                    </div>
                  </div>
                  <Progress value={percentComplete} aria-label={`${percentComplete}% of goal funded`} />
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-kpi font-semibold font-tabular">{percentComplete}%</span>
                    <span className="text-label-xs text-muted-foreground font-normal shrink-0">complete</span>
                  </div>
                </div>
              </div>
              <KPIIcon icon={Target} tone="info" shape="circle" className="shrink-0" />
            </div>
            <div className="flex items-end justify-between gap-2 mt-auto min-w-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors cursor-help text-label-xs text-[var(--color-positive)] shrink-0"
                      aria-label="Goal progress in the last 6 months"
                    >
                      Last 6 months
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-label-xs font-normal">Previous balance: $54,000</p>
                    <p className="text-label-xs font-normal">Current balance: ${totalSaved.toLocaleString()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="shrink-0 flex-1 flex justify-end min-w-0 max-w-[100px]">
                <MiniSparkline data={sparklineData} color="hsl(217, 91%, 60%)" />
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }
    
    if (cardId === 'contribution') {
      return (
        <Card className="card-standard card-lift h-full min-h-[200px] md:min-h-[220px] overflow-hidden">
          <CardContent className="flex h-full flex-col gap-2 p-4 md:p-5 w-full min-w-0">
            <div className="flex items-start justify-between gap-2 min-w-0">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <p className="text-label-xs text-muted-foreground truncate">{monthlyLabel}</p>
                  <LastSyncBadge timestamp="5 min ago" source="Manual" />
                </div>
                <p className="text-kpi font-semibold font-tabular truncate">
                  ${monthlyContribution.toLocaleString()}
                  <span className="text-body-sm font-normal text-muted-foreground">/mo</span>
                </p>
              </div>
              <KPIIcon icon={DollarSign} tone="positive" shape="circle" className="shrink-0" />
            </div>
            <div className="flex items-end justify-between gap-2 mt-auto min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="delta-chip text-delta font-medium rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors cursor-help shrink-0"
                        aria-label={`${contributionRate}% of target contribution`}
                      >
                        <span className="text-label-xs text-[var(--color-warning)]">{contributionRate}%</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-label-xs font-normal">Target: ${targetContribution.toLocaleString()}/mo</p>
                      <p className="text-label-xs font-normal">Current: ${monthlyContribution.toLocaleString()}/mo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-label-xs text-muted-foreground font-normal shrink-0">of target</span>
              </div>
              <div className="shrink-0 flex-1 flex justify-end min-w-0 max-w-[100px]">
                <MiniSparkline data={contributionData} color="var(--color-positive)" />
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }
    
    // funding card
    return (
      <Card className="card-standard card-lift h-full min-h-[200px] md:min-h-[220px] overflow-hidden">
        <CardContent className="flex h-full flex-col gap-2 p-4 md:p-5 w-full min-w-0">
          <div className="flex items-start justify-between gap-2 min-w-0">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <p className="text-label-xs text-muted-foreground truncate">{fundingHeadline}</p>
                <LastSyncBadge timestamp="5 min ago" source="Manual" />
              </div>
              <p className="text-title-sm font-semibold text-foreground">On Track</p>
            </div>
            <KPIIcon icon={TrendingUp} tone="positive" shape="circle" className="shrink-0" />
          </div>
          <div className="space-y-1 mt-auto">
            <div className="flex items-center justify-between gap-2 text-label-xs text-muted-foreground font-normal min-w-0">
              <span className="truncate flex-1">Emergency Fund</span>
              <span className="font-medium text-foreground font-tabular shrink-0">$500/mo</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-label-xs text-muted-foreground font-normal min-w-0">
              <span className="truncate flex-1">House Down Payment</span>
              <span className="font-medium text-foreground font-tabular shrink-0">$600/mo</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-1">
      {/* Collapse toggle button */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">Goal Summary</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 text-xs"
        >
          {isCollapsed ? (
            <>
              <ChevronDown className="mr-1 h-3.5 w-3.5" />
              Show summary
            </>
          ) : (
            <>
              <ChevronUp className="mr-1 h-3.5 w-3.5" />
              Hide summary
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
              <Carousel
                setApi={setCarouselApi}
                opts={{
                  align: "center",
                  loop: false,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4 pt-4">
                  {kpiCards.map((card) => (
                    <CarouselItem key={card.id} className="pl-4 basis-[85%] sm:basis-[48%]">
                      <motion.div {...createStaggeredCardVariants(card.index, 0)} className="h-full">
                        {renderKPICard(card.id, card.index)}
                      </motion.div>
                    </CarouselItem>
                  ))}
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
              {kpiCards.map((card) => (
                <motion.div key={card.id} {...createStaggeredCardVariants(card.index, 0)} className="h-full">
                  {renderKPICard(card.id, card.index)}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
