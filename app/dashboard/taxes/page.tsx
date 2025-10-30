"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingDown, AlertCircle, CalendarDays, Info } from "lucide-react"
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
  const [showHarvestIntro, setShowHarvestIntro] = useState(false)
  const [acknowledgedDeadlines, setAcknowledgedDeadlines] = useState(false)

  const isComparisonMode = taxYear === "2024-compare"
  const explanation = explanationKey ? getTaxExplanation(explanationKey) : null

  const handlePlanHarvesting = () => {
    setShowHarvestIntro(true)
  }

  const handleConfirmHarvesting = () => {
    setShowHarvestIntro(false)
    setCopilotOpen(true)
  }

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
  const subtitle = isComparisonMode
    ? `Compare: ${filingYear} vs ${filingYear - 1}`
    : `Tax year ${filingYear}`

  return (
    <>
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-foreground">Taxes</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={taxYear} onValueChange={setTaxYear}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Select tax year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025 Tax Year</SelectItem>
                  <SelectItem value="2024-compare">
                    <div className="flex items-center gap-2">
                      <span>Compare: {filingYear} vs {filingYear - 1}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2024">2024 Tax Year</SelectItem>
                  <SelectItem value="2023">2023 Tax Year</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="destructive"
                className="gap-2 bg-orange-600 hover:bg-orange-700"
                onClick={handlePlanHarvesting}
              >
                <TrendingDown className="h-4 w-4" />
                Plan Tax Loss Harvesting
              </Button>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 space-y-8 py-6"
      >
        
        <Alert className="border-border bg-card dark:border-border">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <AlertDescription className="space-y-6">
            {/* Header Section */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">Tax planning countdown</h2>
              <p className="text-sm text-muted-foreground">
                Stay ahead of the year-end rush—tackle the urgent items below to keep penalties and paperwork surprises off your plate.
              </p>
            </div>

            {/* Next Deadline Highlight */}
            {primaryDeadline && (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/40">
                  <CalendarDays className="h-5 w-5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Next deadline</p>
                  <p className="text-sm font-semibold text-foreground">{primaryDeadline.label}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                    {primaryDeadline.daysRemaining} days left · {format(primaryDeadline.targetDate, "MMM d")}
                  </p>
                </div>
              </div>
            )}

            {/* All Deadlines Grid */}
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <Checkbox
                id="acknowledge-deadlines"
                checked={acknowledgedDeadlines}
                onCheckedChange={(checked) => setAcknowledgedDeadlines(checked === true)}
              />
              <Label
                htmlFor="acknowledge-deadlines"
                className="text-xs text-muted-foreground cursor-pointer leading-relaxed"
              >
                I acknowledge these deadlines may have tax implications and filing requirements. I will review the details before taking action.
              </Label>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {deadlineItems.map((deadline) => (
                <div
                  key={deadline.id}
                  className="flex flex-col rounded-lg border border-border bg-card p-4 shadow-sm transition hover:border-primary/50 hover:shadow"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-foreground">{deadline.label}</h3>
                      <p className="mt-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
                        {format(deadline.targetDate, "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="shrink-0 rounded bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-900/40 dark:text-orange-400">
                      {deadline.daysRemaining}d
                    </div>
                  </div>
                  <p className="mb-4 flex-1 text-xs leading-relaxed text-muted-foreground">{deadline.description}</p>
                  {deadline.action.type === "button" ? (
                    <div>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full"
                        onClick={deadline.action.onClick}
                        disabled={!acknowledgedDeadlines}
                      >
                        {deadline.action.label}
                      </Button>
                      {!acknowledgedDeadlines && (
                        <p className="mt-1 text-[10px] text-orange-600 dark:text-orange-400 text-center font-medium">
                          Check acknowledgment above
                        </p>
                      )}
                    </div>
                  ) : (
                    <Button
                      asChild
                      size="sm"
                      variant="secondary"
                      className="w-full"
                    >
                      <Link href={deadline.action.href}>{deadline.action.label}</Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Help Link */}
            <div className="flex items-center justify-center pt-2">
              <Button 
                variant="link" 
                size="sm" 
                className="text-orange-700 dark:text-orange-300" 
                onClick={() => setExplanationKey("harvest")}
              >
                <Info className="mr-1.5 h-3.5 w-3.5" />
                Why are these deadlines important?
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

        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 mt-8 flex justify-end">
          <Button variant="link" size="sm" className="px-0" onClick={() => setExplanationKey("liability")}>
            Why is my projected liability this high?
          </Button>
      </div>
      </motion.div>

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

      <Dialog open={showHarvestIntro} onOpenChange={setShowHarvestIntro}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-600" />
              About Tax Loss Harvesting
            </DialogTitle>
            <DialogDescription>
              Understand how this strategy works before proceeding
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950/20">
              <h4 className="font-semibold text-sm mb-2">What is tax loss harvesting?</h4>
              <p className="text-sm text-muted-foreground">
                Tax loss harvesting is a strategy where you sell investments at a loss to offset capital gains and reduce your tax liability. This can help lower your overall tax bill for the year.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Important considerations:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li><strong>Wash sale rule:</strong> You cannot repurchase the same or &ldquo;substantially identical&rdquo; security within 30 days before or after the sale.</li>
                <li><strong>Market timing:</strong> Selling and repurchasing affects your market exposure during the waiting period.</li>
                <li><strong>Transaction costs:</strong> Trading fees may reduce the benefit of small tax savings.</li>
                <li><strong>Long-term strategy:</strong> Harvesting works best as part of a comprehensive tax plan, not a one-time action.</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-amber-50 p-4 dark:bg-amber-950/20">
              <p className="text-sm">
                <strong>Disclaimer:</strong> This tool provides estimates based on your portfolio data. Always consult with a tax professional before executing any tax loss harvesting strategy. We do not provide tax advice.
              </p>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowHarvestIntro(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmHarvesting} className="bg-orange-600 hover:bg-orange-700">
              Continue to Planning Tool
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
