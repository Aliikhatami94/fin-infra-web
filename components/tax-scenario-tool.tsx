"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SliderField } from "@/components/ui/slider"
import { Calculator, TrendingDown, Info, Sparkles, Printer, Download } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getTaxHarvestingScenario } from "@/lib/services"
import { trackTransactionBulkAction } from "@/lib/analytics/events"
import { formatCurrency } from "@/lib/format"

const scenario = getTaxHarvestingScenario()

const presets = [
  {
    id: "conservative",
    label: "Conservative",
    description: "Harvest top two loss positions",
    selections: [true, true, false, false, false],
  },
  {
    id: "balanced",
    label: "Balanced",
    description: "Harvest three positions with highest losses",
    selections: [true, true, true, false, false],
  },
  {
    id: "aggressive",
    label: "Aggressive",
    description: "Harvest all available loss positions",
    selections: [true, true, true, true, true],
  },
]

export function TaxScenarioTool() {
  const [selectedPositions, setSelectedPositions] = useState<boolean[]>(
    scenario.harvestablePositions.map((position: { selected?: boolean }) => Boolean(position.selected)),
  )
  const [taxRate, setTaxRate] = useState([scenario.defaultTaxRate])
  const [presetId, setPresetId] = useState<string | null>(null)

  const togglePosition = (index: number) => {
    const newSelected = [...selectedPositions]
    newSelected[index] = !newSelected[index]
    setSelectedPositions(newSelected)
  }

  const applyPreset = (id: string) => {
    const preset = presets.find((entry) => entry.id === id)
    if (!preset) return
    setSelectedPositions(preset.selections)
    setPresetId(id)
  }

  const totalLossHarvested = scenario.harvestablePositions.reduce(
    (sum: number, pos: { loss: number }, idx: number) => sum + (selectedPositions[idx] ? pos.loss : 0),
    0,
  )

  const potentialSavings = Math.round(totalLossHarvested * (taxRate[0] / 100))
  const currentTaxLiability = scenario.currentTaxLiability
  const newTaxLiability = currentTaxLiability - potentialSavings

  const exportSummary = () => {
    trackTransactionBulkAction({ action: "export", count: selectedPositions.filter(Boolean).length, filterIds: ["tax-scenario"] })
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  const taxRateLabel = (
    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
      Your Marginal Tax Rate
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
              <Info className="h-4 w-4" />
              <span className="sr-only">Why do we use this rate?</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Based on your income bracket.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </span>
  )

  return (
    <Card className="card-standard card-lift">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              What-If Tax Scenario
            </CardTitle>
            <CardDescription className="mt-1">
              Model potential tax savings by harvesting losses before year-end
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Loss harvesting presets">
          {presets.map((preset) => {
            const isActive = presetId === preset.id
            return (
              <Button
                key={preset.id}
                variant={isActive ? "secondary" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => applyPreset(preset.id)}
              >
                {preset.label}
                <span className="text-[11px] text-muted-foreground">{preset.description}</span>
              </Button>
            )
          })}
          <Button variant="ghost" size="sm" onClick={() => setPresetId(null)}>
            Clear preset
          </Button>
        </div>

        <SliderField
          value={taxRate}
          onValueChange={setTaxRate}
          min={10}
          max={37}
          step={1}
          label={taxRateLabel}
          description="Adjust to explore different marginal tax rates."
          formatValue={(values) => `${values[0]}%`}
          analyticsId="tax-scenario:marginal-rate"
          analyticsLabel="Marginal tax rate"
        />

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Select Positions to Harvest</label>
          <div className="space-y-2">
            {scenario.harvestablePositions.map((position: { asset: string; loss: number }, index: number) => (
              <div
                key={index}
                onClick={() => togglePosition(index)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-smooth ${
                  selectedPositions[index]
                    ? "border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-950/30"
                    : "border-border/30 hover:border-border/60 hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-smooth ${
                      selectedPositions[index] ? "border-purple-600 bg-purple-600" : "border-muted-foreground/30"
                    }`}
                  >
                    {selectedPositions[index] && (
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground">{position.asset}</span>
                </div>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400 tabular-nums">
                  -${position.loss.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border/30">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Loss Harvested</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 tabular-nums">
                -${totalLossHarvested.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Potential Tax Savings</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 tabular-nums">
                ${potentialSavings.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/40 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Tax Liability</span>
              <span className="font-semibold tabular-nums">${currentTaxLiability.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tax Savings</span>
              <span className="font-semibold text-green-600 dark:text-green-400 tabular-nums">
                -${potentialSavings.toLocaleString()}
              </span>
            </div>
            <div className="pt-2 border-t border-border/30 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">New Tax Liability</span>
              <span className="text-lg font-bold tabular-nums">${newTaxLiability.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Current plan</h4>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li>Liability: {formatCurrency(currentTaxLiability)}</li>
                <li>Tax rate: {taxRate[0]}%</li>
                <li>Harvested positions: {selectedPositions.filter(Boolean).length}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">After harvest</h4>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li>Liability: {formatCurrency(newTaxLiability)}</li>
                <li>Projected savings: {formatCurrency(potentialSavings)}</li>
                <li>Preset: {presetId ? presets.find((p) => p.id === presetId)?.label ?? "Custom" : "Custom"}</li>
              </ul>
            </div>
          </div>

          <Button className="w-full gap-2" variant="cta" disabled={totalLossHarvested === 0}>
            <TrendingDown className="h-4 w-4" />
            Execute Harvest Plan
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={exportSummary}>
              <Printer className="h-4 w-4" /> Print summary
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
