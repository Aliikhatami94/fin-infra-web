"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Cell } from "recharts"
import type { TooltipContentProps } from "recharts"
import { Button } from "@/components/ui/button"
import { AccessibleChart } from "@/components/accessible-chart"

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

  const description = useMemo(
    () =>
      viewMode === "comparison"
        ? "Bar chart comparing budgeted versus actual spending for each category."
        : "Bar chart showing positive or negative variance amounts by category.",
    [viewMode],
  )

  return (
    <Card className="border-border/50 shadow-sm">
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
        <AccessibleChart
          title="Budget performance by category"
          description={description}
          className="w-full h-[350px]"
          contentClassName="h-full"
        >
          <ResponsiveContainer width="100%" height={350}>
            {viewMode === "comparison" ? (
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                <XAxis
                  dataKey="category"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip content={comparisonTooltip} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
                <Bar dataKey="budget" fill="hsl(210, 100%, 60%)" name="Budget" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="hsl(142, 76%, 45%)" name="Actual" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                <XAxis
                  dataKey="category"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip content={varianceTooltip} />
                <Bar dataKey="variance" name="Variance" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.variance >= 0 ? "hsl(142, 76%, 45%)" : "hsl(0, 84%, 60%)"} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </AccessibleChart>
      </CardContent>
    </Card>
  )
}
