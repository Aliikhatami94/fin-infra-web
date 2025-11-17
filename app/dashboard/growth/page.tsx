"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  activationCohorts,
  retentionCohorts,
  automationAdoption,
  onboardingDropoff,
  type ActivationCohortPoint,
  type AutomationAdoptionPoint,
} from "@/lib/mock"
import { useFeatureFlag } from "@/lib/analytics/experiments"
import { trackCohortView, trackExperimentExposure, trackShareExport } from "@/lib/analytics/events"
import { showSuccessToast } from "@/lib/toast-utils"
import { toast } from "@/components/ui/sonner"
import { Download, Share2 } from "lucide-react"

const segmentMultipliers: Record<string, number> = {
  all: 1,
  wealth_building: 1.08,
  debt_paydown: 0.94,
  financial_stability: 1.02,
}

const segments: Array<{ value: string; label: string }> = [
  { value: "all", label: "All personas" },
  { value: "wealth_building", label: "Wealth building" },
  { value: "debt_paydown", label: "Debt payoff" },
  { value: "financial_stability", label: "Financial stability" },
]

function applyMultiplier<T extends ActivationCohortPoint | AutomationAdoptionPoint>(
  items: T[],
  multiplier: number,
  fields: Array<keyof T>,
): T[] {
  return items.map((item) => {
    const next: Record<string, unknown> = { ...(item as unknown as Record<string, unknown>) }
    for (const field of fields) {
      const value = item[field]
      if (typeof value === "number") {
        next[field as string] = Math.round(value * multiplier)
      }
    }
    return next as T
  })
}

