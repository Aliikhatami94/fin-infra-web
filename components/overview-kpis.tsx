"use client"

import { useMemo, useState, type MouseEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { KPI, KPIQuickAction } from "@/types/domain"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { MaskableValue } from "@/components/privacy-provider"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createStaggeredCardVariants, cardHoverVariants } from "@/lib/motion-variants"
import { getTrendSemantic } from "@/lib/color-utils"
import { getDashboardKpis } from "@/lib/services"
import { useOnboardingState } from "@/hooks/use-onboarding-state"
import { Button } from "@/components/ui/button"
import { navigateInApp } from "@/lib/linking"
import { PlanAdjustModal } from "@/components/plan-adjust-modal"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
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
    <svg className="w-16 h-8" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface KPICardContentProps {
  kpi: KPI
  index: number
  isHidden: boolean
  onPlanModalOpen: () => void
  router: ReturnType<typeof useRouter>
}

function KPICardContent({ kpi, index, isHidden, onPlanModalOpen, router }: KPICardContentProps) {
  const trendValue = kpi.trend === "up" ? 1 : kpi.trend === "down" ? -1 : 0
  const trendStyles = getTrendSemantic(trendValue)

  return (
      <Link href={kpi.href} className="h-full block">
        <motion.div {...createStaggeredCardVariants(index, 0)} {...cardHoverVariants} className="h-full">
          <Card className="cursor-pointer card-standard h-full">
            <CardContent className="p-3">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-0 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground truncate">{kpi.label}</p>
                  {isHidden ? (
                    <p className="text-2xl font-bold font-tabular text-foreground">••••••</p>
                  ) : (
                    <p className="text-2xl font-bold font-tabular text-foreground tracking-tight">
                      <MaskableValue value={kpi.value} srLabel={`${kpi.label} value`} className="font-tabular" />
                    </p>
                  )}
                </div>
                {!isHidden && (
                  <div className={cn("flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium", 
                    kpi.trend === "up" ? "bg-emerald-500/10 text-emerald-500" : 
                    kpi.trend === "down" ? "bg-rose-500/10 text-rose-500" : 
                    "bg-slate-100 text-slate-500 dark:bg-slate-800"
                  )}>
                    <MaskableValue value={kpi.change} srLabel="change" className="font-tabular" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Link>
  )
}

export function OverviewKPIs() {
  const { state, hydrated } = useOnboardingState()
  const router = useRouter()
  const [kpis, setKpis] = useState<ReturnType<typeof getDashboardKpis> extends Promise<infer T> ? T : never>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [hiddenCards] = useState<Set<string>>(new Set())
  
  // Load KPIs asynchronously
  useEffect(() => {
    let mounted = true
    
    const loadKpis = async () => {
      try {
        const data = await getDashboardKpis(hydrated ? state.persona : undefined)
        if (mounted) {
          setKpis(data)
          setIsLoading(false)
        }
      } catch (error: any) {
        console.error("Failed to load KPIs:", error)
        if (mounted) {
          // Handle authentication errors - redirect to login
          if (error?.name === 'AuthenticationError' || error?.message?.includes('Session expired')) {
            router.push('/sign-in')
          }
          setIsLoading(false)
        }
      }
    }
    
    loadKpis()
    
    return () => {
      mounted = false
    }
  }, [hydrated, state.persona, router])

  const handlePlanModalChange = (open: boolean) => {
    setIsPlanModalOpen(open)
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
            className="overflow-hidden pt-2"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                Loading metrics...
              </div>
            ) : kpis.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                No metrics available
              </div>
            ) : (
              <>
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
                    <CarouselItem key={kpi.label} className="pl-4 pt-2 basis-[85%] sm:basis-[48%]">
                      <KPICardContent
                        kpi={kpi}
                        index={index}
                        isHidden={hiddenCards.has(kpi.label)}
                        onPlanModalOpen={() => setIsPlanModalOpen(true)}
                        router={router}
                      />
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
                <div className="hidden md:grid grid-cols-2 xl:grid-cols-4 gap-4 auto-rows-fr">
                  {kpis.map((kpi, index) => (
                    <KPICardContent
                      key={kpi.label}
                      kpi={kpi}
                      index={index}
                      isHidden={hiddenCards.has(kpi.label)}
                      onPlanModalOpen={() => setIsPlanModalOpen(true)}
                      router={router}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <PlanAdjustModal open={isPlanModalOpen} onOpenChange={handlePlanModalChange} />
    </div>
  )
}
