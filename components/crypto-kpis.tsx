"use client"

import { useState, useEffect, type MouseEvent } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MaskableValue } from "@/components/privacy-provider"
import {
  TrendingUp,
  TrendingDown,
  Info,
  Bitcoin,
  DollarSign,
  Coins,
  TrendingUpIcon,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { KPIIcon } from "@/components/ui/kpi-icon"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

const kpis = [
  {
    label: "Total Crypto Value",
    value: "$24,580.32",
    change: "+8.4%",
    baselineValue: "$22,680.50",
    positive: true,
    tooltip: "Total value of all crypto holdings",
    icon: DollarSign,
    lastSynced: "Just now",
    source: "Live",
    sparkline: [19800, 20120, 20510, 21240, 22010, 23120, 24580],
  },
  {
    label: "BTC Dominance",
    value: "46.2%",
    change: "+2.1%",
    baselineValue: "44.1%",
    positive: true,
    tooltip: "Bitcoin's share of your total crypto portfolio",
    icon: Bitcoin,
    lastSynced: "Just now",
    source: "Live",
    sparkline: [41.8, 42.6, 43.1, 43.8, 44.2, 45.1, 46.2],
  },
  {
    label: "24h Change",
    value: "+$1,842.50",
    change: "+8.1%",
    baselineValue: "$22,737.82",
    positive: true,
    tooltip: "Total portfolio change in the last 24 hours",
    icon: TrendingUpIcon,
    lastSynced: "Just now",
    source: "Live",
    sparkline: [0, 240, 380, 760, 1020, 1540, 1842],
  },
  {
    label: "Top Asset Change",
    value: "BTC +9.2%",
    change: "+$2,340",
    baselineValue: "$25,384",
    positive: true,
    clickable: true,
    tooltip: "Your best performing asset in the last 24h",
    icon: Coins,
    lastSynced: "Just now",
    source: "Live",
    sparkline: [21500, 22150, 22420, 22880, 23210, 23640, 23890],
  },
]

const Sparkline = ({ data, positive }: { data: number[]; positive: boolean }) => {
  if (!data.length) return null

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
    <svg
      className="h-12 w-24"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      role="img"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "var(--color-positive)" : "var(--color-negative)"}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CryptoKPIs() {
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hiddenCards, setHiddenCards] = useState<Set<string>>(new Set())
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)

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
                  {kpis.map((kpi, index) => {
                    const Icon = kpi.icon
                    const isHidden = hiddenCards.has(kpi.label)
                    return (
                      <CarouselItem key={kpi.label} className="pl-4 basis-[85%]">
                        <motion.div {...createStaggeredCardVariants(index, 0)} className="h-full">
                          <Card
                            className={`card-standard card-lift h-full min-h-[260px] md:min-h-[280px] ${kpi.clickable ? "cursor-pointer" : ""}`}
                            onClick={() => kpi.clickable && !isHidden && router.push("/crypto/btc")}
                          >
                            <CardContent className="flex flex-col h-full gap-3 p-4 md:p-6">
                              <div className="flex items-start justify-between gap-2">
                                <LastSyncBadge timestamp={kpi.lastSynced} source={kpi.source} />
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
                                  <div className="flex items-center gap-2">
                                    <p className="text-label-xs text-muted-foreground">{kpi.label}</p>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            type="button"
                                            className="inline-flex items-center justify-center rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors"
                                            aria-label={`More information about ${kpi.label}`}
                                          >
                                            <Info className="h-3 w-3 text-muted-foreground" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="text-label-xs font-normal">{kpi.tooltip}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <KPIIcon icon={Icon} tone="info" />
                                </div>
                                {isHidden ? (
                                  <p className="text-kpi font-semibold font-tabular text-foreground">••••••</p>
                                ) : (
                                  <p
                                    className="text-kpi font-semibold font-tabular text-foreground"
                                    aria-label={`${kpi.label} ${kpi.value}`}
                                  >
                                    <MaskableValue value={kpi.value} srLabel={`${kpi.label} value`} className="font-tabular" />
                                  </p>
                                )}
                                {!isHidden && (
                                  <div className="flex items-center justify-between gap-3">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            type="button"
                                            className="delta-chip text-delta font-medium rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors cursor-help"
                                            aria-label={`${kpi.change} vs. yesterday`}
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
                                            vs. yesterday: <span className="font-mono">{kpi.baselineValue}</span>
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <Sparkline data={kpi.sparkline} positive={kpi.positive} />
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </CarouselItem>
                    )
                  })}
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
              {kpis.map((kpi, index) => {
                const Icon = kpi.icon
                const isHidden = hiddenCards.has(kpi.label)
                return (
                  <motion.div key={kpi.label} {...createStaggeredCardVariants(index, 0)} className="h-full">
                    <Card
                      className={`card-standard card-lift h-full min-h-[260px] md:min-h-[280px] ${kpi.clickable ? "cursor-pointer" : ""}`}
                      onClick={() => kpi.clickable && !isHidden && router.push("/crypto/btc")}
                    >
                      <CardContent className="flex flex-col h-full gap-3 p-4 md:p-6">
                        <div className="flex items-start justify-between gap-2">
                          <LastSyncBadge timestamp={kpi.lastSynced} source={kpi.source} />
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
                            <div className="flex items-center gap-2">
                              <p className="text-label-xs text-muted-foreground">{kpi.label}</p>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      className="inline-flex items-center justify-center rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors"
                                      aria-label={`More information about ${kpi.label}`}
                                    >
                                      <Info className="h-3 w-3 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-label-xs font-normal">{kpi.tooltip}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <KPIIcon icon={Icon} tone="info" />
                          </div>
                          {isHidden ? (
                            <p className="text-kpi font-semibold font-tabular text-foreground">••••••</p>
                          ) : (
                            <p
                              className="text-kpi font-semibold font-tabular text-foreground"
                              aria-label={`${kpi.label} ${kpi.value}`}
                            >
                              <MaskableValue value={kpi.value} srLabel={`${kpi.label} value`} className="font-tabular" />
                            </p>
                          )}
                          {!isHidden && (
                            <div className="flex items-center justify-between gap-3">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      className="delta-chip text-delta font-medium rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors cursor-help"
                                      aria-label={`${kpi.change} vs. yesterday`}
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
                                      vs. yesterday: <span className="font-mono">{kpi.baselineValue}</span>
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <Sparkline data={kpi.sparkline} positive={kpi.positive} />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
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
