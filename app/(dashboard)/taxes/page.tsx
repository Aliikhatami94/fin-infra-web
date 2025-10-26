"use client"

import { useMemo, useState } from "react"
import { TaxesAIInsights } from "@/components/taxes-ai-insights"
import { TaxSummary } from "@/components/tax-summary"
import { CapitalGainsTable } from "@/components/capital-gains-table"
import { TaxDocuments } from "@/components/tax-documents"
import { TaxScenarioTool } from "@/components/tax-scenario-tool"
import { TaxYearComparison } from "@/components/tax-year-comparison"
import { ScenarioPlaybook } from "@/components/scenario-playbook"
import { TaxDeadlineTimeline } from "@/components/tax-deadline-timeline"
import { AutomationCopilotDrawer } from "@/components/automation-copilot-drawer"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingDown, AlertCircle, Clock, CalendarDays } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getTaxExplanation } from "@/lib/mock"
import { differenceInCalendarDays, format } from "date-fns"
import Link from "next/link"

export default function TaxesPage() {
  const [taxYear, setTaxYear] = useState("2025")
  const [gainsFilter, setGainsFilter] = useState<string | null>(null)
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [explanationKey, setExplanationKey] = useState<"liability" | "harvest" | null>(null)

  const isComparisonMode = taxYear === "2024-compare"
  const explanation = explanationKey ? getTaxExplanation(explanationKey) : null

  const filingYear = useMemo(() => {
    const numeric = Number.parseInt(taxYear, 10)
    if (Number.isFinite(numeric)) {
      return numeric
    }
    if (taxYear === "2024-compare") {
      return 2025
    }
    return new Date().getFullYear()
  }, [taxYear])

  const deadlineItems = useMemo(() => {
    const today = new Date()

    const resolveDate = (month: number, day: number, yearOffset = 0) => {
      const baseYear = filingYear + yearOffset
      let target = new Date(baseYear, month, day)
      if (differenceInCalendarDays(target, today) < 0) {
        target = new Date(baseYear + 1, month, day)
      }
      return target
    }

    const items = [
      {
        id: "harvest",
        label: "Loss harvesting cutoff",
        month: 11,
        day: 31,
        description: "Realize losses before year-end to offset gains.",
        action: {
          type: "button" as const,
          label: "Review positions",
          onClick: () => setCopilotOpen(true),
        },
      },
      {
        id: "estimate",
        label: "Q4 estimated payment due",
        month: 0,
        day: 15,
        yearOffset: 1,
        description: "Submit your January 15 estimated payment to avoid penalties.",
        action: {
          type: "button" as const,
          label: "View schedule",
          onClick: () => setExplanationKey("liability"),
        },
      },
      {
        id: "documents",
        label: "1099 delivery window",
        month: 1,
        day: 15,
        yearOffset: 1,
        description: "Expect brokerage forms by February 15—follow up on anything missing.",
        action: {
          type: "link" as const,
          label: "Go to Documents",
          href: "/documents",
        },
      },
    ]

    return items
      .map((item) => {
        const targetDate = resolveDate(item.month, item.day, item.yearOffset ?? 0)
        return {
          ...item,
          targetDate,
          daysRemaining: Math.max(differenceInCalendarDays(targetDate, today), 0),
        }
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
  }, [filingYear, setCopilotOpen, setExplanationKey])

  const primaryDeadline = deadlineItems[0]

  return (
    <>
      <div className="bg-card/90 backdrop-blur-md border-b border-border/20">
  <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl md:text-2xl font-semibold text-foreground">Tax Planning & Estimates</h1>
            <Select value={taxYear} onValueChange={setTaxYear}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select tax year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025 Tax Year</SelectItem>
                <SelectItem value="2024-compare">
                  <div className="flex items-center gap-2">
                    <span>Compare: 2025 vs 2024</span>
                  </div>
                </SelectItem>
                <SelectItem value="2024">2024 Tax Year</SelectItem>
                <SelectItem value="2023">2023 Tax Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="destructive"
            className="gap-2 bg-orange-600 hover:bg-orange-700"
            onClick={() => setCopilotOpen(true)}
          >
            <TrendingDown className="h-4 w-4" />
            Plan Tax Loss Harvesting
          </Button>
          </div>
        </div>
      </div>

  <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 space-y-8">
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20">
          <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1 space-y-2">
                <p className="font-semibold text-orange-900 dark:text-orange-100">Tax planning countdown</p>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Stay ahead of the year-end rush—tackle the urgent items below to keep penalties and paperwork surprises off
                  your plate.
                </p>
              </div>
              {primaryDeadline && (
                <div className="flex items-center gap-3 rounded-lg border border-orange-200 bg-white/80 px-4 py-3 text-orange-900 shadow-sm dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                    <CalendarDays className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide">Next deadline</p>
                    <p className="text-sm font-semibold leading-tight">{primaryDeadline.label}</p>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      {primaryDeadline.daysRemaining} days left · {format(primaryDeadline.targetDate, "MMM d")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-3 xl:grid-cols-2">
              {deadlineItems.map((deadline) => (
                <div
                  key={deadline.id}
                  className="rounded-lg border border-orange-200/70 bg-white/80 p-4 text-orange-900 shadow-sm transition hover:border-orange-300 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-100"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold leading-snug">{deadline.label}</p>
                      <p className="text-xs text-orange-700/90 dark:text-orange-300/90">
                        {format(deadline.targetDate, "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="text-right text-xs font-semibold text-orange-700 dark:text-orange-300">
                      {deadline.daysRemaining} days
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-orange-800/90 dark:text-orange-200/90">{deadline.description}</p>
                  <div className="mt-3">
                    {deadline.action.type === "button" ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="border-orange-300 text-orange-900 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-100 dark:hover:bg-orange-900"
                        onClick={deadline.action.onClick}
                      >
                        {deadline.action.label}
                      </Button>
                    ) : (
                      <Button
                        asChild
                        size="sm"
                        variant="secondary"
                        className="border-orange-300 text-orange-900 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-100 dark:hover:bg-orange-900"
                      >
                        <Link href={deadline.action.href}>{deadline.action.label}</Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-orange-800 dark:text-orange-200">
              <div className="flex items-center gap-1 font-medium">
                <Clock className="h-4 w-4" />
                <span>
                  Loss harvesting closes {primaryDeadline ? format(primaryDeadline.targetDate, "MMM d") : "soon"}
                </span>
              </div>
              <Button
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => setCopilotOpen(true)}
              >
                Review Positions
              </Button>
              <Button variant="link" size="sm" className="px-0 text-orange-700" onClick={() => setExplanationKey("harvest")}>
                Why?
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        <TaxesAIInsights onLaunchCopilot={() => setCopilotOpen(true)} />

        <TaxDeadlineTimeline />

        {isComparisonMode ? <TaxYearComparison /> : <TaxSummary onFilterChange={setGainsFilter} />}

        <ErrorBoundary feature="Tax scenario tool">
          <TaxScenarioTool />
        </ErrorBoundary>

        <ScenarioPlaybook surface="taxes" />

        <CapitalGainsTable initialFilter={gainsFilter} />
        <TaxDocuments />
      </div>

  <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 mt-8 flex justify-end">
        <Button variant="link" size="sm" className="px-0" onClick={() => setExplanationKey("liability")}>
          Why is my projected liability this high?
        </Button>
      </div>

      <AutomationCopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        surface="taxes"
        initialSuggestionId="tax-harvest-december"
      />

      <Dialog open={Boolean(explanation)} onOpenChange={(open) => !open && setExplanationKey(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{explanation?.title ?? "Copilot rationale"}</DialogTitle>
            <DialogDescription>{explanation?.summary}</DialogDescription>
          </DialogHeader>
          {explanation && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase">Sources</p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {explanation.sources.map((source) => (
                  <li key={source}>{source}</li>
                ))}
              </ul>
            </div>
          )}
          <DialogFooter className="mt-6 flex justify-end">
            <Button variant="ghost" onClick={() => setExplanationKey(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
