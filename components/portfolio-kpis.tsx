"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MaskableValue } from "@/components/privacy-provider"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createStaggeredCardVariants, cardHoverVariants } from "@/lib/motion-variants"
import { RiskMetricModal } from "@/components/risk-metric-modal"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { getPortfolioKPIs, getMockKPIs, type PortfolioKPI } from "@/lib/services/portfolio"

type RiskMetricKey = "sharpe" | "beta" | "volatility"

const riskMetricLabelToKey: Record<string, RiskMetricKey> = {
  "Sharpe Ratio": "sharpe",
  Beta: "beta",
  Volatility: "volatility",
}

interface PortfolioKPIsProps {
  demoMode?: boolean
  mockDataOverride?: PortfolioKPI[]
}

export function PortfolioKPIs({ demoMode = false, mockDataOverride }: PortfolioKPIsProps) {
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
        let data: PortfolioKPI[]
        if (mockDataOverride) {
          data = mockDataOverride
        } else {
          data = demoMode ? getMockKPIs() : await getPortfolioKPIs()
        }
        console.log('[FRONTEND_KPIs] ========================================')
        console.log('[FRONTEND_KPIs] Received KPIs count:', data.length)
        data.forEach(kpi => {
          console.log(`[FRONTEND_KPIs] ${kpi.label}: ${kpi.value} (${kpi.change}) source=${kpi.source}`)
        })
        console.log('[FRONTEND_KPIs] ========================================')
        setKpis(data)
      } catch (error) {
        console.error("Failed to load portfolio KPIs:", error)
      } finally {
        setLoading(false)
      }
    }
    loadKPIs()
  }, [demoMode, mockDataOverride])

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
          className={`card-standard h-full ${isRiskMetric ? "cursor-pointer" : ""}`}
          onClick={() => {
            if (metricKey && !isHidden) {
              setSelectedMetric(metricKey)
            }
          }}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-0.5 min-w-0">
                <p className="text-[11px] font-medium text-muted-foreground/80 uppercase tracking-wide truncate">{kpi.label}</p>
                {isHidden ? (
                  <p className="text-2xl font-semibold font-tabular text-foreground">••••••</p>
                ) : (
                  <p className="text-2xl font-semibold font-tabular text-foreground tracking-tighter">
                    <MaskableValue value={kpi.value} srLabel={`${kpi.label} value`} className="font-tabular" />
                  </p>
                )}
              </div>
              {!isHidden && (
                <div className={cn("flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold", 
                  kpi.positive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500" : "bg-rose-500/10 text-rose-600 dark:text-rose-500"
                )}>
                  {kpi.positive ? "+" : ""}
                  <MaskableValue value={kpi.change} srLabel="change" className="font-tabular" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Portfolio Metrics</h2>
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)]">
              <Card className="card-standard h-full">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                      <div className="h-7 w-24 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            </div>
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

              {/* Tablet/Desktop: Fixed width cards layout */}
              <div className="hidden md:flex flex-wrap gap-4">
                {kpis.map((kpi, index) => (
                  <div key={kpi.label} className="w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)]">
                    <motion.div {...createStaggeredCardVariants(index, 0)} className="h-full">
                      {renderKPICard(kpi)}
                    </motion.div>
                  </div>
                ))}
              </div>
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
