"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { MaskableValue } from "@/components/privacy-provider"
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"
import { Line, LineChart, ResponsiveContainer } from "recharts"
import { createStaggeredCardVariants, cardHoverVariants } from "@/lib/motion-variants"
import { formatCurrency } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { KPIIcon } from "@/components/ui/kpi-icon"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

type TimeScale = "daily" | "weekly" | "monthly"

const timeScaleOptions: Array<{ id: TimeScale; label: string; srHint: string }> = [
  { id: "daily", label: "Daily", srHint: "Show the last 7 days" },
  { id: "weekly", label: "Weekly", srHint: "Show the last 6 weeks" },
  { id: "monthly", label: "Monthly", srHint: "Show the last 6 months" },
]

const timeScaleHelpId = "cashflow-time-scale-help"

const timeScaleSnapshots: Record<TimeScale, {
  netCashFlow: number
  changePercent: number
  changeComparison: string
  netSparkline: Array<{ value: number }>
  totalInflow: number
  inflowNote: string
  inflowSparkline: Array<{ value: number }>
  totalOutflow: number
  outflowNote: string
  outflowSparkline: Array<{ value: number }>
}> = {
  daily: {
    netCashFlow: 240,
    changePercent: 6,
    changeComparison: "vs. prior day: $225",
    netSparkline: [
      { value: 180 },
      { value: 210 },
      { value: 195 },
      { value: 260 },
      { value: 230 },
      { value: 285 },
      { value: 240 },
    ],
    totalInflow: 620,
    inflowNote: "Paycheck boosted by overtime",
    inflowSparkline: [
      { value: 420 },
      { value: 430 },
      { value: 440 },
      { value: 620 },
      { value: 480 },
      { value: 630 },
      { value: 620 },
    ],
    totalOutflow: 380,
    outflowNote: "Dining & transit led spending",
    outflowSparkline: [
      { value: 210 },
      { value: 220 },
      { value: 230 },
      { value: 300 },
      { value: 260 },
      { value: 310 },
      { value: 380 },
    ],
  },
  weekly: {
    netCashFlow: 980,
    changePercent: 12,
    changeComparison: "vs. last week: $875",
    netSparkline: [
      { value: 620 },
      { value: 760 },
      { value: 680 },
      { value: 980 },
      { value: 820 },
      { value: 1040 },
      { value: 980 },
    ],
    totalInflow: 3720,
    inflowNote: "82% salary • 12% reimbursements",
    inflowSparkline: [
      { value: 3200 },
      { value: 3300 },
      { value: 3450 },
      { value: 3625 },
      { value: 3550 },
      { value: 3700 },
      { value: 3720 },
    ],
    totalOutflow: 2740,
    outflowNote: "Housing + groceries led spend",
    outflowSparkline: [
      { value: 2500 },
      { value: 2450 },
      { value: 2525 },
      { value: 2610 },
      { value: 2560 },
      { value: 2680 },
      { value: 2740 },
    ],
  },
  monthly: {
    netCashFlow: 1500,
    changePercent: 10,
    changeComparison: "vs. last month: $1,364",
    netSparkline: [
      { value: 1200 },
      { value: 1500 },
      { value: 1300 },
      { value: 1800 },
      { value: 1600 },
      { value: 2100 },
      { value: 1500 },
    ],
    totalInflow: 9000,
    inflowNote: "83% from salary deposits",
    inflowSparkline: [
      { value: 8200 },
      { value: 8500 },
      { value: 8800 },
      { value: 9200 },
      { value: 8900 },
      { value: 9500 },
      { value: 9000 },
    ],
    totalOutflow: 7500,
    outflowNote: "Highest: Rent ($2,200)",
    outflowSparkline: [
      { value: 7000 },
      { value: 7000 },
      { value: 7500 },
      { value: 7400 },
      { value: 7300 },
      { value: 7400 },
      { value: 7500 },
    ],
  },
}

