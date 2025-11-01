"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ShoppingBag, Home, Car, Utensils, Zap, MoreHorizontal } from "lucide-react"

const spendingCategories = [
  { name: "Housing", amount: 2200, budget: 2500, icon: Home },
  { name: "Transportation", amount: 450, budget: 600, icon: Car },
  { name: "Food & Dining", amount: 680, budget: 800, icon: Utensils },
  { name: "Shopping", amount: 320, budget: 400, icon: ShoppingBag },
  { name: "Utilities", amount: 280, budget: 300, icon: Zap },
  { name: "Other", amount: 420, budget: 500, icon: MoreHorizontal },
]

export function SpendingBreakdown() {
  return (
    <Card className="card-standard">
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>Current month spending by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {spendingCategories.map((category) => {
            const Icon = category.icon
            const percentage = (category.amount / category.budget) * 100
            const isOverBudget = percentage > 100
            return (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${category.amount.toLocaleString()} / ${category.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-medium tabular-nums ${isOverBudget ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    {percentage.toFixed(0)}%
                  </p>
                </div>
                <Progress value={Math.min(percentage, 100)} className="h-1.5" />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
