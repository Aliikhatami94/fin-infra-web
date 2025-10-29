"use client"

import { useState, useEffect, useRef, type MouseEvent } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MaskableValue } from "@/components/privacy-provider"
import { TrendingUp, TrendingDown, Info, DollarSign, TrendingUpIcon, Activity, Target, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { motion, AnimatePresence } from "framer-motion"
import { createStaggeredCardVariants, cardHoverVariants } from "@/lib/motion-variants"
import { RiskMetricModal } from "@/components/risk-metric-modal"
import { KPIIcon } from "@/components/ui/kpi-icon"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type RiskMetricKey = "sharpe" | "beta" | "volatility"

interface KPI {
  label: string
  value: string
  change: string
  baselineValue: string
  positive: boolean
  tooltip: string
  icon: LucideIcon
  lastSynced: string
  source: string
}

const kpis: KPI[] = [
  {
    label: "Total Value",
    value: "$187,650.45",
    change: "+5.7%",
    baselineValue: "$177,520.30",
    positive: true,
    tooltip: "All-time return since account inception",
    icon: DollarSign,
    lastSynced: "Just now",
    source: "Live",
  },
  {
    label: "All-Time P/L",
    value: "+$24,650.45",
    change: "+15.1%",
    baselineValue: "$21,420.10",
    positive: true,
    tooltip: "Total profit/loss since you started investing",
    icon: TrendingUpIcon,
    lastSynced: "Just now",
    source: "Live",
  },
  {
    label: "Sharpe Ratio",
    value: "1.85",
    change: "+0.12",
    baselineValue: "1.73",
    positive: true,
    tooltip: "Risk-adjusted return metric. Higher is better (>1 is good, >2 is excellent)",
    icon: Target,
    lastSynced: "5 min ago",
    source: "Calculated",
  },
  {
    label: "Beta",
    value: "0.92",
    change: "-0.05",
    baselineValue: "0.97",
    positive: true,
    tooltip: "Volatility relative to market (SPY). <1 means less volatile than market",
    icon: Activity,
    lastSynced: "5 min ago",
    source: "Calculated",
  },
  {
    label: "Volatility",
    value: "14.2%",
    change: "-1.3%",
    baselineValue: "15.5%",
    positive: true,
    tooltip: "Standard deviation of returns. Lower is less risky",
    icon: Activity,
    lastSynced: "5 min ago",
    source: "Calculated",
  },
  {
    label: "YTD Return",
    value: "+18.4%",
    change: "+2.1%",
    baselineValue: "+16.3%",
    positive: true,
    tooltip: "Year-to-date return since January 1st",
    icon: TrendingUp,
    lastSynced: "Just now",
    source: "Live",
  },
]

const riskMetricLabelToKey: Record<string, RiskMetricKey> = {
  "Sharpe Ratio": "sharpe",
  Beta: "beta",
  Volatility: "volatility",
}

export function PortfolioKPIs() {
  const [selectedMetric, setSelectedMetric] = useState<RiskMetricKey | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hiddenCards, setHiddenCards] = useState<Set<string>>(new Set())
  const [currentSlide, setCurrentSlide] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  const renderKPICard = (kpi: KPI) => {
    const Icon = kpi.icon
    const metricKey = riskMetricLabelToKey[kpi.label]
    const isRiskMetric = metricKey !== undefined
    const isHidden = hiddenCards.has(kpi.label)

    return (
      <motion.div {...cardHoverVariants} className="h-full">
        <Card
          className={`card-standard card-lift h-full min-h-[260px] md:min-h-[280px] ${isRiskMetric ? "cursor-pointer" : ""}`}
          onClick={() => {
            if (metricKey && !isHidden) {
              setSelectedMetric(metricKey)
            }
          }}
        >
          <CardContent className="flex flex-col h-full gap-3 p-4 md:p-6">
            <div className="flex items-start justify-between gap-2">
              <LastSyncBadge timestamp={kpi.lastSynced} source={kpi.source} />
              {/* Per-card visibility toggle */}
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
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between gap-3">
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
                <KPIIcon icon={Icon} tone="info" size="md" />
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
                        aria-label={`${kpi.change} vs. last month`}
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
                        vs. last month: <span className="font-mono">{kpi.baselineValue}</span>
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
                      <motion.div {...createStaggeredCardVariants(index, 0)} className="h-full">
                        {renderKPICard(kpi)}
                      </motion.div>
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
