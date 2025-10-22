"use client"

import { useState } from "react"
import { BudgetSummary } from "@/components/budget-summary"
import { BudgetTable } from "@/components/budget-table"
import { BudgetChart } from "@/components/budget-chart"
import { BudgetAIInsights } from "@/components/budget-ai-insights"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CalendarIcon, MoreVertical, FileText, FileSpreadsheet, Plus } from "lucide-react"
import { format } from "date-fns"

export default function BudgetPage() {
  const [date, setDate] = useState<Date>(new Date(2024, 0, 1))

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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">{format(date, "MMMM yyyy")}</span>
                  <span className="sm:hidden">{format(date, "MMM yy")}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <BudgetSummary />

        <BudgetAIInsights />

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
