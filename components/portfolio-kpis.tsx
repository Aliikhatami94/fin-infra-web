"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MaskableValue } from "@/components/privacy-provider"
import { TrendingUp, TrendingDown, Info, ChevronDown, ChevronUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { motion, AnimatePresence } from "framer-motion"
import { createStaggeredCardVariants, cardHoverVariants } from "@/lib/motion-variants"
import { RiskMetricModal } from "@/components/risk-metric-modal"
import { KPIIcon } from "@/components/ui/kpi-icon"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { getPortfolioKPIs, type PortfolioKPI } from "@/lib/services/portfolio"

type RiskMetricKey = "sharpe" | "beta" | "volatility"

const riskMetricLabelToKey: Record<string, RiskMetricKey> = {
  "Sharpe Ratio": "sharpe",
  Beta: "beta",
  Volatility: "volatility",
}

export function PortfolioKPIs() {
  const [selectedMetric, setSelectedMetric] = useState<RiskMetricKey | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hiddenCards] = useState<Set<string>>(new Set())
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [kpis, setKpis] = useState<PortfolioKPI[]>([])
  const [loading, setLoading] = useState(true)
  
  // Load KPIs on mount
  useEffect(() => {
    async function loadKPIs() {
      setLoading(true)
      try {
        const data = await getPortfolioKPIs()
        setKpis(data)
      } catch (error) {
        console.error("Failed to load portfolio KPIs:", error)
      } finally {
        setLoading(false)
      }
    }
    loadKPIs()
  }, [])

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

  const renderKPICard = (kpi: PortfolioKPI) => {
    const Icon = kpi.icon
    const metricKey = riskMetricLabelToKey[kpi.label]
    const isRiskMetric = metricKey !== undefined
    const isHidden = hiddenCards.has(kpi.label)

    return (
      <motion.div {...cardHoverVariants} className="h-full">
        <Card
          className={`card-standard card-lift h-full ${isRiskMetric ? "cursor-pointer" : ""}`}
          onClick={() => {
            if (metricKey && !isHidden) {
              setSelectedMetric(metricKey)
            }
          }}
        >
          <CardContent className="flex flex-col h-full gap-3 p-5">
            <div className="flex items-start justify-between gap-2">
              <LastSyncBadge timestamp={kpi.lastSynced} source={kpi.source} />
              <KPIIcon icon={Icon} tone="info" size="md" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-label-xs text-muted-foreground">{kpi.label}</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors"
                        aria-label={`More information about ${kpi.label}`}
                      >
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-label-xs font-normal max-w-xs">{kpi.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {isHidden ? (
                <p className="text-kpi font-semibold font-tabular text-foreground">••••••</p>
              ) : (
                <p className="text-kpi font-semibold font-tabular text-foreground">
                  <MaskableValue value={kpi.value} srLabel={`${kpi.label} value`} className="font-tabular" />
                </p>
              )}
              {!isHidden && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="delta-chip text-delta font-medium rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors cursor-help"
                        aria-label={`${kpi.change} change`}
                      >
                        {kpi.positive ? (
                          <TrendingUp className="h-3 w-3 text-[var(--color-positive)]" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-[var(--color-negative)]" />
                        )}
                        <span
                          className={`text-delta font-medium font-tabular ${
                            kpi.positive ? "text-[var(--color-positive)]" : "text-[var(--color-negative)]"
                          }`}
                        >
                          <MaskableValue value={kpi.change} className="font-tabular" />
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-label-xs font-normal">
                        Previous: <span className="font-mono">{kpi.baselineValue}</span>
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-1">
        <h2 className="text-sm font-medium text-muted-foreground">Portfolio Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="card-standard">
              <CardContent className="flex flex-col gap-3 p-5 h-[140px]">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-8 w-32 bg-muted animate-pulse rounded" />
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (kpis.length === 0) {
    return (
      <div className="space-y-1">
        <h2 className="text-sm font-medium text-muted-foreground">Portfolio Metrics</h2>
        <Card className="card-standard">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Connect investment accounts to see your portfolio metrics
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {/* Collapse toggle button */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">Portfolio Metrics</h2>
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
                      <CarouselItem key={kpi.label} className="pl-4 basis-[85%] sm:basis-[48%]">
                        <motion.div {...createStaggeredCardVariants(index, 0)} className="h-full">
                          {renderKPICard(kpi)}
                        </motion.div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>

                {/* Carousel indicators */}
                {kpis.length > 0 && (
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
                )}
              </div>

              {/* Tablet/Desktop: Grid layout */}
              <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-4">
                {kpis.map((kpi, index) => (
                  <motion.div key={kpi.label} {...createStaggeredCardVariants(index, 0)} className="h-full">
                    {renderKPICard(kpi)}
                  </motion.div>
                ))}
              </div>
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>

      <RiskMetricModal
        open={!!selectedMetric}
        onOpenChange={(open) => !open && setSelectedMetric(null)}
        metric={selectedMetric}
      />
    </div>
  )
}
