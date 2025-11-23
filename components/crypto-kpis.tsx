"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MaskableValue } from "@/components/privacy-provider"
import {
  Bitcoin,
  DollarSign,
  Coins,
  TrendingUpIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { createStaggeredCardVariants, cardHoverVariants } from "@/lib/motion-variants"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

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
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)

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

  const renderKPICard = (kpi: typeof kpis[0], index: number) => {
    const Icon = kpi.icon
    return (
      <motion.div {...createStaggeredCardVariants(index, 0)} {...cardHoverVariants} className="h-full">
        <Card
          className={`card-standard h-full ${kpi.clickable ? "cursor-pointer" : ""}`}
          onClick={() => kpi.clickable && router.push("/crypto/btc")}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs font-medium text-muted-foreground truncate">{kpi.label}</p>
                <p className="text-2xl font-bold font-tabular text-foreground tracking-tight">
                  <MaskableValue value={kpi.value} srLabel={`${kpi.label} value`} className="font-tabular" />
                </p>
              </div>
              <div className={cn("flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium", 
                kpi.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
              )}>
                {kpi.positive ? "+" : ""}
                <MaskableValue value={kpi.change} srLabel="change" className="font-tabular" />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-end">
              <div className="w-12 h-6">
                <Sparkline data={kpi.sparkline} positive={kpi.positive} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Mobile: Horizontal carousel */}
      <div className="md:hidden">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            align: "center",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 pt-2">
            {kpis.map((kpi, index) => (
              <CarouselItem key={index} className="pl-4 basis-[85%] sm:basis-[48%]">
                {renderKPICard(kpi, index)}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Carousel indicators */}
        <div className="flex justify-center gap-1.5 mt-3">
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
          <div key={index}>
            {renderKPICard(kpi, index)}
          </div>
        ))}
      </div>
    </div>
  )
}
