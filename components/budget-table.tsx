"use client"

import { FormEvent, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SwitchField } from "@/components/ui/switch"
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
  Search,
  Settings,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Virtuoso } from "react-virtuoso"
import { Slider } from "@/components/ui/slider"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [quickEditOpen, setQuickEditOpen] = useState(false)
  const [quickEditBudget, setQuickEditBudget] = useState<Budget | null>(null)
  const [quickEditValue, setQuickEditValue] = useState("")
  const [quickEditError, setQuickEditError] = useState<string | null>(null)
  const [rolloverEnabled, setRolloverEnabled] = useState(false)
  const [warningThreshold, setWarningThreshold] = useState("90")
  const [showSuggested, _setShowSuggested] = useState(true)
  const [comparisonPeriod, setComparisonPeriod] = useState<"lastMonth" | "lastYear">("lastMonth")
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

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

  const handleQuickEdit = (budget: Budget) => {
    setQuickEditBudget(budget)
    setQuickEditValue(budget.budget.toString())
    setQuickEditError(null)
    setQuickEditOpen(true)
  }

  const quickEditNumericValue = Number.parseFloat(quickEditValue) || 0
  const sliderMax = useMemo(() => {
    if (!quickEditBudget) return 1000
    const base = Math.max(quickEditBudget.actual, quickEditBudget.budget, 500)
    return Math.ceil(base * 1.5)
  }, [quickEditBudget])
  const sliderValue = quickEditBudget ? Math.min(Math.max(quickEditNumericValue, 0), sliderMax) : 0

  const handleQuickEditChange = (value: string) => {
    setQuickEditValue(value)
    setQuickEditError(null)
  }

  const handleQuickEditSliderChange = (values: number[]) => {
    handleQuickEditChange(values[0]?.toString() ?? "")
  }

  const handleQuickEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!quickEditBudget) return

    const parsed = Number.parseFloat(quickEditValue)
    if (Number.isNaN(parsed) || parsed <= 0) {
      setQuickEditError("Enter a positive budget amount")
      return
    }

    setBudgets((previous) =>
      previous.map((item) =>
        item.category === quickEditBudget.category
          ? {
              ...item,
              budget: parsed,
              variance: parsed - item.actual,
              percent: Number.isFinite(item.actual / parsed) ? (item.actual / parsed) * 100 : 0,
            }
          : item,
      ),
    )

    setQuickEditOpen(false)
    setQuickEditBudget(null)
  }

  const handleAdvancedEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setEditDialogOpen(true)
    setRolloverEnabled(budget.rolloverEnabled)
    setWarningThreshold(Math.round(budget.percent).toString())
  }

  const handleSaveAdvanced = () => {
    if (editingBudget) {
      setBudgets((previous) =>
        previous.map((item) =>
          item.category === editingBudget.category ? { ...item, rolloverEnabled } : item,
        ),
      )
      setEditingBudget({ ...editingBudget, rolloverEnabled })
    }
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
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg font-semibold">Budget by Category</CardTitle>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-end">
                {!isCollapsed && (
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-9 w-[200px]"
                  />
                </div>
                )}
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="gap-1.5 w-fit"
            >
              {isCollapsed ? (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Expand All
                </>
              ) : (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Collapse
                </>
              )}
            </Button>
          </div>
          {!isCollapsed && (
            <div
              className="grid grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))] gap-3 px-4 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
            >
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
              <button className="hidden items-center hover:text-foreground lg:flex">
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
          )}
        </CardHeader>
        <CardContent className="pb-4">
          {isCollapsed ? (
            <div className="space-y-2">
              {filteredBudgets.map((budget) => {
                const isOverBudget = budget.percent > 100
                const isNearLimit = budget.percent > 90 && budget.percent <= 100
                const isExpanded = expandedCategory === budget.category

                return (
                  <div key={budget.category} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : budget.category)}
                      className="w-full p-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-medium text-sm">{budget.category}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold tabular-nums">
                              ${budget.actual.toLocaleString()} / ${budget.budget.toLocaleString()}
                            </span>
                            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Progress
                            value={Math.min(budget.percent, 100)}
                            className="h-1.5"
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
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{budget.percent.toFixed(0)}% spent</span>
                            {isOverBudget && (
                              <Badge variant="destructive" className="text-xs px-1.5 py-0 h-4">
                                Over
                              </Badge>
                            )}
                            {isNearLimit && (
                              <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4 bg-orange-500/10 text-orange-700 dark:text-orange-400 border-0">
                                At limit
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="p-3 pt-0 border-t bg-muted/20 space-y-2">
                        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                          <div>
                            <div className="text-xs text-muted-foreground mb-0.5">Budget</div>
                            <div className="font-semibold">${budget.budget.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-0.5">Actual</div>
                            <div className="font-semibold">${budget.actual.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-0.5">Variance</div>
                            <div className={`font-semibold ${budget.variance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                              ${Math.abs(budget.variance).toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-0.5">Suggested</div>
                            <div className="font-semibold text-yellow-600 dark:text-yellow-400">${budget.suggestedBudget.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleQuickEdit(budget)
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAdvancedEdit(budget)
                            }}
                          >
                            <Settings className="h-3.5 w-3.5 mr-1.5" />
                            Settings
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="space-y-4">
            <div className="hidden md:block max-h-[640px]">
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
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium text-foreground truncate">{budget.category}</span>
                          {budget.rolloverEnabled && (
                            <Badge variant="secondary" className="text-xs px-2 py-0 h-5 flex-shrink-0">
                              Rollover
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleQuickEdit(budget)}
                            aria-label={`Quick edit ${budget.category} budget`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleAdvancedEdit(budget)}
                            aria-label={`Open advanced settings for ${budget.category}`}
                          >
                            <Settings className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div
                        className="grid grid-cols-3 lg:grid-cols-4 items-center gap-3"
                      >
                        <div className="min-w-0 text-right">
                          <div className="text-sm font-medium tabular-nums text-foreground">
                            ${budget.budget.toLocaleString()}
                          </div>
                          {showSuggested && (
                            <div className="mt-1 text-xs text-muted-foreground lg:hidden">
                              <span className="font-medium">Suggested:</span> ${budget.suggestedBudget.toLocaleString()}
                            </div>
                          )}
                        </div>
                        {showSuggested && (
                          <div className="hidden min-w-0 justify-end lg:flex">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    className="inline-flex items-center justify-end gap-1 rounded-md px-1.5 py-1 hover:bg-muted/40 transition-colors cursor-help text-sm font-medium tabular-nums text-muted-foreground"
                                    aria-label={`Suggested budget: $${budget.suggestedBudget.toLocaleString()}, based on 6-month average`}
                                  >
                                    <Lightbulb className="h-3 w-3 text-yellow-500" />
                                    ${budget.suggestedBudget.toLocaleString()}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs font-semibold mb-1">Based on 6-month average</p>
                                  <p className="text-xs text-muted-foreground">Historical spending pattern</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                        <div className="min-w-0 text-right">
                          <div className="text-sm font-medium tabular-nums text-foreground">
                            ${budget.actual.toLocaleString()}
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className="inline-flex items-center justify-end gap-1 rounded-md px-1.5 py-1 mt-0.5 hover:bg-muted/40 transition-colors cursor-help"
                                  aria-label={`${periodChange > 0 ? '+' : ''}${periodChangePercent}% vs. ${comparisonPeriod === 'lastMonth' ? 'last month' : 'last year'}`}
                                >
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
                                </button>
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
                        <div className="min-w-0 text-right">
                          <div className="flex items-center justify-end gap-1">
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
            <div className="md:hidden space-y-3 max-h-[640px] overflow-y-auto pr-1 -mr-1 scrollbar-thin">
              {filteredBudgets.map((budget, index) => {
                const previousActual = comparisonPeriod === "lastMonth" ? budget.lastMonthActual : budget.lastYearActual
                const periodChange = budget.actual - previousActual
                const periodChangePercent = ((periodChange / previousActual) * 100).toFixed(0)
                const isOverBudget = budget.percent > 100
                const isNearLimit = budget.percent > 90 && budget.percent <= 100

                return (
                  <div key={index} className="card-standard card-lift p-4 space-y-3 overflow-hidden">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="font-medium text-foreground truncate block">{budget.category}</span>
                        {budget.rolloverEnabled && (
                          <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                            Rollover
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleQuickEdit(budget)}
                          aria-label={`Quick edit ${budget.category} budget`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleAdvancedEdit(budget)}
                          aria-label={`Open advanced settings for ${budget.category}`}
                        >
                          <Settings className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">Budget</p>
                          <p className="text-base font-semibold tabular-nums">${budget.budget.toLocaleString()}</p>
                        </div>
                        <div className="min-w-0 text-right">
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
                      {showSuggested && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/5 dark:bg-yellow-500/10 rounded-md border border-yellow-500/20">
                          <Lightbulb className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">Suggested budget</p>
                          </div>
                          <p className="text-sm font-semibold tabular-nums text-yellow-700 dark:text-yellow-400 flex-shrink-0">
                            ${budget.suggestedBudget.toLocaleString()}
                          </p>
                        </div>
                      )}
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
          )}
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
            <SwitchField
              id="rollover"
              label="Enable rollover"
              description="Carry unused budget to the next month."
              checked={rolloverEnabled}
              onCheckedChange={setRolloverEnabled}
            />
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

      <Dialog
        open={quickEditOpen}
        onOpenChange={(open) => {
          setQuickEditOpen(open)
          if (!open) {
            setQuickEditBudget(null)
            setQuickEditError(null)
            setQuickEditValue("")
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick edit budget</DialogTitle>
            <DialogDescription>
              Adjust the monthly allocation for {quickEditBudget?.category}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-6" onSubmit={handleQuickEditSubmit}>
            <div className="space-y-2">
              <Label htmlFor="quick-edit-amount">Budget amount</Label>
              <Input
                id="quick-edit-amount"
                type="number"
                inputMode="decimal"
                value={quickEditValue}
                onChange={(event) => handleQuickEditChange(event.target.value)}
                aria-describedby="quick-edit-help"
                aria-invalid={Boolean(quickEditError)}
                autoFocus
              />
              <p id="quick-edit-help" className="text-xs text-muted-foreground">
                Current actual spend: ${quickEditBudget?.actual.toLocaleString() ?? "0"}
              </p>
              {quickEditError && <p className="text-xs text-destructive">{quickEditError}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick-edit-slider" className="flex items-center justify-between text-xs">
                Fine-tune with slider
                <span className="font-medium text-foreground">${quickEditNumericValue.toLocaleString()}</span>
              </Label>
              <Slider
                id="quick-edit-slider"
                value={[sliderValue]}
                min={0}
                max={sliderMax}
                step={25}
                onValueChange={handleQuickEditSliderChange}
                aria-label={`Adjust ${quickEditBudget?.category ?? "budget"} amount`}
              />
              <p className="text-[11px] text-muted-foreground">
                Drag to match your plan faster — slider caps at 150% of actual spend.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setQuickEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save budget</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
