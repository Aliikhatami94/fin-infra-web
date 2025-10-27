"use client"

import { CalendarDays, Mail, PiggyBank, FileText } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getTaxDeadlines } from "@/lib/mock"

const iconMap = {
  calendar: CalendarDays,
  mail: Mail,
  piggy: PiggyBank,
  file: FileText,
} as const

export function TaxDeadlineTimeline() {
  const deadlines = getTaxDeadlines()

  return (
    <Card
      className="card-standard border-border/40"
      aria-labelledby="tax-deadline-heading"
    >
      <CardHeader>
        <CardTitle id="tax-deadline-heading" className="text-base font-semibold">
          Key tax deadlines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol className="relative border-l border-border/30 pl-4">
          {deadlines.map((deadline) => {
            const Icon = iconMap[deadline.icon as keyof typeof iconMap] ?? CalendarDays
            return (
              <li key={deadline.id} className="mb-6 ml-2 last:mb-2">
                <div className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full border border-primary bg-background">
                  <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{deadline.label}</p>
                    <p className="text-xs text-muted-foreground">{deadline.date}</p>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                          aria-label={deadline.detail}
                        >
                          <Icon className="h-4 w-4 text-primary" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-xs">{deadline.detail}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