export function CashFlowKPIs() {
  const [activeTimeScale, setActiveTimeScale] = useState<TimeScale>("monthly")
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const optionRefs = useRef<Record<TimeScale, HTMLButtonElement | null>>({
    daily: null,
    weekly: null,
    monthly: null,
  })

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

  const handleTimeScaleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const { key } = event
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(key)) {
        return
      }

      event.preventDefault()

      const refs = optionRefs.current
      const activeElement = document.activeElement as HTMLButtonElement | null
      const focusedIndex = timeScaleOptions.findIndex((option) => refs[option.id] === activeElement)
      const currentIndex =
        focusedIndex >= 0
          ? focusedIndex
          : timeScaleOptions.findIndex((option) => option.id === activeTimeScale)

      if (currentIndex < 0) {
        return
      }

      let nextIndex = currentIndex

      if (key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % timeScaleOptions.length
      } else if (key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + timeScaleOptions.length) % timeScaleOptions.length
      } else if (key === "Home") {
        nextIndex = 0
      } else if (key === "End") {
        nextIndex = timeScaleOptions.length - 1
      }

      const nextOption = timeScaleOptions[nextIndex]
      setActiveTimeScale(nextOption.id)

      const focusTarget = optionRefs.current[nextOption.id]
      if (!focusTarget) {
        return
      }

      if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(() => {
          focusTarget.focus()
        })
        return
      }

      focusTarget.focus()
    },
    [activeTimeScale, setActiveTimeScale],
  )

  const snapshot = useMemo(() => timeScaleSnapshots[activeTimeScale], [activeTimeScale])

  const formattedNetCashFlow = formatCurrency(snapshot.netCashFlow, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  const formattedTotalInflow = formatCurrency(snapshot.totalInflow, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  const formattedTotalOutflow = formatCurrency(snapshot.totalOutflow, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  const kpiCards = [
    {
      id: "net-cash-flow",
      label: "Net Cash Flow",
      value: formattedNetCashFlow,
      icon: TrendingUp,
      tone: "info" as const,
      sparkline: snapshot.netSparkline,
      change: snapshot.changePercent,
      changeComparison: snapshot.changeComparison,
      extraContent: (
        <div className="border-t border-border/40 pt-3 mt-auto space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[var(--color-positive)]" />
              <span className="text-muted-foreground">Income</span>
            </div>
            <div className="w-16 h-6">
              <ResponsiveContainer width="100%" height="100%" aria-hidden="true">
                <LineChart data={snapshot.inflowSparkline}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-positive)"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[var(--color-warning)]" />
              <span className="text-muted-foreground">Expenses</span>
            </div>
            <div className="w-16 h-6">
              <ResponsiveContainer width="100%" height="100%" aria-hidden="true">
                <LineChart data={snapshot.outflowSparkline}>
                  <Line type="monotone" dataKey="value" stroke="var(--color-warning)" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "total-inflow",
      label: "Total Inflow",
      value: formattedTotalInflow,
      icon: ArrowDownRight,
      tone: "positive" as const,
      sparkline: snapshot.inflowSparkline,
      note: snapshot.inflowNote,
    },
    {
      id: "total-outflow",
      label: "Total Outflow",
      value: formattedTotalOutflow,
      icon: ArrowUpRight,
      tone: "warning" as const,
      sparkline: snapshot.outflowSparkline,
      note: snapshot.outflowNote,
    },
  ]

  const renderKPICard = (kpi: typeof kpiCards[0]) => (
    <motion.div {...cardHoverVariants} className="h-full">
      <Card className="card-standard h-full">
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs font-medium text-muted-foreground truncate">{kpi.label}</p>
              <p className="text-2xl font-bold font-tabular text-foreground tracking-tight">
                <MaskableValue value={kpi.value} srLabel={`${kpi.label} value`} className="font-tabular" />
              </p>
            </div>
            {kpi.change !== undefined && (
              <div className={cn("flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium", 
                kpi.change >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
              )}>
                {kpi.change >= 0 ? "+" : ""}{kpi.change}%
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            {kpi.note ? (
              <p className="text-xs text-muted-foreground truncate max-w-[120px]" title={kpi.note}>{kpi.note}</p>
            ) : <div />}

            {kpi.sparkline && (
              <div className="w-12 h-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kpi.sparkline}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={kpi.tone === "positive" ? "var(--color-positive)" : kpi.tone === "warning" ? "var(--color-warning)" : "hsl(210, 100%, 60%)"}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-card/30 px-3 py-2">
        <p className="text-xs text-muted-foreground">
          Time scale: <span className="font-medium text-foreground">{timeScaleOptions.find((option) => option.id === activeTimeScale)?.label ?? ""}</span>
        </p>
        <div className="sr-only" id={timeScaleHelpId}>
          Use left and right arrow keys to move between time scale options.
        </div>
        <div
          role="group"
          aria-label="Select cash flow time scale"
          aria-describedby={timeScaleHelpId}
          className="flex items-center gap-1"
          onKeyDown={handleTimeScaleKeyDown}
        >
          {timeScaleOptions.map((option) => {
            const isActive = option.id === activeTimeScale
            return (
              <Button
                key={option.id}
                type="button"
                variant="outline"
                size="sm"
                aria-pressed={isActive}
                ref={(node) => {
                  optionRefs.current[option.id] = node
                }}
                className={cn(
                  "h-7 rounded-lg border-border/50 px-2.5 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-1",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card/60 text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
                onClick={() => setActiveTimeScale(option.id)}
              >
                {option.label}
                <span className="sr-only"> – {option.srHint}</span>
              </Button>
            )
          })}
        </div>
      </div>

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
            {kpiCards.map((kpi, index) => (
              <CarouselItem key={kpi.id} className="pl-4 basis-[85%] sm:basis-[48%]">
                <motion.div {...createStaggeredCardVariants(index, 0)} className="h-full">
                  {renderKPICard(kpi)}
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

      {/* Tablet/Desktop: Fixed width cards layout */}
      <div className="hidden md:flex flex-wrap gap-4">
        {kpiCards.map((kpi, index) => (
          <div key={kpi.id} className="w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)]">
            <motion.div {...createStaggeredCardVariants(index, 0)} className="h-full">
              {renderKPICard(kpi)}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  )
}
