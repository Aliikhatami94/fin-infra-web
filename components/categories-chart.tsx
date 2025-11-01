"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const expenseData = [
  { name: "Housing", value: 2200, color: "hsl(0, 72%, 51%)", budget: 2500, spent: 2200 },
  { name: "Food", value: 850, color: "hsl(24, 95%, 53%)", budget: 800, spent: 850 },
  { name: "Transportation", value: 450, color: "hsl(45, 93%, 47%)", budget: 500, spent: 450 },
  { name: "Entertainment", value: 320, color: "hsl(280, 100%, 70%)", budget: 500, spent: 320 },
  { name: "Utilities", value: 280, color: "hsl(210, 100%, 60%)", budget: 300, spent: 280 },
  { name: "Uncategorized", value: 150, color: "hsl(0, 0%, 60%)", budget: 0, spent: 150 },
]

interface CategoriesChartProps {
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

export function CategoriesChart({ selectedCategory, onSelectCategory }: CategoriesChartProps) {
  const router = useRouter()
  const uncategorizedCount = 150

  return (
    <Card className="card-standard overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="truncate text-base">Budget Status</CardTitle>
          <div className="flex items-center gap-0.5 rounded-lg border border-border/60 bg-card/30 p-0.5 flex-shrink-0">
            <Button variant="default" size="sm" className="h-6 px-2 text-xs">
              Expenses
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              Income
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-hidden pt-0">
        {uncategorizedCount > 0 && (
          <div
            className="mb-3 p-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2 cursor-pointer hover:bg-yellow-500/15 transition-colors"
            onClick={() => router.push("/cash-flow?filter=uncategorized")}
          >
            <AlertCircle className="h-3.5 w-3.5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-yellow-500">Uncategorized</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                ${uncategorizedCount} need review
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2.5">
          {expenseData
            .filter((e) => e.budget > 0)
            .map((expense) => {
              const percentUsed = (expense.spent / expense.budget) * 100
              const isOverBudget = percentUsed > 100
              const overAmount = isOverBudget ? expense.spent - expense.budget : 0
              const isSelected = selectedCategory === expense.name

              return (
                <div
                  key={expense.name}
                  className={`space-y-1.5 cursor-pointer p-2.5 rounded-lg transition-all overflow-hidden ${
                    isOverBudget
                      ? "bg-red-500/5 hover:bg-red-500/10"
                      : isSelected
                        ? "bg-primary/10 ring-1 ring-primary/20"
                        : "hover:bg-muted/30"
                  }`}
                  onClick={() => onSelectCategory(isSelected ? null : expense.name)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: expense.color }} />
                      <span className="text-xs font-medium text-foreground truncate">{expense.name}</span>
                      {isSelected && <span className="text-[10px] text-primary font-medium whitespace-nowrap flex-shrink-0">(Active)</span>}
                    </div>
                    <span
                      className={`text-xs font-semibold tabular-nums flex-shrink-0 ${isOverBudget ? "text-red-500" : "text-muted-foreground"}`}
                    >
                      ${expense.spent.toLocaleString()} / ${expense.budget.toLocaleString()}
                      {isOverBudget && <span className="ml-1 text-[10px]">(+${overAmount})</span>}
                    </span>
                  </div>
                  <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                    {isOverBudget ? (
                      <>
                        <div className="absolute inset-0 bg-red-500/20 rounded-full" />
                        <div
                          className="absolute top-0 left-0 h-full bg-red-500 rounded-full"
                          style={{ width: `${Math.min(percentUsed, 100)}%` }}
                        />
                      </>
                    ) : (
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(percentUsed, 100)}%`,
                          backgroundColor: expense.color,
                        }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      </CardContent>
    </Card>
  )
}
