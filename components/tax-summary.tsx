"use client"

import { Card, CardContent } from "@/components/ui/card"

const summary = [
  { label: "Estimated Tax Liability", value: "$18,450" },
  { label: "Capital Gains YTD", value: "$12,340" },
  { label: "Dividends YTD", value: "$2,850" },
  { label: "Tax-Loss Opportunities", value: "$3,200" },
]

export function TaxSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summary.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold tabular-nums text-foreground">{item.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
