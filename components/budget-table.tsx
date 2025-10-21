"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const budgets = [
  { category: "Housing", budget: 2200, actual: 2200, variance: 0, percent: 100 },
  { category: "Food & Dining", budget: 800, actual: 920, variance: -120, percent: 115 },
  { category: "Transportation", budget: 450, actual: 380, variance: 70, percent: 84 },
  { category: "Entertainment", budget: 300, actual: 340, variance: -40, percent: 113 },
  { category: "Shopping", budget: 400, actual: 280, variance: 120, percent: 70 },
  { category: "Utilities", budget: 250, actual: 240, variance: 10, percent: 96 },
]

export function BudgetTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Budget by Category</CardTitle>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {budgets.map((budget, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{budget.category}</span>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">
                    ${budget.actual} / ${budget.budget}
                  </span>
                  <span
                    className={`font-semibold tabular-nums ${
                      budget.variance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {budget.variance >= 0 ? "+" : ""}${budget.variance}
                  </span>
                </div>
              </div>
              <Progress value={budget.percent} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