export default function GrowthPage() {
  const { enabled } = useFeatureFlag("growthDashboards", { defaultEnabled: false })
  const [segment, setSegment] = useState<string>("all")

  useEffect(() => {
    if (enabled) {
      trackExperimentExposure("growthDashboards")
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    trackCohortView({ metric: "activation", cohort: segment, segment })
    trackCohortView({ metric: "retention", cohort: segment, segment })
    trackCohortView({ metric: "automation", cohort: segment, segment })
  }, [enabled, segment])

  const multiplier = segmentMultipliers[segment] ?? 1

  const adjustedActivation = useMemo(
    () =>
      applyMultiplier<ActivationCohortPoint>(
        activationCohorts,
        multiplier,
        ["started", "completed", "linked", "automations"] as Array<keyof ActivationCohortPoint>,
      ),
    [multiplier],
  )
  const adjustedAutomation = useMemo(
    () =>
      applyMultiplier<AutomationAdoptionPoint>(
        automationAdoption,
        multiplier,
        ["suggestionsViewed", "suggestionsAccepted", "automationsScheduled"] as Array<
          keyof AutomationAdoptionPoint
        >,
      ),
    [multiplier],
  )

  const activationConversion = useMemo(() => {
    if (adjustedActivation.length === 0) return 0
    const latest = adjustedActivation[adjustedActivation.length - 1]
    return Math.round((latest.completed / latest.started) * 100)
  }, [adjustedActivation])

  if (!enabled) {
    return (
      <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-4 text-center">
        <Badge variant="secondary">Experiment gated</Badge>
        <h1 className="text-2xl font-semibold text-foreground">Measurement workspace in limited rollout</h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          The growth dashboards are currently restricted to experiment cohorts. Ask the Fin-Infra team to enroll your workspace.
        </p>
      </div>
    )
  }

  const handleExport = (format: "pdf" | "csv") => {
    trackShareExport({ surface: "growth", format, channel: "internal", items: adjustedActivation.length })
    showSuccessToast(`Preparing ${format.toUpperCase()} export`, {
      description: "A download link will appear in your notifications once generated.",
    })
  }

  const handleShare = (channel: string) => {
    trackShareExport({ surface: "growth", format: "pdf", channel, items: 3 })
    toast("Shared dashboard snapshot", {
      description: `Attribution tagged for ${channel}.`,
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Measurement & Growth</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track activation, retention, and automation adoption to inform rollout decisions.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Select value={segment} onValueChange={setSegment}>
            <SelectTrigger className="w-[220px]">
              <SelectValue aria-label="Persona segment" placeholder="Select segment" />
            </SelectTrigger>
            <SelectContent>
              {segments.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
            <Button variant="default" size="sm" className="gap-2" onClick={() => handleShare("advisor")}>
              <Share2 className="h-4 w-4" /> Share advisor digest
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="card-standard col-span-1 xl:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">Activation funnel</CardTitle>
            <CardDescription>Monthly onboarding throughput and automation-ready members.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Latest month</p>
                <p className="text-2xl font-semibold text-foreground">{adjustedActivation.at(-1)?.started.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Members starting onboarding</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Completed onboarding</p>
                <p className="text-2xl font-semibold text-foreground">{adjustedActivation.at(-1)?.completed.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{activationConversion}% conversion</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Automations enabled</p>
                <p className="text-2xl font-semibold text-foreground">{adjustedActivation.at(-1)?.automations.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Members opted into Copilot</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={adjustedActivation}>
                <CartesianGrid strokeDasharray="3 3" className="text-border/40" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: "hsl(var(--foreground))" }}
                  tickLine={true} 
                  axisLine={true}
                  tickMargin={8}
                />
                <YAxis 
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: "hsl(var(--foreground))" }}
                  tickLine={true} 
                  axisLine={true}
                  tickMargin={8}
                />
                <Tooltip cursor={{ fill: "hsl(var(--muted))" }} />
                <Bar dataKey="started" fill="hsl(var(--chart-blue-500))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="hsl(var(--chart-green-500))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="linked" fill="hsl(var(--chart-sky-500))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-standard">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">Retention by cohort</CardTitle>
            <CardDescription>Rolling retention across onboarding cohorts.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={retentionCohorts}>
                <CartesianGrid strokeDasharray="3 3" className="text-border/40" />
                <XAxis 
                  dataKey="cohort" 
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: "hsl(var(--foreground))" }}
                  tickLine={true} 
                  axisLine={true}
                  tickMargin={8}
                />
                <YAxis 
                  unit="%" 
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: "hsl(var(--foreground))" }}
                  tickLine={true} 
                  axisLine={true}
                  tickMargin={8}
                  domain={[60, 100]} 
                />
                <Tooltip cursor={{ stroke: "hsl(var(--primary))" }} />
                <Line type="monotone" dataKey="month1" stroke="hsl(var(--chart-blue-500))" strokeWidth={2} dot />
                <Line type="monotone" dataKey="month3" stroke="hsl(var(--chart-green-500))" strokeWidth={2} dot />
                <Line type="monotone" dataKey="month6" stroke="hsl(var(--chart-purple-500))" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
            <p className="mt-3 text-xs text-muted-foreground">
              Month 6 for the current quarter is projected from MoneyGraph engagement trends.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="card-standard lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">Automation adoption</CardTitle>
            <CardDescription>Weekly Copilot engagement and feedback response rate.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={adjustedAutomation}>
                <defs>
                  <linearGradient id="automationAccepted" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-green-500))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--chart-green-500))" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="automationScheduled" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-blue-500))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--chart-blue-500))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="text-border/40" />
                <XAxis 
                  dataKey="week" 
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: "hsl(var(--foreground))" }}
                  tickLine={true} 
                  axisLine={true}
                  tickMargin={8}
                />
                <YAxis 
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: "hsl(var(--foreground))" }}
                  tickLine={true} 
                  axisLine={true}
                  tickMargin={8}
                />
                <Tooltip cursor={{ stroke: "hsl(var(--primary))" }} />
                <Area
                  type="monotone"
                  dataKey="suggestionsAccepted"
                  stroke="hsl(var(--chart-green-500))"
                  strokeWidth={2}
                  fill="url(#automationAccepted)"
                />
                <Area
                  type="monotone"
                  dataKey="automationsScheduled"
                  stroke="hsl(var(--chart-blue-500))"
                  strokeWidth={2}
                  fill="url(#automationScheduled)"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border/40 bg-muted/20 p-4">
                <p className="text-xs uppercase text-muted-foreground">Suggestions viewed</p>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  {adjustedAutomation.at(-1)?.suggestionsViewed.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Weekly rolling average</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-muted/20 p-4">
                <p className="text-xs uppercase text-muted-foreground">Feedback response rate</p>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  {adjustedAutomation.at(-1)?.feedbackResponseRate ?? 0}%
                </p>
                <p className="text-xs text-muted-foreground">Submitted after Copilot actions</p>
              </div>
              <div className="rounded-lg border border-border/40 bg-muted/20 p-4">
                <p className="text-xs uppercase text-muted-foreground">Automations scheduled</p>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  {adjustedAutomation.at(-1)?.automationsScheduled.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Includes savings sweeps & tax harvest</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-standard">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">Onboarding drop-off</CardTitle>
            <CardDescription>Instrumented via step events from the guided flow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {onboardingDropoff.map((step) => {
                const rate = Math.round((step.completed / step.started) * 100)
                return (
                  <div key={step.stepId}>
                    <div className="flex items-center justify-between text-sm font-medium text-foreground">
                      <span>{step.label}</span>
                      <span>{rate}% completion</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${rate}%` }} aria-hidden="true" />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {step.started.toLocaleString()} started • {step.completed.toLocaleString()} finished
                    </p>
                  </div>
                )
              })}
            </div>
            <Separator />
            <p className="text-xs text-muted-foreground">
              Drop-off instrumentation fires via <code className="rounded bg-muted px-1">trackOnboardingDropoff</code> and feeds
              back into persona-specific onboarding experiments.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
