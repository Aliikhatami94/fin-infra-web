"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const subscriptions = [
  { name: "Netflix", amount: 15.99, nextBilling: "Jan 15", category: "Entertainment" },
  { name: "Spotify", amount: 9.99, nextBilling: "Jan 18", category: "Entertainment" },
  { name: "Amazon Prime", amount: 14.99, nextBilling: "Jan 22", category: "Shopping" },
  { name: "Adobe Creative Cloud", amount: 54.99, nextBilling: "Jan 25", category: "Software" },
  { name: "Gym Membership", amount: 49.99, nextBilling: "Feb 1", category: "Health" },
]

export function RecurringExpenses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recurring Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subscriptions.map((sub, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{sub.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {sub.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Next: {sub.nextBilling}</span>
                </div>
              </div>
              <p className="text-sm font-semibold tabular-nums text-foreground">${sub.amount}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
