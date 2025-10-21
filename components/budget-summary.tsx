"use client"

import { Card, CardContent } from "@/components/ui/card"

const summary = [
  { label: "Total Budgeted", value: "$6,500", color: "text-foreground" },
  { label: "Actual Spent", value: "$5,840", color: "text-foreground" },
  { label: "Remaining", value: "$660", color: "text-green-600 dark:text-green-400" },
]

export function BudgetSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {summary.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className={`text-3xl font-bold tabular-nums ${item.color}`}>{item.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
