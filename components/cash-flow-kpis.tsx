"use client"

import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Line, LineChart, ResponsiveContainer } from "recharts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { formatCurrency } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type TimeScale = "daily" | "weekly" | "monthly"

const timeScaleOptions: Array<{ id: TimeScale; label: string; srHint: string }> = [
  { id: "daily", label: "Daily", srHint: "Show the last 7 days" },
  { id: "weekly", label: "Weekly", srHint: "Show the last 6 weeks" },
  { id: "monthly", label: "Monthly", srHint: "Show the last 6 months" },
]

const timeScaleHelpId = "cashflow-time-scale-help"

const timeScaleSnapshots: Record<TimeScale, {
  netCashFlow: number
  changePercent: number
  changeComparison: string
  netSparkline: Array<{ value: number }>
  totalInflow: number
  inflowNote: string
  inflowSparkline: Array<{ value: number }>
  totalOutflow: number
  outflowNote: string
  outflowSparkline: Array<{ value: number }>
}> = {
  daily: {
    netCashFlow: 240,
    changePercent: 6,
    changeComparison: "vs. prior day: $225",
    netSparkline: [
      { value: 180 },
      { value: 210 },
      { value: 195 },
      { value: 260 },
      { value: 230 },
      { value: 285 },
      { value: 240 },
    ],
    totalInflow: 620,
    inflowNote: "Paycheck boosted by overtime",
    inflowSparkline: [
      { value: 420 },
      { value: 430 },
      { value: 440 },
      { value: 620 },
      { value: 480 },
      { value: 630 },
      { value: 620 },
    ],
    totalOutflow: 380,
    outflowNote: "Dining & transit led spending",
    outflowSparkline: [
      { value: 210 },
      { value: 220 },
      { value: 230 },
      { value: 300 },
      { value: 260 },
      { value: 310 },
      { value: 380 },
    ],
  },
  weekly: {
    netCashFlow: 980,
    changePercent: 12,
    changeComparison: "vs. last week: $875",
    netSparkline: [
      { value: 620 },
      { value: 760 },
      { value: 680 },
      { value: 980 },
      { value: 820 },
      { value: 1040 },
      { value: 980 },
    ],
    totalInflow: 3720,
    inflowNote: "82% salary • 12% reimbursements",
    inflowSparkline: [
      { value: 3200 },
      { value: 3300 },
      { value: 3450 },
      { value: 3625 },
      { value: 3550 },
      { value: 3700 },
      { value: 3720 },
    ],
    totalOutflow: 2740,
    outflowNote: "Housing + groceries led spend",
    outflowSparkline: [
      { value: 2500 },
      { value: 2450 },
      { value: 2525 },
      { value: 2610 },
      { value: 2560 },
      { value: 2680 },
      { value: 2740 },
    ],
  },
  monthly: {
    netCashFlow: 1500,
    changePercent: 10,
    changeComparison: "vs. last month: $1,364",
    netSparkline: [
      { value: 1200 },
      { value: 1500 },
      { value: 1300 },
      { value: 1800 },
      { value: 1600 },
      { value: 2100 },
      { value: 1500 },
    ],
    totalInflow: 9000,
    inflowNote: "83% from salary deposits",
    inflowSparkline: [
      { value: 8200 },
      { value: 8500 },
      { value: 8800 },
      { value: 9200 },
      { value: 8900 },
      { value: 9500 },
      { value: 9000 },
    ],
    totalOutflow: 7500,
    outflowNote: "Highest: Rent ($2,200)",
    outflowSparkline: [
      { value: 7000 },
      { value: 7000 },
      { value: 7500 },
      { value: 7400 },
      { value: 7300 },
      { value: 7400 },
      { value: 7500 },
    ],
  },
}

