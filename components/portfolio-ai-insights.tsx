"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Inbox, Sparkles } from "lucide-react"

import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { InsightCard } from "@/components/insights/InsightCard"
import { CompactInsightCard } from "@/components/insights/CompactInsightCard"
import { getInsights } from "@/lib/insights/service"
import type { InsightAction, InsightDefinition } from "@/lib/insights/definitions"
import { AutomationCopilotDrawer } from "@/components/automation-copilot-drawer"
import { useInsightPins } from "@/hooks/use-insight-pins"
import { useInsightDismissals } from "@/hooks/use-insight-dismissals"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

const actionToSuggestion: Record<string, string> = {
  "automation:portfolio-rebalance": "rebalance-tech-overweight",
}

const priorityWeight: Record<"low" | "medium" | "high", number> = {
  low: 0,
  medium: 1,
  high: 2,
}

const sortByPriority = (a: InsightDefinition, b: InsightDefinition) => {
  const aPriority = a.priority ? priorityWeight[a.priority] : 1
  const bPriority = b.priority ? priorityWeight[b.priority] : 1

  if (aPriority !== bPriority) {
    return bPriority - aPriority
  }

  return a.title.localeCompare(b.title)
}

export function PortfolioAIInsights() {
  const baseInsights = useMemo(() => getInsights({ surface: "portfolio" }), [])
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [initialSuggestionId, setInitialSuggestionId] = useState<string | null>(null)
  const { pinnedIds, setPinned } = useInsightPins()
  const { dismiss, undismiss, resolvedIds, hydrated } = useInsightDismissals({ surface: "portfolio" })
  const [showResolved, setShowResolved] = useState(false)

  const normalizedInsights = useMemo(
    () =>
      baseInsights.map((insight) => ({
        ...insight,
        pinned: pinnedIds.has(insight.id),
      })),
    [baseInsights, pinnedIds],
  )

  const activeInsights = useMemo(
    () => normalizedInsights.filter((insight) => !resolvedIds.includes(insight.id)).sort(sortByPriority),
    [normalizedInsights, resolvedIds],
  )

  const resolvedInsights = useMemo(
    () => normalizedInsights.filter((insight) => resolvedIds.includes(insight.id)).sort(sortByPriority),
    [normalizedInsights, resolvedIds],
  )

  const pinnedInsights = activeInsights.filter((insight) => insight.pinned)
  const otherInsights = activeInsights.filter((insight) => !insight.pinned)

  // Mobile-first: show only the top critical insight by default
  const topInsight = activeInsights.length > 0 ? activeInsights[0] : null
  const remainingInsights = activeInsights.slice(1)

  const [moreInsightsOpen, setMoreInsightsOpen] = useState(false)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [selectedSlide, setSelectedSlide] = useState(0)

  useEffect(() => {
    if (!carouselApi) return

    const onSelect = () => {
      setSelectedSlide(carouselApi.selectedScrollSnap())
    }

    carouselApi.on("select", onSelect)
    onSelect()

    return () => {
      carouselApi.off("select", onSelect)
    }
  }, [carouselApi])

  const handleAction = ({ action }: { insight: InsightDefinition; action: InsightAction }) => {
    if (action.id.startsWith("automation:")) {
      const suggestionId = actionToSuggestion[action.id]
      if (suggestionId) {
        setInitialSuggestionId(suggestionId)
        setCopilotOpen(true)
      }
    }
  }

  const handlePinChange = ({ insight, pinned }: { insight: InsightDefinition; pinned: boolean }) => {
    setPinned(insight.id, pinned)
  }

  const handleResolutionChange = ({ insight, resolved }: { insight: InsightDefinition; resolved: boolean }) => {
    if (resolved) {
      dismiss(insight.id)
    } else {
      undismiss(insight.id)
    }
  }

  return (
    <>
      <motion.section
        {...createStaggeredCardVariants(0, 0.2)}
        aria-labelledby="portfolio-insights-heading"
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
          </div>
          <h3 id="portfolio-insights-heading" className="text-sm font-semibold text-foreground">
            AI Portfolio Insights
          </h3>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Surface high-impact actions from your current portfolio mix.
          </p>
          {resolvedIds.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => setShowResolved((previous) => !previous)}
              aria-pressed={showResolved}
            >
              {showResolved ? "Hide resolved" : `Show resolved (${resolvedIds.length})`}
            </Button>
          )}
        </div>

        {!hydrated ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_item, index) => (
              <div key={index} className="h-[220px] rounded-2xl bg-muted/60 animate-pulse" />
            ))}
          </div>
        ) : activeInsights.length === 0 ? (
          <Card className="card-standard border-dashed border-border/70">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <Inbox className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-foreground">All portfolio insights resolved</h4>
                <p className="text-sm text-muted-foreground">
                  Restore resolved insights to revisit recommendations and pinned items.
                </p>
              </div>
              {resolvedIds.length > 0 ? (
                <Button variant="ghost" size="sm" onClick={() => setShowResolved(true)}>
                  Show resolved insights
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Mobile: Show top insight + drawer for rest */}
            <div className="space-y-4 lg:hidden">
              {topInsight && (
                <InsightCard
                  insight={topInsight}
                  index={0}
                  onAction={handleAction}
                  onPinChange={handlePinChange}
                  resolved={false}
                  onResolutionChange={handleResolutionChange}
                />
              )}

              {remainingInsights.length > 0 && (
                <Drawer open={moreInsightsOpen} onOpenChange={setMoreInsightsOpen}>
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between rounded-lg border-border/70 bg-card hover:bg-accent"
                    >
                      <span className="text-sm font-medium">
                        More insights ({remainingInsights.length})
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="max-h-[80vh]">
                    <DrawerHeader className="pb-3 text-left">
                      <DrawerTitle>All Portfolio Insights</DrawerTitle>
                      <DrawerDescription>
                        Review additional recommendations for your portfolio
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="space-y-4 px-4 pb-6">
                      <Carousel setApi={setCarouselApi} opts={{ align: "start" }}>
                        <CarouselContent className="-ml-2 md:-ml-4">
                          {remainingInsights.map((insight) => (
                            <CarouselItem
                              key={insight.id}
                              className="basis-[90%] pl-2 md:basis-1/2 md:pl-4"
                            >
                              <div className="h-[55vh]">
                                <CompactInsightCard
                                  insight={insight}
                                  onAction={handleAction}
                                  onPinChange={handlePinChange}
                                  resolved={false}
                                  onResolutionChange={handleResolutionChange}
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>

                      {/* Carousel indicators */}
                      {remainingInsights.length > 1 && (
                        <div className="flex justify-center gap-1.5 pt-2">
                          {remainingInsights.map((_insight, index) => (
                            <button
                              key={index}
                              onClick={() => carouselApi?.scrollTo(index)}
                              className={`h-1.5 rounded-full transition-all ${
                                index === selectedSlide
                                  ? "w-6 bg-primary"
                                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                              }`}
                              aria-label={`Go to insight ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </DrawerContent>
                </Drawer>
              )}
            </div>

            {/* Desktop: Show all insights in organized sections */}
            <div className="hidden space-y-6 lg:block">
              {pinnedInsights.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-foreground">Pinned insights</h4>
                  </div>
                  <div className="grid gap-4">
                    {pinnedInsights.map((insight, index) => (
                      <InsightCard
                        key={insight.id}
                        insight={insight}
                        index={index}
                        onAction={handleAction}
                        onPinChange={handlePinChange}
                        resolved={false}
                        onResolutionChange={handleResolutionChange}
                      />
                    ))}
                  </div>
                </div>
              )}

              {otherInsights.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">More insights</h4>
                  <div className="grid gap-4">
                    {otherInsights.map((insight, index) => (
                      <InsightCard
                        key={insight.id}
                        insight={insight}
                        index={pinnedInsights.length + index}
                        onAction={handleAction}
                        onPinChange={handlePinChange}
                        onResolutionChange={handleResolutionChange}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {showResolved && resolvedInsights.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Resolved insights</h4>
            <div className="grid gap-4">
              {resolvedInsights.map((insight, index) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  index={activeInsights.length + index}
                  onAction={handleAction}
                  onPinChange={handlePinChange}
                  resolved
                  onResolutionChange={handleResolutionChange}
                />
              ))}
            </div>
          </div>
        )}
      </motion.section>

      <AutomationCopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        surface="portfolio"
        initialSuggestionId={initialSuggestionId}
      />
    </>
  )
}
