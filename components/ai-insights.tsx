"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, LayoutGrid, List } from "lucide-react"
import { getInsights } from "@/lib/insights/service"
import type { InsightDefinition } from "@/lib/insights/definitions"
import { InsightCard } from "@/components/insights/InsightCard"
import { useInsightPins } from "@/hooks/use-insight-pins"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

export function AIInsights() {
  const { pinnedIds, setPinned } = useInsightPins()
  const baseInsights = useMemo(() => getInsights({ surface: "overview", limit: 8 }), [])
  const [layoutMode, setLayoutMode] = useState<"horizontal" | "vertical">("horizontal")
  const [currentSlide, setCurrentSlide] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const normalizedInsights = useMemo(
    () =>
      baseInsights
        .map((insight) => ({
          ...insight,
          pinned: pinnedIds.has(insight.id),
        }))
        .sort(sortByPriority),
    [baseInsights, pinnedIds],
  )

  const pinnedInsights = normalizedInsights.filter((insight) => insight.pinned)
  const otherInsights = normalizedInsights.filter((insight) => !insight.pinned).slice(0, 4)
  const insightsToRender = pinnedInsights.length > 0 ? otherInsights : normalizedInsights.slice(0, 4)

  // Handle scroll to update carousel indicator
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || layoutMode === "vertical") return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = 280 + 16 // min-w-[280px] + gap-4
      const slideIndex = Math.round(scrollLeft / cardWidth)
      setCurrentSlide(slideIndex)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [layoutMode])

  const scrollToSlide = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return
    
    const cardWidth = 280 + 16
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    })
  }

  return (
    <div className="relative space-y-6">
      {/* Header with layout toggle */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-lg font-semibold text-foreground">AI Insights</h2>
        <div className="flex items-center gap-2">
          {/* Mobile layout toggle */}
          <div className="flex md:hidden items-center gap-1 rounded-lg bg-muted p-1">
            <Button
              variant={layoutMode === "horizontal" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-2"
              onClick={() => setLayoutMode("horizontal")}
              aria-label="Horizontal layout"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={layoutMode === "vertical" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-2"
              onClick={() => setLayoutMode("vertical")}
              aria-label="Vertical layout"
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Link 
            href="/dashboard/insights" 
            className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80 whitespace-nowrap"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Pinned insights section */}
      {pinnedInsights.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Pinned insights</h3>
          
          {layoutMode === "vertical" ? (
            /* Vertical stack on mobile */
            <div className="space-y-4 md:hidden">
              {pinnedInsights.map((insight, index) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  index={index}
                  className="w-full"
                  onPinChange={({ insight: changedInsight, pinned }) => setPinned(changedInsight.id, pinned)}
                />
              ))}
            </div>
          ) : (
            /* Horizontal carousel */
            <div className="space-y-3 md:space-y-0">
              <div 
                ref={scrollContainerRef}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-thin md:scrollbar-hide"
              >
                {pinnedInsights.map((insight, index) => (
                  <InsightCard
                    key={insight.id}
                    insight={insight}
                    index={index}
                    className="min-w-[280px] md:min-w-[340px] snap-start"
                    onPinChange={({ insight: changedInsight, pinned }) => setPinned(changedInsight.id, pinned)}
                  />
                ))}
              </div>
              
              {/* Carousel indicators - mobile only, horizontal mode */}
              {pinnedInsights.length > 1 && (
                <div className="flex md:hidden justify-center gap-1.5">
                  {pinnedInsights.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSlide(index)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        currentSlide === index
                          ? "w-6 bg-primary"
                          : "w-1.5 bg-muted-foreground/30"
                      )}
                      aria-label={`Go to insight ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Latest/Recommended insights section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          {pinnedInsights.length > 0 ? "Latest insights" : "Recommended insights"}
        </h3>
        
        {layoutMode === "vertical" ? (
          /* Vertical stack on mobile */
          <div className="space-y-4 md:hidden">
            {insightsToRender.map((insight, index) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                index={index}
                className="w-full"
                onPinChange={({ insight: changedInsight, pinned }) => setPinned(changedInsight.id, pinned)}
              />
            ))}
          </div>
        ) : (
          /* Horizontal carousel */
          <div className="space-y-3 md:space-y-0">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-thin md:scrollbar-hide">
              {insightsToRender.map((insight, index) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  index={index}
                  className="min-w-[280px] md:min-w-[340px] snap-start"
                  onPinChange={({ insight: changedInsight, pinned }) => setPinned(changedInsight.id, pinned)}
                />
              ))}
            </div>
            
            {/* Carousel indicators - mobile only, horizontal mode */}
            {insightsToRender.length > 1 && (
              <div className="flex md:hidden justify-center gap-1.5">
                {insightsToRender.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSlide(index)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      currentSlide === index
                        ? "w-6 bg-primary"
                        : "w-1.5 bg-muted-foreground/30"
                    )}
                    aria-label={`Go to insight ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Desktop: Always show horizontal grid */}
        <div className="hidden md:flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {insightsToRender.map((insight, index) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              index={index}
              className="min-w-[340px] snap-start"
              onPinChange={({ insight: changedInsight, pinned }) => setPinned(changedInsight.id, pinned)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
