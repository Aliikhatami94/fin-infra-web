"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MaskableValue } from "@/components/privacy-provider"
import { Wallet, CreditCard, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { createStaggeredCardVariants, cardHoverVariants } from "@/lib/motion-variants"
import { MicroSparkline } from "@/components/ui/micro-sparkline"
import { KPIIcon } from "@/components/ui/kpi-icon"
import type { SemanticTone } from "@/lib/color-utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

interface AccountsKPICardsProps {
  totalCash: number
  totalCreditDebt: number
  totalInvestments: number
}

const createSparklineSeries = (currentValue: number, baselineValue: number) => {
  const totalPoints = 30
  const delta = currentValue - baselineValue
  const amplitude = Math.abs(delta) * 0.2

  return Array.from({ length: totalPoints }, (_, index) => {
    const progress = index / (totalPoints - 1)
    const base = baselineValue + delta * progress
    const wave = Math.sin(progress * Math.PI * 2) * amplitude * 0.25
    const value = base + wave
    return Number(value.toFixed(2))
  })
}

export function AccountsKPICards({ totalCash, totalCreditDebt, totalInvestments }: AccountsKPICardsProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hiddenCards] = useState<Set<string>>(new Set())

  const kpis: Array<{
    title: string
    value: number
    trend: number
    baselineValue: number
    icon: LucideIcon
    tone: SemanticTone
    sparklineColor: string
    lastSynced: string
    source: string
  }> = [
    {
      title: "Total Cash",
      value: totalCash,
      trend: 2.3,
      baselineValue: totalCash / 1.023,
      icon: Wallet,
      tone: "info",
      sparklineColor: "rgb(37, 99, 235)",
      lastSynced: "3 min ago",
      source: "Plaid",
    },
    {
      title: "Total Credit Debt",
      value: totalCreditDebt,
      trend: -1.2,
      baselineValue: totalCreditDebt / 0.988,
      icon: CreditCard,
      tone: "negative",
      sparklineColor: "rgb(220, 38, 38)",
      lastSynced: "3 min ago",
      source: "Plaid",
    },
    {
      title: "Total Investments",
      value: totalInvestments,
      trend: 5.1,
      baselineValue: totalInvestments / 1.051,
      icon: TrendingUp,
      tone: "positive",
      sparklineColor: "rgb(22, 163, 74)",
      lastSynced: "5 min ago",
      source: "Teller",
    },
  ]

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

  const renderKPICard = (kpi: typeof kpis[0]) => {
    const isHidden = hiddenCards.has(kpi.title)
    const Icon = kpi.icon
    const sparklineData = createSparklineSeries(kpi.value, kpi.baselineValue)

    return (
      <motion.div {...cardHoverVariants} className="h-full pt-2">
        <Card className="card-standard card-lift h-full min-h-[200px] md:min-h-[220px]">
          <CardContent className="flex flex-col h-full gap-2 p-4 md:p-5">
            <div className="flex items-start justify-between gap-2">
              <LastSyncBadge timestamp={kpi.lastSynced} source={kpi.source} />
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-label-xs text-muted-foreground">{kpi.title}</p>
                {isHidden ? (
                  <p className="text-kpi font-semibold font-tabular text-foreground">••••••</p>
                ) : (
                  <p className="text-kpi font-semibold font-tabular break-words text-foreground">
                    <MaskableValue
                      value={`$${Math.abs(kpi.value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                      srLabel={`${kpi.title} value`}
                      className="font-tabular"
                    />
                  </p>
                )}
              </div>
              <KPIIcon icon={Icon} tone={kpi.tone} size="md" />
            </div>
            {!isHidden && (
              <div className="flex items-end justify-between gap-3 mt-auto">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="delta-chip text-delta font-medium rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors cursor-help"
                      aria-label={`${kpi.trend > 0 ? '+' : ''}${kpi.trend}% vs. last month`}
                    >
                      {kpi.trend > 0 ? (
                        <TrendingUp className="h-3 w-3 text-[var(--color-positive)]" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-[var(--color-negative)]" />
                      )}
                      <span
                        className={`text-delta font-medium font-tabular ${kpi.trend > 0 ? "text-[var(--color-positive)]" : "text-[var(--color-negative)]"}`}
                      >
                        {kpi.trend > 0 ? "+" : ""}
                        {kpi.trend}%
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-label-xs font-normal">
                      vs. last month:{" "}
                      <span className="font-mono">
                        ${Math.abs(kpi.baselineValue).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </p>
                  </TooltipContent>
                </Tooltip>
                <MicroSparkline
                  data={sparklineData}
                  color={kpi.sparklineColor}
                  ariaLabel={`${kpi.title} 30-day trend sparkline`}
                  className="h-9 w-24"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-1">
      {/* Collapse toggle button */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">Account Summary</h2>
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
                    {kpis.map((kpi, index) => (
                      <CarouselItem key={kpi.title} className="pl-4 basis-[85%] sm:basis-[48%]">
                        <motion.div {...createStaggeredCardVariants(index, 0)} className="h-full">
                          {renderKPICard(kpi)}
                        </motion.div>
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
                  <motion.div key={kpi.title} {...createStaggeredCardVariants(index, 0)} className="h-full">
                    {renderKPICard(kpi)}
                  </motion.div>
                ))}
              </div>
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
