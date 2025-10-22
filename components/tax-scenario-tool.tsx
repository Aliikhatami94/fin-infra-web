"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Calculator, TrendingDown, Info, Sparkles } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const harvestablePositions = [
  { asset: "GOOGL", loss: 850, selected: false },
  { asset: "AMD", loss: 320, selected: false },
  { asset: "PLTR", loss: 1200, selected: false },
  { asset: "COIN", loss: 580, selected: false },
  { asset: "SQ", loss: 250, selected: false },
]

export function TaxScenarioTool() {
  const [selectedPositions, setSelectedPositions] = useState<boolean[]>(harvestablePositions.map(() => false))
  const [taxRate, setTaxRate] = useState([32])

  const togglePosition = (index: number) => {
    const newSelected = [...selectedPositions]
    newSelected[index] = !newSelected[index]
    setSelectedPositions(newSelected)
  }

  const totalLossHarvested = harvestablePositions.reduce(
    (sum, pos, idx) => sum + (selectedPositions[idx] ? pos.loss : 0),
    0,
  )

  const potentialSavings = Math.round(totalLossHarvested * (taxRate[0] / 100))
  const currentTaxLiability = 18450
  const newTaxLiability = currentTaxLiability - potentialSavings

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
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Your Marginal Tax Rate</label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Based on your income bracket</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-4">
            <Slider value={taxRate} onValueChange={setTaxRate} min={10} max={37} step={1} className="flex-1" />
            <Badge variant="outline" className="w-16 justify-center tabular-nums">
              {taxRate[0]}%
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Select Positions to Harvest</label>
          <div className="space-y-2">
            {harvestablePositions.map((position, index) => (
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

          <Button
            className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            disabled={totalLossHarvested === 0}
          >
            <TrendingDown className="h-4 w-4" />
            Execute Harvest Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
