"use client"

import { useState } from "react"
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
import { TrendingDown, AlertCircle, Clock } from "lucide-react"
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

export default function TaxesPage() {
  const [taxYear, setTaxYear] = useState("2025")
  const [gainsFilter, setGainsFilter] = useState<string | null>(null)
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [explanationKey, setExplanationKey] = useState<"liability" | "harvest" | null>(null)

  const isComparisonMode = taxYear === "2024-compare"
  const explanation = explanationKey ? getTaxExplanation(explanationKey) : null

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 mb-6 bg-background/90 backdrop-blur-sm border-b border-border/20 px-4 sm:px-6 lg:px-8 py-4">
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

      <div className="space-y-8">
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20">
          <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="font-semibold text-orange-900 dark:text-orange-100">
                Tax-Loss Harvesting Opportunities Available
              </p>
              <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                5 positions identified with potential savings of $3,200. Review and act before December 31st to offset
                capital gains.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm font-medium text-orange-700 dark:text-orange-300">
                <Clock className="h-4 w-4" />
                <span>Act by Dec 31</span>
              </div>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => setCopilotOpen(true)}>
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

      <div className="mt-8 flex justify-end">
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
    </div>
  )
}
