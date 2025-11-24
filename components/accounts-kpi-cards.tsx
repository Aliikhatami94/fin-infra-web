"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MaskableValue } from "@/components/privacy-provider"
import { Wallet, CreditCard, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { Account } from "@/types/domain"
import { isMarketingMode } from "@/lib/marketingMode"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { createStaggeredCardVariants, cardHoverVariants } from "@/lib/motion-variants"
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

/**
 * Calculate relative time from account lastSync timestamp
 * Note: This shows when data was actually fetched, not when it was served from cache
 */
function getRelativeTime(lastSync: string): string {
  try {
    const syncDate = new Date(lastSync)
    const now = new Date()
    const diffMs = now.getTime() - syncDate.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffMs / 60000)
    
    // If less than 30 seconds, show seconds
    if (diffSeconds < 30) return `${diffSeconds}s ago`
    // If less than 60 minutes, show minutes
    if (diffMinutes < 60) return `${diffMinutes} min ago`
    
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  } catch {
    return "recently"
  }
}

interface AccountsKPICardsProps {
  accounts: Account[]
  totalCash: number
  totalCreditDebt: number
  totalInvestments: number
}

export function AccountsKPICards({ accounts, totalCash, totalCreditDebt, totalInvestments }: AccountsKPICardsProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hiddenCards] = useState<Set<string>>(new Set())

  // Calculate real sync times from accounts, or use mock data in marketing mode
  const inMarketingMode = isMarketingMode()
  const cashAccounts = accounts.filter(acc => acc.type === "Checking" || acc.type === "Savings")
  const creditAccounts = accounts.filter(acc => acc.type === "Credit Card")
  const investmentAccounts = accounts.filter(acc => acc.type === "Investment")

  const kpis: Array<{
    title: string
    value: number
    trend: number
    baselineValue: number
    icon: LucideIcon
    tone: SemanticTone
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
      lastSynced: inMarketingMode ? "3 min ago" : (cashAccounts.length > 0 ? getRelativeTime(cashAccounts[0].lastSync) : "recently"),
      source: inMarketingMode ? "Plaid" : (cashAccounts.length > 0 ? (cashAccounts[0].institution || "Plaid") : "Plaid"),
    },
    {
      title: "Total Credit Debt",
      value: totalCreditDebt,
      trend: -1.2,
      baselineValue: totalCreditDebt / 0.988,
      icon: CreditCard,
      tone: "negative",
      lastSynced: inMarketingMode ? "3 min ago" : (creditAccounts.length > 0 ? getRelativeTime(creditAccounts[0].lastSync) : "recently"),
      source: inMarketingMode ? "Plaid" : (creditAccounts.length > 0 ? (creditAccounts[0].institution || "Plaid") : "Plaid"),
    },
    {
      title: "Total Investments",
      value: totalInvestments,
      trend: 5.1,
      baselineValue: totalInvestments / 1.051,
      icon: TrendingUp,
      tone: "positive",
      lastSynced: inMarketingMode ? "5 min ago" : (investmentAccounts.length > 0 ? getRelativeTime(investmentAccounts[0].lastSync) : "recently"),
      source: inMarketingMode ? "Teller" : (investmentAccounts.length > 0 ? (investmentAccounts[0].institution || "Plaid") : "Plaid"),
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

    return (
      <motion.div {...cardHoverVariants} className="h-full">
        <Card className="card-standard h-full">
          <CardContent className="p-3">
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-0.5 min-w-0">
                <p className="text-[11px] font-medium text-muted-foreground/80 uppercase tracking-wide truncate">{kpi.title}</p>
                {isHidden ? (
                  <p className="text-2xl font-semibold font-tabular text-foreground">••••••</p>
                ) : (
                  <p className="text-2xl font-semibold font-tabular text-foreground tracking-tighter">
                    <MaskableValue
                      value={`$${Math.abs(kpi.value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                      srLabel={`${kpi.title} value`}
                      className="font-tabular"
                    />
                  </p>
                )}
              </div>
              {!isHidden && (
                <div className={cn("flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold", 
                  kpi.trend > 0 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500" : "bg-rose-500/10 text-rose-600 dark:text-rose-500"
                )}>
                  {kpi.trend > 0 ? "+" : ""}{kpi.trend}%
                </div>
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

              {/* Tablet/Desktop: Fixed width cards layout */}
              <div className="hidden md:flex flex-wrap gap-4">
                {kpis.map((kpi, index) => (
                  <div key={kpi.title} className="w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)]">
                    <motion.div {...createStaggeredCardVariants(index, 0)} className="h-full">
                      {renderKPICard(kpi)}
                    </motion.div>
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
