"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Cell } from "recharts"
import type { TooltipContentProps } from "recharts"
import { Button } from "@/components/ui/button"
import { AccessibleChart } from "@/components/accessible-chart"
import { ChartContainer } from "@/components/chart-kit"
import { BAR_CHART_PRESETS, SEMANTIC_COLORS, CHART_STYLES } from "@/lib/chart-colors"

interface BudgetDatum {
  category: string
  budget: number
  actual: number
  variance: number
}

const data: BudgetDatum[] = [
  { category: "Housing", budget: 2200, actual: 2200, variance: 0 },
  { category: "Food", budget: 800, actual: 920, variance: -120 },
  { category: "Transport", budget: 450, actual: 380, variance: 70 },
  { category: "Entertainment", budget: 300, actual: 340, variance: -40 },
  { category: "Shopping", budget: 400, actual: 280, variance: 120 },
  { category: "Utilities", budget: 250, actual: 240, variance: 10 },
]

export function BudgetChart() {
  const [viewMode, setViewMode] = useState<"comparison" | "variance">("comparison")
  const [visibleSeries, setVisibleSeries] = useState<string[]>(["budget", "actual"])

  const comparisonTooltip = ({ active, payload, label }: TooltipContentProps<number, string>) => {
    if (active && payload && payload.length) {
      const budgetPayload = payload.find((item) => item.dataKey === "budget")?.value
      const actualPayload = payload.find((item) => item.dataKey === "actual")?.value
      const budget = typeof budgetPayload === "number" ? budgetPayload : Number(budgetPayload ?? 0)
      const actual = typeof actualPayload === "number" ? actualPayload : Number(actualPayload ?? 0)
      const variance = budget - actual
      const category = typeof label === "string" ? label : String(label)
      return (
        <div className="rounded-lg border bg-card p-3 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{category}</p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Budget:</span>
              <span className="font-medium tabular-nums">${budget.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Actual:</span>
              <span className="font-medium tabular-nums">${actual.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t">
              <span className="text-muted-foreground">Variance:</span>
              <span
                className={`font-semibold tabular-nums ${variance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {variance >= 0 ? "+" : ""}${variance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const varianceTooltip = ({ active, payload, label }: TooltipContentProps<number, string>) => {
    if (active && payload && payload.length) {
      const value = payload[0]?.value
      const variance = typeof value === "number" ? value : Number(value ?? 0)
      const category = typeof label === "string" ? label : String(label)
      return (
        <div className="rounded-lg border bg-card p-3 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{category}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Variance:</span>
            <span
              className={`text-sm font-semibold tabular-nums ${
                variance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {variance >= 0 ? "+" : ""}${variance.toLocaleString()}
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  const description = useMemo(() => {
    if (viewMode === "variance") {
      return "Bar chart showing positive or negative variance amounts by category."
    }

    const segments: string[] = []
    if (visibleSeries.includes("budget")) segments.push("planned budget")
    if (visibleSeries.includes("actual")) segments.push("actual spend")
    return `Bar chart comparing ${segments.join(" and ")} by category.`
  }, [viewMode, visibleSeries])

  const toggleSeries = (series: string) => {
    setVisibleSeries((current) => {
      const isActive = current.includes(series)
      if (isActive && current.length === 1) {
        return current
      }
      return isActive ? current.filter((item) => item !== series) : [...current, series]
    })
  }

  return (
    <Card className="card-standard">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Budget vs Actual Spending</CardTitle>
          <div className="flex gap-0.5 rounded-lg border p-0.5 bg-muted/30">
            <Button
              variant={viewMode === "comparison" ? "secondary" : "ghost"}
              size="sm"
              className={`h-8 text-xs px-3 ${viewMode === "comparison" ? "shadow-sm" : ""}`}
              onClick={() => setViewMode("comparison")}
            >
              Comparison
            </Button>
            <Button
              variant={viewMode === "variance" ? "secondary" : "ghost"}
              size="sm"
              className={`h-8 text-xs px-3 ${viewMode === "variance" ? "shadow-sm" : ""}`}
              onClick={() => setViewMode("variance")}
            >
              Variance
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          title="Budget performance by category"
          description={description}
          comparisonOptions={
            viewMode === "comparison"
              ? (
                  [
                    { id: "budget", label: "Planned" },
                    { id: "actual", label: "Actual" },
                  ] as const
                )
              : undefined
          }
          selectedComparisons={visibleSeries}
          onComparisonToggle={toggleSeries}
        >
          <AccessibleChart
            title="Budget performance by category"
            description={description}
            className="w-full h-[350px]"
            contentClassName="h-full"
          >
            <ResponsiveContainer width="100%" height={350}>
              {viewMode === "comparison" ? (
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid 
                    strokeDasharray={CHART_STYLES.grid.strokeDasharray}
                    stroke={CHART_STYLES.grid.stroke}
                    vertical={CHART_STYLES.grid.vertical}
                    opacity={CHART_STYLES.grid.opacity}
                  />
                  <XAxis
                    dataKey="category"
                    stroke={CHART_STYLES.axis.stroke}
                    fontSize={CHART_STYLES.axis.fontSize}
                    tick={{ fill: CHART_STYLES.axis.fill }}
                    tickLine={CHART_STYLES.axis.tickLine}
                    axisLine={CHART_STYLES.axis.axisLine}
                    tickMargin={CHART_STYLES.axis.tickMargin}
                  />
                  <YAxis
                    stroke={CHART_STYLES.axis.stroke}
                    fontSize={CHART_STYLES.axis.fontSize}
                    tick={{ fill: CHART_STYLES.axis.fill }}
                    tickLine={CHART_STYLES.axis.tickLine}
                    axisLine={CHART_STYLES.axis.axisLine}
                    tickMargin={CHART_STYLES.axis.tickMargin}
                  />
                  <Tooltip content={comparisonTooltip} />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
                  {visibleSeries.includes("budget") ? (
                    <Bar dataKey="budget" fill={BAR_CHART_PRESETS.budgetVariance.onBudget} name="Budget" radius={CHART_STYLES.bar.radius} />
                  ) : null}
                  {visibleSeries.includes("actual") ? (
                    <Bar dataKey="actual" fill={SEMANTIC_COLORS.positive} name="Actual" radius={CHART_STYLES.bar.radius} />
                  ) : null}
                </BarChart>
              ) : (
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid 
                    strokeDasharray={CHART_STYLES.grid.strokeDasharray}
                    stroke={CHART_STYLES.grid.stroke}
                    vertical={CHART_STYLES.grid.vertical}
                    opacity={CHART_STYLES.grid.opacity}
                  />
                  <XAxis
                    dataKey="category"
                    stroke={CHART_STYLES.axis.stroke}
                    fontSize={CHART_STYLES.axis.fontSize}
                    tick={{ fill: CHART_STYLES.axis.fill }}
                    tickLine={CHART_STYLES.axis.tickLine}
                    axisLine={CHART_STYLES.axis.axisLine}
                    tickMargin={CHART_STYLES.axis.tickMargin}
                  />
                  <YAxis
                    stroke={CHART_STYLES.axis.stroke}
                    fontSize={CHART_STYLES.axis.fontSize}
                    tick={{ fill: CHART_STYLES.axis.fill }}
                    tickLine={CHART_STYLES.axis.tickLine}
                    axisLine={CHART_STYLES.axis.axisLine}
                    tickMargin={CHART_STYLES.axis.tickMargin}
                  />
                  <Tooltip content={varianceTooltip} />
                  <Bar dataKey="variance" name="Variance" radius={CHART_STYLES.bar.radius}>
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.variance >= 0 ? BAR_CHART_PRESETS.budgetVariance.underBudget : BAR_CHART_PRESETS.budgetVariance.overBudget} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </AccessibleChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
