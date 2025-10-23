"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus,
  Pencil,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Search,
  Settings,
  TrendingUp,
  TrendingDown,
  Lightbulb,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Virtuoso } from "react-virtuoso"

type Budget = {
  category: string
  budget: number
  actual: number
  variance: number
  percent: number
  lastYearActual: number
  lastMonthActual: number
  suggestedBudget: number
  rolloverEnabled: boolean
}

const initialBudgets: Budget[] = [
  {
    category: "Housing",
    budget: 2200,
    actual: 2200,
    variance: 0,
    percent: 100,
    lastYearActual: 2100,
    lastMonthActual: 2200,
    suggestedBudget: 2200,
    rolloverEnabled: false,
  },
  {
    category: "Food & Dining",
    budget: 800,
    actual: 920,
    variance: -120,
    percent: 115,
    lastYearActual: 750,
    lastMonthActual: 850,
    suggestedBudget: 875,
    rolloverEnabled: false,
  },
  {
    category: "Transportation",
    budget: 450,
    actual: 380,
    variance: 70,
    percent: 84,
    lastYearActual: 420,
    lastMonthActual: 400,
    suggestedBudget: 425,
    rolloverEnabled: true,
  },
  {
    category: "Entertainment",
    budget: 300,
    actual: 340,
    variance: -40,
    percent: 113,
    lastYearActual: 280,
    lastMonthActual: 310,
    suggestedBudget: 325,
    rolloverEnabled: false,
  },
  {
    category: "Shopping",
    budget: 400,
    actual: 280,
    variance: 120,
    percent: 70,
    lastYearActual: 350,
    lastMonthActual: 320,
    suggestedBudget: 350,
    rolloverEnabled: true,
  },
  {
    category: "Utilities",
    budget: 250,
    actual: 240,
    variance: 10,
    percent: 96,
    lastYearActual: 230,
    lastMonthActual: 245,
    suggestedBudget: 245,
    rolloverEnabled: false,
  },
]

type SortField = "category" | "budget" | "actual" | "variance"
type SortDirection = "asc" | "desc"

