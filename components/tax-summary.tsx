"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingDown, Info, Clock, PieChart, TrendingUp, FileText, ShieldCheck } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts"
import { motion } from "framer-motion"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface CapitalGainSegment {
  name: "ST" | "LT"
  value: number
  color: string
}

const capitalGainsData: CapitalGainSegment[] = [
  { name: "ST", value: 4200, color: "hsl(25, 95%, 53%)" },
  { name: "LT", value: 8140, color: "hsl(142, 76%, 36%)" },
]

type ReadinessItem = {
  id: string
  title: string
  icon: "filing" | "documents" | "payments"
  progress: number
  status: string
  summary: string
  criteria: { label: string; complete: number; total: number }[]
  action?: { type: "link"; label: string; href: string }
}

interface TaxSummaryProps {
  onFilterChange?: (filter: string | null) => void
}

export function TaxSummary({ onFilterChange }: TaxSummaryProps) {
  const [activeReadinessId, setActiveReadinessId] = useState<string | null>(null)

  const readinessItems = useMemo<ReadinessItem[]>(
    () => [
      {
        id: "filing",
        title: "Filing readiness",
        icon: "filing",
        progress: 68,
        status: "3 checklist items left",
        summary: "Most core data is complete, but you still have three planning tasks that affect your final filing accuracy.",
        criteria: [
          { label: "Tax checklist tasks", complete: 8, total: 11 },
          { label: "Income sources verified", complete: 5, total: 6 },
          { label: "Adjustments planned", complete: 2, total: 3 },
        ],
      },
      {
        id: "documents",
        title: "Document readiness",
        icon: "documents",
        progress: 72,
        status: "2 forms outstanding",
        summary: "Brokerage 1099s are mostly in, but two accounts still need uploads before you can share your packet.",
        criteria: [
          { label: "Brokerage 1099 forms", complete: 3, total: 5 },
          { label: "Employer W-2 forms", complete: 2, total: 2 },
          { label: "Prior-year carryforwards", complete: 1, total: 1 },
        ],
        action: { type: "link", label: "Open Documents", href: "/documents" },
      },
      {
        id: "payments",
        title: "Payment readiness",
        icon: "payments",
        progress: 87,
        status: "Final estimate scheduled",
        summary: "Estimated payments cover 87% of projected liability—January's remittance locks in the remainder.",
        criteria: [
          { label: "Quarterly estimates sent", complete: 3, total: 4 },
          { label: "Withholding adjustments", complete: 1, total: 2 },
          { label: "Balance remaining", complete: 0, total: 1 },
        ],
      },
    ],
    [],
  )

  const activeReadiness = readinessItems.find((item) => item.id === activeReadinessId) ?? null

  const handleBarClick = (segment: CapitalGainSegment) => {
    if (!onFilterChange) {
      return
    }
    if (segment.name === "ST") {
      onFilterChange("short-term")
    } else if (segment.name === "LT") {
      onFilterChange("long-term")
    }
  }

  return (
    <>
  {/* Responsive auto-fit grid so cards reflow instead of squishing; stretch items so heights match per row */}
  <div className="grid items-stretch gap-6 md:gap-8 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
      <motion.div {...createStaggeredCardVariants(0, 0)}>
        <Card className="card-standard card-lift h-full min-h-[200px]">
          <CardContent className="p-5 h-full flex flex-col">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-2">Estimated Tax Liability</p>
                <LastSyncBadge timestamp="1 hour ago" source="IRS" />
                <p className="text-3xl font-semibold tabular-nums text-foreground">$18,450</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-auto space-y-2">
              <p className="text-xs text-muted-foreground">vs. $16,000 paid to date</p>
              <Badge className="text-xs bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">
                $2,450 shortfall
              </Badge>
              <div className="mt-3">
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: "87%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">87% paid</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...createStaggeredCardVariants(1, 0)}>
        <Card className="card-standard card-lift h-full min-h-[200px]">
          <CardContent className="p-5 h-full flex flex-col">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Capital Gains YTD</p>
                  <LastSyncBadge timestamp="10 min ago" source="Broker" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          type="button"
                          className="inline-flex items-center justify-center rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors"
                          aria-label="More information about Capital Gains YTD"
                        >
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Short-Term: $4,200 (higher tax rate)</p>
                        <p className="text-xs">Long-Term: $8,140 (lower tax rate)</p>
                        <p className="text-xs mt-1 text-muted-foreground">Click bars to filter table below</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-3xl font-semibold tabular-nums text-foreground">$12,340</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-auto space-y-2">
              <div className="h-8 -mx-2 cursor-pointer">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={capitalGainsData}>
                    <Bar
                      dataKey="value"
                      radius={[4, 4, 0, 0]}
                      onClick={(_, index) => {
                        const segment = capitalGainsData[index]
                        if (segment) {
                          handleBarClick(segment)
                        }
                      }}
                    >
                      {capitalGainsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-900 transition-smooth"
                  onClick={() => onFilterChange?.("short-term")}
                >
                  ST: $4,200
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 cursor-pointer hover:bg-green-200 dark:hover:bg-green-900 transition-smooth"
                  onClick={() => onFilterChange?.("long-term")}
                >
                  LT: $8,140
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...createStaggeredCardVariants(2, 0)}>
        <Card className="card-standard card-lift h-full min-h-[200px]">
          <CardContent className="p-5 h-full flex flex-col">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Dividends YTD</p>
                  <LastSyncBadge timestamp="10 min ago" source="Broker" />
                </div>
                <p className="text-3xl font-semibold tabular-nums text-foreground">$2,850</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950">
                <PieChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-auto space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="text-xs bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                >
                  Qualified: $2,400
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
                >
                  Non-Qual: $450
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Non-Qualified taxed at ordinary income rate</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...createStaggeredCardVariants(3, 0)}>
        <Card className="card-standard card-lift h-full min-h-[200px]">
          <CardContent className="p-5 h-full flex flex-col">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Potential Tax Savings</p>
                  <LastSyncBadge timestamp="10 min ago" source="Broker" />
                </div>
                <p className="text-3xl font-semibold tabular-nums text-green-600 dark:text-green-400">$3,200</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950">
                <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-auto space-y-2">
              <p className="text-xs text-muted-foreground">Available loss harvesting</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs border-green-300 text-green-700 dark:text-green-400">
                  5 positions identified
                </Badge>
                <Badge variant="outline" className="text-xs border-orange-300 text-orange-700 dark:text-orange-400">
                  <Clock className="h-3 w-3 mr-1" />
                  Act by Dec 31
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
  {/* Span the readiness card across all columns regardless of count */}
  <motion.div {...createStaggeredCardVariants(4, 0)} className="col-[1/-1]">
          <Card className="card-standard card-lift">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tax readiness overview</p>
                    <p className="text-xs text-muted-foreground/80">
                      Tap a bar to review the criteria and outstanding counts for each readiness category.
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Updated moments ago
                  </Badge>
                </div>
                <div className="space-y-4">
                  {readinessItems.map((item) => {
                    const Icon =
                      item.icon === "documents" ? FileText : item.icon === "payments" ? Clock : ShieldCheck
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveReadinessId(item.id)}
                        className="w-full rounded-lg border border-border/50 bg-muted/40 p-4 text-left transition hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        aria-label={`View readiness details for ${item.title}`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">{item.title}</p>
                              <p className="text-xs text-muted-foreground">{item.status}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-foreground">{item.progress}%</span>
                          </div>
                        </div>
                        <Progress value={item.progress} className="mt-3 h-2" aria-hidden="true" />
                        <span className="sr-only">Tap to view readiness explanation</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={Boolean(activeReadiness)} onOpenChange={(open) => !open && setActiveReadinessId(null)}>
        <DialogContent>
          {activeReadiness && (
            <>
              <DialogHeader>
                <DialogTitle>{activeReadiness.title}</DialogTitle>
                <DialogDescription>{activeReadiness.summary}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  <span>{activeReadiness.status}</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {activeReadiness.criteria.map((criterion) => (
                    <li key={criterion.label} className="flex items-center justify-between rounded-md border border-border/40 bg-muted/40 px-3 py-2">
                      <span className="font-medium text-foreground">{criterion.label}</span>
                      <span className="tabular-nums text-xs text-muted-foreground">
                        {criterion.complete} of {criterion.total}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <DialogFooter className="mt-6">
                <Button variant="ghost" onClick={() => setActiveReadinessId(null)}>
                  Close
                </Button>
                {activeReadiness.action?.type === "link" && (
                  <Button asChild>
                    <Link href={activeReadiness.action.href}>{activeReadiness.action.label}</Link>
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
