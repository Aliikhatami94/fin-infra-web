"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const allocationData = {
  before: {
    title: "Current Allocation",
    subtitle: "As of today",
    items: [
      { label: "Equities", value: 42, color: "bg-blue-500", target: 35 },
      { label: "Fixed Income", value: 28, color: "bg-green-500", target: 30 },
      { label: "Real Estate", value: 15, color: "bg-purple-500", target: 15 },
      { label: "Commodities", value: 8, color: "bg-amber-500", target: 10 },
      { label: "Cash", value: 7, color: "bg-gray-500", target: 10 },
    ],
    note: "Allocation has drifted due to market performance",
  },
  after: {
    title: "Target Allocation",
    subtitle: "Recommended rebalancing",
    items: [
      { label: "Equities", value: 35, color: "bg-blue-500", drift: -7 },
      { label: "Fixed Income", value: 30, color: "bg-green-500", drift: +2 },
      { label: "Real Estate", value: 15, color: "bg-purple-500", drift: 0 },
      { label: "Commodities", value: 10, color: "bg-amber-500", drift: +2 },
      { label: "Cash", value: 10, color: "bg-gray-500", drift: +3 },
    ],
    note: "Suggested trades to return to target allocation",
  },
}

export function AllocationComparisonSlider() {
  const [view, setView] = useState<"before" | "after">("before")

  const currentData = view === "before" ? allocationData.before : allocationData.after

  return (
    <div className="rounded-2xl border border-border/30 bg-card/80 p-6 shadow-sm">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{currentData.title}</h3>
            <p className="text-sm text-muted-foreground">{currentData.subtitle}</p>
          </div>
          
          {/* Toggle Buttons */}
          <div className="flex items-center gap-2 rounded-full bg-muted p-1">
            <Button
              size="sm"
              variant={view === "before" ? "default" : "ghost"}
              className={cn(
                "h-8 rounded-full px-4 text-xs font-medium transition-all",
                view === "before" && "shadow-sm"
              )}
              onClick={() => setView("before")}
              aria-label="Show current allocation"
              aria-pressed={view === "before"}
            >
              Current
            </Button>
            <Button
              size="sm"
              variant={view === "after" ? "default" : "ghost"}
              className={cn(
                "h-8 rounded-full px-4 text-xs font-medium transition-all",
                view === "after" && "shadow-sm"
              )}
              onClick={() => setView("after")}
              aria-label="Show target allocation"
              aria-pressed={view === "after"}
            >
              Target
            </Button>
          </div>
        </div>

        {/* Allocation Bars */}
        <div className="space-y-3 pt-2">
          {currentData.items.map((item, index) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{item.value}%</span>
                  {view === "before" && "target" in item && item.target !== item.value && (
                    <span className="text-xs text-muted-foreground">
                      (target: {item.target}%)
                    </span>
                  )}
                  {view === "after" && "drift" in item && item.drift !== 0 && (
                    <span
                      className={cn(
                        "text-xs font-medium",
                        item.drift > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {item.drift > 0 ? "+" : ""}{item.drift}%
                    </span>
                  )}
                </div>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    item.color,
                    "h-full transition-all duration-500 ease-in-out"
                  )}
                  style={{ width: `${item.value}%` }}
                  role="progressbar"
                  aria-valuenow={item.value}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.label} allocation: ${item.value} percent`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-border/40">
          <p className="text-xs text-muted-foreground italic">{currentData.note}</p>
        </div>

        {/* Navigation Hint */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs"
            onClick={() => setView(view === "before" ? "after" : "before")}
            aria-label={view === "before" ? "View target allocation" : "View current allocation"}
          >
            {view === "before" ? (
              <>
                View Target <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
              </>
            ) : (
              <>
                <ArrowLeft className="mr-1 h-3 w-3" aria-hidden="true" /> View Current
              </>
            )}
          </Button>
        </div>

        {/* Caption */}
        <p className="text-center text-xs text-muted-foreground pt-2">
          Example: How allocation drift is visualized in your dashboard
        </p>
      </div>
    </div>
  )
}
