"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { CryptoKPIs } from "@/components/crypto-kpis"
import { CryptoTable } from "@/components/crypto-table"
import { CryptoRiskSection } from "@/components/crypto-risk-section"
import { CryptoAIInsights } from "@/components/crypto-ai-insights"
import { ExchangeAnalytics } from "@/components/exchange-analytics"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  BadgePercent,
  Coins,
  Filter,
  Fuel,
  Layers3,
  ShieldCheck,
} from "lucide-react"
import { ChartCardSkeleton } from "@/components/chart-skeleton"
import type { CryptoChartProps } from "@/components/crypto-chart"
import { ErrorBoundary } from "@/components/error-boundary"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const CryptoChart = dynamic<CryptoChartProps>(
  () => import("@/components/crypto-chart").then((mod) => mod.CryptoChart),
  {
    ssr: false,
    loading: () => <ChartCardSkeleton title="Portfolio Value Over Time" contentHeight="h-[350px]" />,
  },
)

export default function CryptoPage() {
  const [selectedExchange, setSelectedExchange] = useState<"All" | "Coinbase" | "Binance">("All")
  const [showStablecoins, setShowStablecoins] = useState(false)
  const [groupBy, setGroupBy] = useState<"asset" | "exchange" | "staking">("asset")
  const [isFilteringcrypto, setIsFiltering] = useState(false)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  const handleExchangeChange = (exchange: "All" | "Coinbase" | "Binance") => {
    setIsFiltering(true)
    setSelectedExchange(exchange)
    // Reset filtering state after a brief delay
    setTimeout(() => setIsFiltering(false), 300)
  }

  const handleGroupByChange = (newGroupBy: "asset" | "exchange" | "staking") => {
    setIsFiltering(true)
    setGroupBy(newGroupBy)
    setTimeout(() => setIsFiltering(false), 300)
  }

  const handleStablecoinToggle = () => {
    setIsFiltering(true)
    setShowStablecoins((prev) => !prev)
    setTimeout(() => setIsFiltering(false), 300)
  }

  const groupByOptions: Array<{
    value: typeof groupBy
    label: string
    description: string
    icon: typeof Layers3
  }> = [
    {
      value: "asset",
      label: "By asset",
      description: "Coin level allocation",
      icon: Layers3,
    },
    {
      value: "exchange",
      label: "By exchange",
      description: "Wallet & custodian",
      icon: Coins,
    },
    {
      value: "staking",
      label: "By staking",
      description: "Yield vs. idle",
      icon: ShieldCheck,
    },
  ]

  return (
    <>
      {/* Sticky compact Header */}
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-3">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl md:text-2xl font-semibold text-foreground">Crypto</h1>
          </div>
        </div>
      </div>

      {/* Body */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10 py-6 space-y-4">
          {/* Mobile: Compact filter button with drawer */}
          <div className="flex lg:hidden items-center gap-3">
            <Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {(selectedExchange !== "All" || showStablecoins || groupBy !== "asset") && (
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs ml-1">
                      {[
                        selectedExchange !== "All" ? 1 : 0,
                        showStablecoins ? 1 : 0,
                        groupBy !== "asset" ? 1 : 0,
                      ].reduce((a, b) => a + b, 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[400px] flex flex-col">
                <SheetHeader className="px-6 pt-5 pb-4">
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Customize your crypto portfolio view
                  </SheetDescription>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="space-y-5">
                    {/* Exchange Filter */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-0.5">Exchange</h4>
                        <p className="text-xs text-muted-foreground">Filter by cryptocurrency exchange</p>
                      </div>
                      <RadioGroup 
                        value={selectedExchange} 
                        onValueChange={(value) => handleExchangeChange(value as typeof selectedExchange)}
                      >
                        {(["All", "Coinbase", "Binance"] as const).map((exchange) => (
                          <div key={exchange} className="flex items-center space-x-3 rounded-lg border border-border/50 px-3 py-2 hover:border-border hover:bg-accent/50 transition-colors">
                            <RadioGroupItem value={exchange} id={`exchange-${exchange}`} />
                            <Label 
                              htmlFor={`exchange-${exchange}`} 
                              className="flex-1 cursor-pointer font-normal text-sm"
                            >
                              {exchange === "All" ? "All Exchanges" : exchange}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="border-t border-border/50" />

                    {/* Group By Filter */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-0.5">Group By</h4>
                        <p className="text-xs text-muted-foreground">Organize your holdings by category</p>
                      </div>
                      <RadioGroup 
                        value={groupBy} 
                        onValueChange={(value) => handleGroupByChange(value as typeof groupBy)}
                      >
                        {groupByOptions.map((option) => {
                          const Icon = option.icon
                          return (
                            <div 
                              key={option.value} 
                              className="flex items-start space-x-3 rounded-lg border border-border/50 px-3 py-2 hover:border-border hover:bg-accent/50 transition-colors"
                            >
                              <RadioGroupItem value={option.value} id={`group-${option.value}`} className="mt-0.5" />
                              <Label 
                                htmlFor={`group-${option.value}`} 
                                className="flex flex-1 gap-2.5 cursor-pointer"
                              >
                                <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-sm font-normal">{option.label}</span>
                                  <span className="text-xs text-muted-foreground leading-tight">{option.description}</span>
                                </div>
                              </Label>
                            </div>
                          )
                        })}
                      </RadioGroup>
                    </div>

                    <div className="border-t border-border/50" />

                    {/* Stablecoins Toggle */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-0.5">Display Options</h4>
                        <p className="text-xs text-muted-foreground">Control which assets to show</p>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2.5 hover:border-border hover:bg-accent/50 transition-colors">
                        <div className="flex items-start gap-2.5 flex-1">
                          <BadgePercent className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="space-y-0.5">
                            <Label htmlFor="stablecoins-toggle" className="cursor-pointer text-sm font-normal">
                              Show Stablecoins
                            </Label>
                            <p className="text-xs text-muted-foreground leading-tight">
                              Include USDT, USDC, DAI, and others
                            </p>
                          </div>
                        </div>
                        <Switch
                          id="stablecoins-toggle"
                          checked={showStablecoins}
                          onCheckedChange={handleStablecoinToggle}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer with Reset Button */}
                {(selectedExchange !== "All" || showStablecoins || groupBy !== "asset") && (
                  <div className="border-t border-border/50 px-6 py-3 mt-auto">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        handleExchangeChange("All")
                        setShowStablecoins(false)
                        handleGroupByChange("asset")
                      }}
                    >
                      Reset All Filters
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {/* Gas gauge in tooltip */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1.5 h-9 px-2">
                    <Fuel className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-medium">25 gwei</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold">Current Gas Price</p>
                    <p className="text-xs text-muted-foreground">Ethereum network fee: 25 gwei</p>
                    <p className="text-xs text-muted-foreground">Est. transaction cost: ~$2.50</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Desktop: Compact filter layout */}
          <div className="hidden lg:block space-y-3">
            {/* Exchange filter chips and gas indicator */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2" role="group" aria-label="Exchange filter">
                <span className="text-xs text-muted-foreground">Exchange:</span>
                {(["All", "Coinbase", "Binance"] as const).map((exchange) => (
                  <Button
                    key={exchange}
                    variant={selectedExchange === exchange ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleExchangeChange(exchange)}
                    className={cn(
                      "h-7 text-xs transition-colors",
                      selectedExchange === exchange && "shadow-sm"
                    )}
                    aria-pressed={selectedExchange === exchange}
                    aria-label={`Filter by ${exchange}`}
                  >
                    {exchange}
                  </Button>
                ))}
              </div>
              <Badge variant="outline" className="gap-1 px-2 py-0.5 h-7">
                <Fuel className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                <span className="text-xs">Gas: 25 gwei</span>
              </Badge>
            </div>

            {/* Group by and stablecoins filters */}
            <div
              className="flex flex-wrap items-center gap-2"
              role="toolbar"
              aria-label="Crypto grouping controls"
            >
              {groupByOptions.map((option) => {
                const Icon = option.icon
                const isActive = groupBy === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleGroupByChange(option.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-left transition-colors",
                      "hover:border-primary/60 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isActive
                        ? "border-primary/80 bg-primary/10 text-foreground shadow-sm"
                        : "border-border/60 bg-card text-muted-foreground",
                    )}
                    aria-pressed={isActive}
                    aria-label={`Group ${option.label}`}
                  >
                    <Icon className={cn("h-3.5 w-3.5", isActive ? "text-primary" : "text-muted-foreground")}
                      aria-hidden="true"
                    />
                    <span className="text-xs font-medium">
                      {option.label}
                    </span>
                  </button>
                )
              })}
              <button
                type="button"
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors",
                  "hover:border-primary/60 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  showStablecoins
                    ? "border-primary/80 bg-primary/10 text-foreground shadow-sm"
                    : "border-border/60 bg-card text-muted-foreground",
                )}
                onClick={handleStablecoinToggle}
                aria-pressed={showStablecoins}
                aria-label={showStablecoins ? "Hide stablecoins" : "Show stablecoins"}
              >
                <BadgePercent className={cn("h-3.5 w-3.5", showStablecoins ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                <span className="font-medium">{showStablecoins ? "Stablecoins included" : "Stablecoins hidden"}</span>
              </button>
            </div>
          </div>

          <CryptoKPIs />
          <ErrorBoundary feature="Crypto insights">
            <CryptoAIInsights />
          </ErrorBoundary>
          <div className={cn("transition-opacity duration-300", isFilteringcrypto && "opacity-50")}>
            <CryptoChart showStablecoins={showStablecoins} onToggleStablecoins={setShowStablecoins} />
          </div>
          <div className={cn("transition-opacity duration-300", isFilteringcrypto && "opacity-50")}>
            <ExchangeAnalytics selectedExchange={selectedExchange} />
          </div>
          <div className={cn("transition-opacity duration-300", isFilteringcrypto && "opacity-50")}>
            <CryptoTable
              selectedExchange={selectedExchange}
              showStablecoins={showStablecoins}
              groupBy={groupBy}
            />
          </div>
          <CryptoRiskSection />
        </div>
      </motion.div>

      {/* Floating action button removed per design update */}
    </>
  )
}
