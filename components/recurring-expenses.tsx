"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tv, Music, ShoppingBag, Palette, Dumbbell, Pause, X, PiggyBank, ChevronDown, ArrowUpDown } from "lucide-react"
import { InsightCard } from "@/components/insights/InsightCard"
import { trackInsightAction } from "@/lib/analytics/events"
import type { InsightAction, InsightDefinition } from "@/lib/insights/definitions"
import { cn } from "@/lib/utils"

const subscriptions = [
  {
    name: "Netflix",
    amount: 15.99,
    nextBilling: "Jan 15",
    category: "Entertainment",
    status: "active",
    icon: Tv,
  },
  { name: "Spotify", amount: 9.99, nextBilling: "Jan 18", category: "Entertainment", status: "active", icon: Music },
  {
    name: "Amazon Prime",
    amount: 14.99,
    nextBilling: "Today",
    category: "Shopping",
    status: "due",
    icon: ShoppingBag,
  },
  {
    name: "Adobe Creative Cloud",
    amount: 54.99,
    nextBilling: "Jan 25",
    category: "Software",
    status: "active",
    icon: Palette,
  },
  {
    name: "Gym Membership",
    amount: 49.99,
    nextBilling: "Feb 1",
    category: "Health",
    status: "active",
    icon: Dumbbell,
  },
]

interface RecurringExpensesProps {
  selectedCategory?: string | null
}

type SortOption = "amount-high" | "amount-low" | "date" | "name"

