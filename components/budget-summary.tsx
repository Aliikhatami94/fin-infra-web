"use client"

import { type ComponentType, type SVGProps, useMemo, useState, useEffect } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, DollarSign, TrendingDown, Wallet } from "lucide-react"
import { motion } from "framer-motion"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useOnboardingState } from "@/hooks/use-onboarding-state"
import { KPIIcon } from "@/components/ui/kpi-icon"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

type SummaryItem = {
  label: string
  value: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  subtext?: string
  progress?: number
  badge?: string
  actionable?: boolean
}

const baseSummary: SummaryItem[] = [
  {
    label: "Total Budgeted",
    value: "$6,500",
    icon: DollarSign,
    actionable: true,
  },
  {
    label: "Actual Spent",
    value: "$5,840",
    icon: TrendingDown,
    subtext: "5% vs. Last Month",
    progress: 90,
  },
  {
    label: "Remaining",
    value: "$660",
    icon: Wallet,
    badge: "10% Remaining",
  },
]

export function BudgetSummary() {
  const { state, hydrated } = useOnboardingState()
  const persona = hydrated ? state.persona : undefined
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!carouselApi) return

    setCurrentSlide(carouselApi.selectedScrollSnap())

    carouselApi.on("select", () => {
      setCurrentSlide(carouselApi.selectedScrollSnap())
    })
  }, [carouselApi])

  const summary: SummaryItem[] = useMemo(() => {
    if (!persona) {
      return baseSummary
    }

    const customized = baseSummary.map((item) => ({ ...item }))

    if (persona.goalsFocus === "debt_paydown") {
      customized[0] = {
        ...customized[0],
        label: "Debt Paydown Budget",
        value: "$1,200",
        badge: "Snowball active",
        icon: TrendingDown,
      }
      customized[1] = {
        ...customized[1],
        subtext: "$300 extra vs. plan",
      }
    } else if (persona.goalsFocus === "financial_stability") {
      customized[2] = {
        ...customized[2],
        label: "Emergency Buffer",
        value: "$18,660",
        badge: "7.5 months",
      }
    } else if (persona.goalsFocus === "wealth_building") {
      customized[0] = {
        ...customized[0],
        label: "Auto-invest Budget",
        value: "$3,200",
        icon: DollarSign,
      }
    }

    if (persona.budgetingStyle === "automated") {
      customized[0] = { ...customized[0], actionable: false }
    }

    return customized
  }, [persona])

  const renderCard = (item: SummaryItem, index: number) => {
    const Icon = item.icon
    const progressValue = item.progress ?? 0
    const progressState =
          item.progress === undefined
            ? null
            : progressValue > 110
              ? "critical"
              : progressValue > 100
                ? "over"
                : progressValue >= 90
                  ? "near"
                  : "under"
        const progressColorClass =
          progressState === "over" || progressState === "critical"
            ? "text-[var(--color-negative)]"
            : progressState === "near"
              ? "text-orange-500 dark:text-orange-400"
              : "text-[var(--color-positive)]"
        const progressStatusLabel =
          progressState === "over" || progressState === "critical"
            ? "over budget"
            : progressState === "near"
              ? "nearing budget limit"
              : "under budget"

        const tone = item.progress !== undefined
          ? progressState === "over" || progressState === "critical"
            ? "negative"
            : progressState === "near"
              ? "warning"
              : "positive"
          : item.badge?.includes("Remaining")
            ? "positive"
            : "neutral"

          return (
            <motion.div key={index} className="h-full" {...createStaggeredCardVariants(index, 0)}>
              <Card className="card-standard card-lift h-full min-h-[280px]">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div className="sr-only" aria-live="polite">{`Budget information for ${item.label}.`}</div>
                    <LastSyncBadge timestamp="3 min ago" source="Plaid" />
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="text-label-xs text-muted-foreground">{item.label}</p>
                      <p className="text-kpi font-semibold font-tabular break-words text-foreground">
                        {item.value}
                      </p>
                    </div>
                    <KPIIcon icon={Icon} tone={tone as "positive" | "negative" | "warning" | "neutral"} size="md" />
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.subtext && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="delta-chip text-delta font-medium text-muted-foreground inline-flex items-center rounded-md px-1.5 py-1 transition-colors hover:bg-muted/40 cursor-help">
                              {item.subtext}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-label-xs font-normal">Last Month: $6,150</p>
                            <p className="text-label-xs font-normal">This Month: $5,840</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {item.badge && (
                        <Badge variant="secondary" className="border-0 bg-green-500/10 text-[var(--color-positive)]">
                          {item.badge}
                        </Badge>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      {item.actionable ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Button variant="outline" size="sm" className="h-9 w-9 p-0" disabled>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Coming soon - Auto-invest configuration</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : item.progress !== undefined ? (
                        <div
                          className="relative"
                          role="img"
                          aria-label={`${item.label} is ${progressValue}% complete, ${progressStatusLabel}.`}
                          data-progress-state={progressState ?? undefined}
                        >
                          <svg className="h-16 w-16 -rotate-90" aria-hidden="true">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="5"
                              fill="none"
                              className="text-muted/20"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="5"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 28}`}
                              strokeDashoffset={`${2 * Math.PI * 28 * (1 - item.progress / 100)}`}
                              className={progressColorClass}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-bold tabular-nums">{item.progress}%</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
    )
  }

  return (
    <TooltipProvider>
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
            {summary.map((item, index) => (
              <CarouselItem key={item.label} className="pl-4 basis-[57%]">
                {renderCard(item, index)}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Carousel indicators */}
        <div className="flex justify-center gap-1.5">
          {summary.map((_, index) => (
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

      {/* Tablet/Desktop: Fixed width cards layout */}
      <div className="hidden md:flex flex-wrap gap-4">
        {summary.map((item, index) => (
          <div key={item.label} className="w-[calc(50%-0.5rem)] xl:w-[calc(33.333%-0.667rem)]">
            {renderCard(item, index)}
          </div>
        ))}
      </div>
    </TooltipProvider>
  )
}