export function BudgetTable() {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets)
  const [sortField, setSortField] = useState<SortField>("category")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [rolloverEnabled, setRolloverEnabled] = useState(false)
  const [warningThreshold, setWarningThreshold] = useState("90")
  const [showSuggested, setShowSuggested] = useState(true)
  const [comparisonPeriod, setComparisonPeriod] = useState<"lastMonth" | "lastYear">("lastMonth")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedBudgets = [...budgets].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    const modifier = sortDirection === "asc" ? 1 : -1

    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue) * modifier
    }
    return ((aValue as number) - (bValue as number)) * modifier
  })

  const filteredBudgets = sortedBudgets.filter((budget) =>
    budget.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const listHeight = useMemo(() => {
    const estimatedCard = 132
    const totalHeight = filteredBudgets.length * estimatedCard
    const maxHeight = 640
    const minHeight = 320
    return Math.max(minHeight, Math.min(maxHeight, totalHeight))
  }, [filteredBudgets.length])

  const handleEdit = (index: number, budget: Budget) => {
    setEditingIndex(index)
    setEditValue(budget.budget.toString())
  }

  const handleSave = (index: number) => {
    const newBudgets = [...budgets]
    const newBudget = Number.parseFloat(editValue)
    if (!isNaN(newBudget)) {
      newBudgets[index].budget = newBudget
      newBudgets[index].variance = newBudget - newBudgets[index].actual
      newBudgets[index].percent = (newBudgets[index].actual / newBudget) * 100
      setBudgets(newBudgets)
    }
    setEditingIndex(null)
  }

  const handleCancel = () => {
    setEditingIndex(null)
    setEditValue("")
  }

  const handleAdvancedEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setEditDialogOpen(true)
  }

  const handleSaveAdvanced = () => {
    // Save advanced settings logic here
    setEditDialogOpen(false)
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-3.5 w-3.5 text-foreground" />
    ) : (
      <ArrowDown className="ml-1 h-3.5 w-3.5 text-foreground" />
    )
  }

  return (
    <>
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg font-semibold">Budget by Category</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 w-[200px]"
                />
              </div>
              <div className="flex gap-0.5 rounded-lg border p-0.5 bg-muted/30">
                <Button
                  variant={comparisonPeriod === "lastMonth" ? "secondary" : "ghost"}
                  size="sm"
                  className={`h-8 text-xs px-2 ${comparisonPeriod === "lastMonth" ? "shadow-sm" : ""}`}
                  onClick={() => setComparisonPeriod("lastMonth")}
                >
                  vs Last Month
                </Button>
                <Button
                  variant={comparisonPeriod === "lastYear" ? "secondary" : "ghost"}
                  size="sm"
                  className={`h-8 text-xs px-2 ${comparisonPeriod === "lastYear" ? "shadow-sm" : ""}`}
                  onClick={() => setComparisonPeriod("lastYear")}
                >
                  vs Last Year
                </Button>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 text-xs font-medium text-muted-foreground">
            <button
              onClick={() => handleSort("category")}
              className="flex items-center text-left hover:text-foreground"
            >
              CATEGORY
              <SortIcon field="category" />
            </button>
            <button onClick={() => handleSort("budget")} className="flex items-center hover:text-foreground">
              BUDGET
              <SortIcon field="budget" />
            </button>
            {showSuggested && (
              <button className="flex items-center hover:text-foreground">
                SUGGESTED
                <Lightbulb className="ml-1 h-3 w-3" />
              </button>
            )}
            <button onClick={() => handleSort("actual")} className="flex items-center hover:text-foreground">
              ACTUAL
              <SortIcon field="actual" />
            </button>
            <button onClick={() => handleSort("variance")} className="flex items-center hover:text-foreground">
              VARIANCE
              <SortIcon field="variance" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="hidden md:block">
              <Virtuoso
                data={filteredBudgets}
                style={{ height: listHeight }}
                overscan={200}
                computeItemKey={(index, budget) => `${budget.category}-${index}`}
                itemContent={(index, budget) => {
                  const previousActual = comparisonPeriod === "lastMonth" ? budget.lastMonthActual : budget.lastYearActual
                  const periodChange = budget.actual - previousActual
                  const periodChangePercent = ((periodChange / previousActual) * 100).toFixed(0)
                  const isOverBudget = budget.percent > 100
                  const isNearLimit = budget.percent > 90 && budget.percent <= 100

                  return (
                    <div className="mb-4 last:mb-0 group space-y-3 rounded-lg border border-transparent p-4 transition-all hover:border-border hover:bg-muted/30">
                      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-foreground">{budget.category}</span>
                          {budget.rolloverEnabled && (
                            <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                              Rollover
                            </Badge>
                          )}
                          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => handleEdit(index, budget)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => handleAdvancedEdit(budget)}
                            >
                              <Settings className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right min-w-[100px]">
                          {editingIndex === index ? (
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-7 w-20 text-sm"
                                autoFocus
                              />
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleSave(index)}>
                                <Check className="h-3.5 w-3.5 text-green-600" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleCancel}>
                                <X className="h-3.5 w-3.5 text-red-600" />
                              </Button>
                            </div>
                          ) : (
                            <div className="text-sm font-medium tabular-nums text-foreground">
                              ${budget.budget.toLocaleString()}
                            </div>
                          )}
                        </div>
                        {showSuggested && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="text-right min-w-[100px] cursor-help">
                                  <div className="text-sm font-medium tabular-nums text-muted-foreground flex items-center justify-end gap-1">
                                    <Lightbulb className="h-3 w-3 text-yellow-500" />${budget.suggestedBudget.toLocaleString()}
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs font-semibold mb-1">Based on 6-month average</p>
                                <p className="text-xs text-muted-foreground">Historical spending pattern</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        <div className="text-right min-w-[100px]">
                          <div className="text-sm font-medium tabular-nums text-foreground">
                            ${budget.actual.toLocaleString()}
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center justify-end gap-1 mt-0.5">
                                  {periodChange > 0 ? (
                                    <TrendingUp className="h-3 w-3 text-[var(--color-negative)]" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3 text-[var(--color-positive)]" />
                                  )}
                                  <span
                                    className={`text-xs font-medium ${periodChange > 0 ? "text-[var(--color-negative)]" : "text-[var(--color-positive)]"}`}
                                  >
                                    {periodChange > 0 ? "+" : ""}
                                    {periodChangePercent}%
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">
                                  {comparisonPeriod === "lastMonth" ? "Last Month" : "Last Year"}: ${previousActual.toLocaleString()}
                                </p>
                                <p className="text-xs">This Period: ${budget.actual.toLocaleString()}</p>
                                <p className="text-xs font-semibold mt-1">
                                  Change: {periodChange > 0 ? "+" : ""}${periodChange.toLocaleString()}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="text-right min-w-[80px] flex items-center justify-end gap-1">
                          {budget.variance >= 0 ? (
                            <ArrowUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                          )}
                          <span
                            className={`text-sm font-semibold tabular-nums ${
                              budget.variance >= 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            ${Math.abs(budget.variance)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={Math.min(budget.percent, 100)}
                            className="h-2.5 flex-1"
                            indicatorClassName={
                              isOverBudget
                                ? "bg-red-500"
                                : isNearLimit
                                  ? "bg-orange-500"
                                  : budget.percent > 75
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                            }
                          />
                          {isOverBudget && (
                            <Badge variant="destructive" className="text-xs px-2 py-0 h-5">
                              Over budget
                            </Badge>
                          )}
                          {isNearLimit && (
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-0 h-5 bg-orange-500/10 text-orange-700 dark:text-orange-400 border-0"
                            >
                              At limit
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{budget.percent.toFixed(0)}% spent</span>
                      </div>
                    </div>
                  )
                }}
              />
            </div>
            <div className="md:hidden space-y-3">
              {filteredBudgets.map((budget, index) => {
                const previousActual = comparisonPeriod === "lastMonth" ? budget.lastMonthActual : budget.lastYearActual
                const periodChange = budget.actual - previousActual
                const periodChangePercent = ((periodChange / previousActual) * 100).toFixed(0)
                const isOverBudget = budget.percent > 100
                const isNearLimit = budget.percent > 90 && budget.percent <= 100

                return (
                  <div key={index} className="card-standard card-lift p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="font-medium text-foreground">{budget.category}</span>
                        {budget.rolloverEnabled && (
                          <Badge variant="secondary" className="text-xs px-2 py-0 h-5 ml-2">
                            Rollover
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleEdit(index, budget)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleAdvancedEdit(budget)}
                        >
                          <Settings className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Budget</p>
                        <p className="text-base font-semibold tabular-nums">${budget.budget.toLocaleString()}</p>
                      </div>
                      {showSuggested && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Lightbulb className="h-3 w-3 text-yellow-500" />
                            Suggested
                          </p>
                          <p className="text-base font-semibold tabular-nums text-muted-foreground">
                            ${budget.suggestedBudget.toLocaleString()}
                          </p>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Actual</p>
                        <p className="text-base font-semibold tabular-nums">${budget.actual.toLocaleString()}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          {periodChange > 0 ? (
                            <TrendingUp className="h-3 w-3 text-[var(--color-negative)]" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-[var(--color-positive)]" />
                          )}
                          <span
                            className={`text-xs font-medium ${periodChange > 0 ? "text-[var(--color-negative)]" : "text-[var(--color-positive)]"}`}
                          >
                            {periodChange > 0 ? "+" : ""}
                            {periodChangePercent}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={Math.min(budget.percent, 100)}
                          className="h-2.5 flex-1"
                          indicatorClassName={
                            isOverBudget
                              ? "bg-red-500"
                              : isNearLimit
                                ? "bg-orange-500"
                                : budget.percent > 75
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                          }
                        />
                        {isOverBudget && (
                          <Badge variant="destructive" className="text-xs px-2 py-0 h-5">
                            Over budget
                          </Badge>
                        )}
                        {isNearLimit && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-0 h-5 bg-orange-500/10 text-orange-700 dark:text-orange-400 border-0"
                          >
                            At limit
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{budget.percent.toFixed(0)}% spent</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget Settings</DialogTitle>
            <DialogDescription>Configure advanced settings for {editingBudget?.category} budget</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="budget-amount">Budget Amount</Label>
              <Input
                id="budget-amount"
                type="number"
                defaultValue={editingBudget?.budget}
                placeholder="Enter budget amount"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="rollover">Enable Rollover</Label>
                <p className="text-sm text-muted-foreground">Carry unused budget to next month</p>
              </div>
              <Switch id="rollover" checked={rolloverEnabled} onCheckedChange={setRolloverEnabled} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warning">Warning Threshold (%)</Label>
              <Input
                id="warning"
                type="number"
                value={warningThreshold}
                onChange={(e) => setWarningThreshold(e.target.value)}
                placeholder="90"
              />
              <p className="text-xs text-muted-foreground">Get notified when spending reaches this percentage</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAdvanced}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
