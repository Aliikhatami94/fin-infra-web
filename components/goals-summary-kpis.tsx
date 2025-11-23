"use client"

import { useMemo, useState, useEffect } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createStaggeredCardVariants, cardHoverVariants } from "@/lib/motion-variants"
import { Progress } from "@/components/ui/progress"
import { useOnboardingState } from "@/hooks/use-onboarding-state"

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
        <Card className="card-standard h-full">
          <CardContent className="p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-0.5 min-w-0 w-full">
                <div className="flex justify-between items-start">
                   <p className="text-xs font-medium text-muted-foreground truncate">{primaryLabel}</p>
                   <div className="flex items-center px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-medium">
                     {percentComplete}%
                   </div>
                </div>
                <div className="flex items-baseline justify-between">
                   <p className="text-2xl font-bold font-tabular text-foreground tracking-tight">{percentComplete}%</p>
                   <p className="text-xs text-muted-foreground">of ${totalTarget.toLocaleString()}</p>
                </div>
                <Progress value={percentComplete} className="h-1.5 mt-1" />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-end">
               <div className="w-12 h-6">
                  <MiniSparkline data={sparklineData} color="hsl(217, 91%, 60%)" />
               </div>
            </div>
          </CardContent>
        </Card>
      )
    }
    
    if (cardId === 'contribution') {
      return (
        <Card className="card-standard h-full">
          <CardContent className="p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs font-medium text-muted-foreground truncate">{monthlyLabel}</p>
                <p className="text-2xl font-bold font-tabular text-foreground tracking-tight">
                  ${monthlyContribution.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground ml-1">/mo</span>
                </p>
              </div>
              <div className="flex items-center px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-medium">
                On Track
              </div>
            </div>

            <div className="mt-2 flex items-center justify-end">
               <div className="w-12 h-6">
                  <MiniSparkline data={contributionData} color="var(--color-positive)" />
               </div>
            </div>
          </CardContent>
        </Card>
      )
    }
    
    // funding card
    return (
      <Card className="card-standard h-full">
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs font-medium text-muted-foreground truncate">{fundingHeadline}</p>
              <p className="text-2xl font-bold font-tabular text-foreground tracking-tight">On Track</p>
            </div>
            <div className="flex items-center px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-medium">
              Safe
            </div>
          </div>

          <div className="mt-2 space-y-0.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate">Emergency Fund</span>
              <span className="font-medium text-foreground">$500</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate">House Down Payment</span>
              <span className="font-medium text-foreground">$600</span>
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
                      <motion.div {...createStaggeredCardVariants(card.index, 0)} {...cardHoverVariants} className="h-full">
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
            <div className="hidden md:grid grid-cols-2 xl:grid-cols-4 gap-4 auto-rows-fr">
              {kpiCards.map((card) => (
                <motion.div key={card.id} {...createStaggeredCardVariants(card.index, 0)} {...cardHoverVariants} className="h-full">
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
