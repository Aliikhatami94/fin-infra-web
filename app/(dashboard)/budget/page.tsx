"use client"

import { useMemo, useState } from "react"
import { BudgetSummary } from "@/components/budget-summary"
import { BudgetTable } from "@/components/budget-table"
import { BudgetChart } from "@/components/budget-chart"
import { BudgetAIInsights } from "@/components/budget-ai-insights"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  CalendarIcon,
  MoreVertical,
  FileText,
  FileSpreadsheet,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { addMonths, format, getMonth, getYear, setMonth, setYear, startOfMonth } from "date-fns"
import { ErrorBoundary } from "@/components/error-boundary"
import { ScenarioPlaybook } from "@/components/scenario-playbook"
import { trackShareExport } from "@/lib/analytics/events"
import { toast } from "@/components/ui/sonner"
import { useFeatureFlag } from "@/lib/analytics/experiments"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function BudgetPage() {
  const [date, setDate] = useState<Date>(new Date(2024, 0, 1))
  const [monthPickerOpen, setMonthPickerOpen] = useState(false)
  const { enabled: shareExportsEnabled } = useFeatureFlag("shareExports", { defaultEnabled: true })

  const handleExport = (format: "csv" | "pdf") => {
    trackShareExport({ surface: "budget", format, channel: "member", items: 12 })
    toast.success(`Budget ${format.toUpperCase()} export ready`, {
      description: "Attribution recorded so you can follow up when it\'s shared.",
    })
  }

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, monthIndex) => ({
        value: monthIndex.toString(),
        label: format(new Date(2020, monthIndex, 1), "MMMM"),
      })),
    [],
  )

  const derivedYears = useMemo(() => {
    const currentYear = getYear(new Date())
    const range = Array.from({ length: 7 }, (_, offset) => currentYear - 3 + offset)
    const activeYear = getYear(date)
    return Array.from(new Set([...range, activeYear])).sort((a, b) => a - b)
  }, [date])

  const formattedDate = format(date, "MMMM yyyy")
  const currentMonthValue = getMonth(date).toString()
  const currentYearValue = getYear(date).toString()
  const calendarContentId = "budget-month-calendar"

  return (
    <>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              {format(date, "MMMM yyyy")} Budget Snapshot
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Track and manage your monthly spending plan</p>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Select budget month">
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="View previous month"
                onClick={() => setDate((current) => startOfMonth(addMonths(current, -1)))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Label htmlFor="budget-month-select" className="sr-only">
                  Select month
                </Label>
                <Select
                  value={currentMonthValue}
                  onValueChange={(value) =>
                    setDate((current) => startOfMonth(setMonth(current, Number.parseInt(value, 10))))
                  }
                >
                  <SelectTrigger id="budget-month-select" size="sm" aria-label="Select month">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {monthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Label htmlFor="budget-year-select" className="sr-only">
                  Select year
                </Label>
                <Select
                  value={currentYearValue}
                  onValueChange={(value) =>
                    setDate((current) => startOfMonth(setYear(current, Number.parseInt(value, 10))))
                  }
                >
                  <SelectTrigger id="budget-year-select" size="sm" className="w-[110px]" aria-label="Select year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {derivedYears.map((yearOption) => (
                      <SelectItem key={yearOption} value={yearOption.toString()}>
                        {yearOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Popover open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-haspopup="dialog"
                    aria-expanded={monthPickerOpen}
                    aria-controls={calendarContentId}
                    aria-label="Open calendar month picker"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{formattedDate}</span>
                    <span className="sm:hidden">{format(date, "MMM yy")}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    id={calendarContentId}
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        setDate(startOfMonth(selectedDate))
                        setMonthPickerOpen(false)
                      }
                    }}
                    initialFocus
                    aria-label="Select budget month from calendar"
                    captionLayout="dropdown"
                    fromYear={Math.min(...derivedYears)}
                    toYear={Math.max(...derivedYears)}
                  />
                </PopoverContent>
              </Popover>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="View next month"
                onClick={() => setDate((current) => startOfMonth(addMonths(current, 1)))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <span className="sr-only" aria-live="polite" role="status">
                {formattedDate} selected
              </span>
            </div>
            {shareExportsEnabled && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault()
                      handleExport("csv")
                    }}
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault()
                      handleExport("pdf")
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <BudgetSummary />

        <ErrorBoundary feature="Budget insights">
          <BudgetAIInsights />
        </ErrorBoundary>

        <ScenarioPlaybook surface="budget" />

        <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
          <BudgetTable />
          <BudgetChart />
        </div>
      </div>

      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-lg md:hidden z-50 h-14 w-14 p-0"
        aria-label="Add budget category"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </>
  )
}