export function CashFlowKPIs() {
  const [activeTimeScale, setActiveTimeScale] = useState<TimeScale>("monthly")
  const optionRefs = useRef<Record<TimeScale, HTMLButtonElement | null>>({
    daily: null,
    weekly: null,
    monthly: null,
  })

  const handleTimeScaleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const { key } = event
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(key)) {
        return
      }

      event.preventDefault()

      const refs = optionRefs.current
      const activeElement = document.activeElement as HTMLButtonElement | null
      const focusedIndex = timeScaleOptions.findIndex((option) => refs[option.id] === activeElement)
      const currentIndex =
        focusedIndex >= 0
          ? focusedIndex
          : timeScaleOptions.findIndex((option) => option.id === activeTimeScale)

      if (currentIndex < 0) {
        return
      }

      let nextIndex = currentIndex

      if (key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % timeScaleOptions.length
      } else if (key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + timeScaleOptions.length) % timeScaleOptions.length
      } else if (key === "Home") {
        nextIndex = 0
      } else if (key === "End") {
        nextIndex = timeScaleOptions.length - 1
      }

      const nextOption = timeScaleOptions[nextIndex]
      setActiveTimeScale(nextOption.id)

      const focusTarget = optionRefs.current[nextOption.id]
      if (!focusTarget) {
        return
      }

      if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(() => {
          focusTarget.focus()
        })
        return
      }

      focusTarget.focus()
    },
    [activeTimeScale, setActiveTimeScale],
  )

  const snapshot = useMemo(() => timeScaleSnapshots[activeTimeScale], [activeTimeScale])

  const formattedNetCashFlow = formatCurrency(snapshot.netCashFlow, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  const formattedTotalInflow = formatCurrency(snapshot.totalInflow, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  const formattedTotalOutflow = formatCurrency(snapshot.totalOutflow, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-card/30 px-4 py-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/80">Net flow time scale</p>
          <p className="text-sm text-muted-foreground">
            Viewing {timeScaleOptions.find((option) => option.id === activeTimeScale)?.label ?? ""} totals
          </p>
        </div>
        <div className="sr-only" id={timeScaleHelpId}>
          Use left and right arrow keys to move between time scale options.
        </div>
        <div
          role="group"
          aria-label="Select cash flow time scale"
          aria-describedby={timeScaleHelpId}
          className="flex items-center gap-1.5"
          onKeyDown={handleTimeScaleKeyDown}
        >
          {timeScaleOptions.map((option) => {
            const isActive = option.id === activeTimeScale
            return (
              <Button
                key={option.id}
                type="button"
                variant="outline"
                size="sm"
                aria-pressed={isActive}
                ref={(node) => {
                  optionRefs.current[option.id] = node
                }}
                className={cn(
                  "h-8 rounded-full border-border/50 px-3 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-background/60 text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setActiveTimeScale(option.id)}
              >
                {option.label}
                <span className="sr-only"> – {option.srHint}</span>
              </Button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <motion.div {...createStaggeredCardVariants(0, 0)}>
          <Card className="card-standard card-lift">
            <CardContent className="p-6 min-h-[140px] flex flex-col justify-between">
              <div className="mb-2">
                <LastSyncBadge timestamp="2 min ago" source="Plaid" />
              </div>
              <div className="flex items-start justify-between mb-2">
                <div className="space-y-1 flex-1">
                  <p className="text-xs text-muted-foreground">Net Cash Flow</p>
                  <p
                    className="text-2xl font-bold tabular-nums text-foreground"
                    aria-label={`Net cash flow ${formattedNetCashFlow} ${activeTimeScale}`}
                    aria-live="polite"
                  >
                    {formattedNetCashFlow}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-xs cursor-help">
                      {snapshot.changePercent >= 0 ? (
                        <>
                          <TrendingUp className="h-3 w-3 text-[var(--color-positive)]" />
                          <span className="text-[var(--color-positive)]">+{snapshot.changePercent}%</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-3 w-3 text-[var(--color-negative)]" />
                          <span className="text-[var(--color-negative)]">{snapshot.changePercent}%</span>
                        </>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {snapshot.changeComparison}
                    </p>
                  </TooltipContent>
                </Tooltip>
                <div className="w-20 h-10">
                  <ResponsiveContainer width="100%" height="100%" aria-hidden="true">
                    <LineChart data={snapshot.netSparkline}>
                      <Line type="monotone" dataKey="value" stroke="hsl(210, 100%, 60%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...createStaggeredCardVariants(1, 0)}>
          <Card className="card-standard card-lift">
            <CardContent className="p-6 min-h-[140px] flex flex-col justify-between">
              <div className="mb-2">
                <LastSyncBadge timestamp="2 min ago" source="Plaid" />
              </div>
              <div className="flex items-start justify-between mb-2">
                <div className="space-y-1 flex-1">
                  <p className="text-xs text-muted-foreground">Total Inflow</p>
                  <p
                    className="text-2xl font-bold tabular-nums text-foreground"
                    aria-label={`Total inflow ${formattedTotalInflow} ${activeTimeScale}`}
                    aria-live="polite"
                  >
                    {formattedTotalInflow}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <ArrowDownRight className="h-5 w-5 text-[var(--color-positive)]" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{snapshot.inflowNote}</p>
                <div className="w-20 h-10">
                  <ResponsiveContainer width="100%" height="100%" aria-hidden="true">
                    <LineChart data={snapshot.inflowSparkline}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--color-positive)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...createStaggeredCardVariants(2, 0)}>
          <Card className="card-standard card-lift">
            <CardContent className="p-6 min-h-[140px] flex flex-col justify-between">
              <div className="mb-2">
                <LastSyncBadge timestamp="2 min ago" source="Plaid" />
              </div>
              <div className="flex items-start justify-between mb-2">
                <div className="space-y-1 flex-1">
                  <p className="text-xs text-muted-foreground">Total Outflow</p>
                  <p
                    className="text-2xl font-bold tabular-nums text-foreground"
                    aria-label={`Total outflow ${formattedTotalOutflow} ${activeTimeScale}`}
                    aria-live="polite"
                  >
                    {formattedTotalOutflow}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="h-5 w-5 text-[var(--color-warning)]" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{snapshot.outflowNote}</p>
                <div className="w-20 h-10">
                  <ResponsiveContainer width="100%" height="100%" aria-hidden="true">
                    <LineChart data={snapshot.outflowSparkline}>
                      <Line type="monotone" dataKey="value" stroke="var(--color-warning)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </TooltipProvider>
  )
}
