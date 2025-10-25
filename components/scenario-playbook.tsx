"use client"

import { useMemo } from "react"
import { BarChart3 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getScenarioPlaybook } from "@/lib/mock"
import type { ScenarioPlaybookDefinition, ScenarioMetric } from "@/types/automation"

interface ScenarioPlaybookProps {
  surface: ScenarioPlaybookDefinition["surface"]
}

export function ScenarioPlaybook({ surface }: ScenarioPlaybookProps) {
  const playbook = getScenarioPlaybook(surface)

  const caseLookup = useMemo(() => {
    if (!playbook) return new Map<string, ScenarioPlaybookDefinition["cases"][number]>()
    return new Map(playbook.cases.map((scenarioCase) => [scenarioCase.id, scenarioCase]))
  }, [playbook])

  if (!playbook) {
    return null
  }

  return (
    <Card
      id={`playbook-${playbook.id}`}
      className="card-standard border-border/50 backdrop-blur"
    >
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>{playbook.title}</CardTitle>
            <CardDescription className="mt-1 text-sm text-muted-foreground">
              {playbook.description}
            </CardDescription>
          </div>
        </div>
        {playbook.insightPrompt && (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            {playbook.insightPrompt}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {playbook.cases.map((scenarioCase) => (
            <div
              key={scenarioCase.id}
              className="rounded-xl border border-border/40 bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{scenarioCase.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{scenarioCase.description}</p>
                </div>
                {scenarioCase.risk && (
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {scenarioCase.risk}
                  </Badge>
                )}
              </div>
              {scenarioCase.highlight && (
                <p className="mt-3 text-xs font-medium text-primary">{scenarioCase.highlight}</p>
              )}
              {scenarioCase.scheduleHint && (
                <p className="mt-2 text-[11px] text-muted-foreground">{scenarioCase.scheduleHint}</p>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-5">
          {playbook.metrics.map((metric) => (
            <MetricComparison key={metric.id} metric={metric} caseLookup={caseLookup} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function MetricComparison({
  metric,
  caseLookup,
}: {
  metric: ScenarioMetric
  caseLookup: Map<string, ScenarioPlaybookDefinition["cases"][number]>
}) {
  const maxValue = Math.max(metric.baseline, ...metric.cases.map((scenarioCase) => scenarioCase.value)) || 1

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">{metric.label}</p>
        <Badge variant="outline" className="text-[11px] text-muted-foreground">
          Baseline {formatMetric(metric, metric.baseline)}
        </Badge>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {metric.cases.map((scenarioCase) => {
          const definition = caseLookup.get(scenarioCase.caseId)
          const percentage = Math.min(100, Math.round((scenarioCase.value / maxValue) * 100))
          return (
            <div key={scenarioCase.caseId} className="rounded-lg border border-border/30 bg-background/60 p-3">
              <p className="text-xs font-medium text-muted-foreground">
                {definition?.title ?? scenarioCase.caseId}
              </p>
              <div className="mt-2 h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${percentage}%` }}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {formatMetric(metric, scenarioCase.value)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function formatMetric(metric: ScenarioMetric, value: number) {
  switch (metric.unit) {
    case "currency":
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value)
    case "percent":
      return `${value.toFixed(1)}%`
    case "number":
      return value.toFixed(0)
    case "score":
    default:
      return value.toFixed(0)
  }
}