export function RecurringExpenses({ selectedCategory }: RecurringExpensesProps) {
  const [sortBy, setSortBy] = useState<SortOption>("amount-high")
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const filteredSubscriptions = selectedCategory
    ? subscriptions.filter((sub) => sub.category === selectedCategory)
    : subscriptions

  // Sort subscriptions
  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    switch (sortBy) {
      case "amount-high":
        return b.amount - a.amount
      case "amount-low":
        return a.amount - b.amount
      case "date":
        // Simple date comparison (assumes format like "Jan 15" or "Today")
        if (a.nextBilling === "Today") return -1
        if (b.nextBilling === "Today") return 1
        return a.nextBilling.localeCompare(b.nextBilling)
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  // Group by category
  const groupedSubscriptions = sortedSubscriptions.reduce((acc, sub) => {
    if (!acc[sub.category]) {
      acc[sub.category] = []
    }
    acc[sub.category].push(sub)
    return acc
  }, {} as Record<string, typeof subscriptions>)

  const totalMonthly = filteredSubscriptions.reduce((sum, sub) => sum + sub.amount, 0)

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }))
  }

  const cycleSortOption = () => {
    const options: SortOption[] = ["amount-high", "amount-low", "date", "name"]
    const currentIndex = options.indexOf(sortBy)
    const nextIndex = (currentIndex + 1) % options.length
    setSortBy(options[nextIndex])
  }

  const getSortLabel = () => {
    switch (sortBy) {
      case "amount-high":
        return "Amount (High)"
      case "amount-low":
        return "Amount (Low)"
      case "date":
        return "Date"
      case "name":
        return "Name"
    }
  }

  const insight: InsightDefinition = {
    id: "recurring-savings",
    title: "Optimize recurring spend",
    body: "Pausing two streaming subscriptions would save $30/month and keep you on track for the vacation fund.",
    category: "spending",
    topic: "Cash Flow",
    surfaces: ["cash-flow"],
    icon: PiggyBank,
    accent: "emerald",
    metrics: [
      { id: "potential", label: "Potential savings", value: "$30/mo", highlight: true },
      { id: "current", label: "Current recurring", value: `$${totalMonthly.toFixed(2)}/mo` },
    ],
    actions: [
      { id: "pause-subscriptions", label: "Review subscriptions" },
    ],
  }

  const handleInsightAction = (payload: { insight: InsightDefinition; action: InsightAction }) => {
    trackInsightAction(payload)
  }

  return (
    <Card className="card-standard">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Recurring Expenses</CardTitle>
          <div className="flex items-center gap-2">
            {/* Mobile: Sort button */}
            <Button
              variant="outline"
              size="sm"
              onClick={cycleSortOption}
              className="md:hidden h-8 gap-1.5 text-xs"
            >
              <ArrowUpDown className="h-3 w-3" />
              {getSortLabel()}
            </Button>
            <Badge variant="secondary" className="text-sm font-bold px-3 py-1">
              ${totalMonthly.toFixed(2)}/mo
            </Badge>
          </div>
        </div>
        {selectedCategory && <p className="text-xs text-muted-foreground">Filtered by: {selectedCategory}</p>}
        
        {/* Desktop: Sort options */}
        <div className="hidden md:flex items-center gap-2 pt-2">
          <span className="text-xs text-muted-foreground">Sort by:</span>
          <div className="flex items-center gap-1">
            {(["amount-high", "amount-low", "date", "name"] as SortOption[]).map((option) => (
              <Button
                key={option}
                variant={sortBy === option ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(option)}
                className="h-7 text-xs"
              >
                {option === "amount-high" && "Amount ↓"}
                {option === "amount-low" && "Amount ↑"}
                {option === "date" && "Date"}
                {option === "name" && "Name"}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="mb-4">
          <InsightCard insight={insight} onAction={handleInsightAction} />
        </div>
        
        {/* Mobile: Collapsible categories */}
        <div className="md:hidden space-y-2">
          {Object.entries(groupedSubscriptions).map(([category, items]) => {
            const categoryTotal = items.reduce((sum, item) => sum + item.amount, 0)
            const isExpanded = expandedCategories[category] ?? false
            const CategoryIcon = items[0].icon
            
            return (
              <Collapsible key={category} open={isExpanded}>
                <Card className="border-border/60">
                  <CollapsibleTrigger
                    onClick={() => toggleCategory(category)}
                    className="w-full"
                  >
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <CategoryIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-foreground">{category}</p>
                          <p className="text-xs text-muted-foreground">{items.length} subscription{items.length > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          ${categoryTotal.toFixed(2)}/mo
                        </Badge>
                        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t space-y-2 p-2">
                      {items.map((sub, index) => {
                        const Icon = sub.icon
                        return (
                          <div
                            key={index}
                            className={cn(
                              "flex items-center justify-between p-2 rounded-lg border transition-colors",
                              sub.status === "due" ? "bg-orange-500/10 border-orange-500/40" : "border-border/60 hover:bg-muted/30"
                            )}
                          >
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0 ml-2">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <p className="text-sm font-medium text-foreground truncate">{sub.name}</p>
                                {sub.status === "due" && (
                                  <Badge className="text-xs px-1.5 py-0 bg-orange-500 hover:bg-orange-600">Due</Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">{sub.nextBilling}</span>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              <p className="text-sm font-semibold tabular-nums text-foreground">${sub.amount.toFixed(2)}</p>
                              <div className="flex items-center gap-0.5">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 hover:bg-yellow-500/10"
                                  title="Pause"
                                  aria-label={`Pause ${sub.name}`}
                                >
                                  <Pause className="h-3 w-3 text-yellow-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 hover:bg-red-500/10"
                                  title="Cancel"
                                  aria-label={`Cancel ${sub.name}`}
                                >
                                  <X className="h-3 w-3 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )
          })}
        </div>

        {/* Desktop: Flat list */}
        <div className="hidden md:block space-y-2 max-h-[400px] overflow-y-auto pr-1 -mr-1 scrollbar-thin">
          {sortedSubscriptions.map((sub, index) => {
            const Icon = sub.icon
            return (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-colors",
                  sub.status === "due" ? "bg-orange-500/10 border-orange-500/40" : "border-border hover:bg-muted/30"
                )}
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0 ml-3">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground truncate">{sub.name}</p>
                    {sub.status === "due" && (
                      <Badge className="text-xs px-1.5 py-0 bg-orange-500 hover:bg-orange-600">Due Today</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                      {sub.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Next: {sub.nextBilling}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-2">
                  <p className="text-sm font-semibold tabular-nums text-foreground">${sub.amount.toFixed(2)}</p>
                  <div className="flex items-center gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-yellow-500/10"
                      title="Pause subscription"
                      aria-label={`Pause ${sub.name}`}
                    >
                      <Pause className="h-3.5 w-3.5 text-yellow-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-red-500/10"
                      title="Cancel subscription"
                      aria-label={`Cancel ${sub.name}`}
                    >
                      <X className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
