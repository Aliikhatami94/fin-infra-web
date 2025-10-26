"use client"

import { useEffect, useMemo, useState, type ComponentType } from "react"
import { Sparkles, ShieldAlert, ShieldCheck, ShieldQuestion, Undo2 } from "lucide-react"
import { AIChatSidebar, type AIChatMessage } from "@/components/ai-chat-sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

import { getAutomationSuggestionById, getAutomationSuggestions, upsertAutomationHistory } from "@/lib/mock"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/format"
import { useSecureStorage } from "@/hooks/use-secure-storage"
import type { AutomationHistoryEntry, AutomationSuggestion } from "@/types/automation"
import { trackAutomationDecision, trackAutomationUndo } from "@/lib/analytics/events"
import { useConnectivity } from "@/components/connectivity-provider"
import { FeedbackPrompt } from "@/components/feedback-prompt"

const riskStyles: Record<AutomationSuggestion["risk"], string> = {
  low: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300",
  medium: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  high: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
}

const riskIcons: Record<AutomationSuggestion["risk"], ComponentType<{ className?: string }>> = {
  low: ShieldCheck,
  medium: ShieldQuestion,
  high: ShieldAlert,
}

const scheduleLabels: Record<string, string> = {
  "next-window": "Next smart window (48h)",
  "end-of-week": "End of week review",
  "custom-review": "Custom reminder",
}

const declineReasons = [
  "Already completed manually",
  "Doesn't align with my goals",
  "Need to review with an advisor",
  "Concerned about risk",
]

interface AutomationCopilotDrawerProps {
  isOpen: boolean
  onClose: () => void
  surface: AutomationSuggestion["surface"]
  initialSuggestionId?: string | null
}

export function AutomationCopilotDrawer({
  isOpen,
  onClose,
  surface,
  initialSuggestionId,
}: AutomationCopilotDrawerProps) {
  const storage = useSecureStorage({ namespace: "automation-copilot" })
  const { isOffline } = useConnectivity()
  const suggestions = useMemo(() => getAutomationSuggestions(surface), [surface])
  const [selectedId, setSelectedId] = useState<string | undefined>(initialSuggestionId ?? suggestions[0]?.id)
  const selectedSuggestion = useMemo(
    () => suggestions.find((suggestion) => suggestion.id === selectedId) ?? suggestions[0],
    [selectedId, suggestions],
  )
  const [history, setHistory] = useState<AutomationHistoryEntry[]>([])
  const [reviewOpen, setReviewOpen] = useState(false)
  const [declineOpen, setDeclineOpen] = useState(false)
  const [scheduleChoice, setScheduleChoice] = useState<keyof typeof scheduleLabels>("next-window")
  const [declineReason, setDeclineReason] = useState<string>(declineReasons[0])
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackContext, setFeedbackContext] = useState<string | null>(null)
  const [feedbackRating, setFeedbackRating] = useState<number | undefined>(undefined)
  const handleFeedbackOpenChange = (open: boolean) => {
    setFeedbackOpen(open)
    if (!open) {
      setFeedbackContext(null)
      setFeedbackRating(undefined)
    }
  }

  const openFeedbackPrompt = (context: string, rating?: number) => {
    setFeedbackContext(context)
    setFeedbackRating(rating)
    setFeedbackOpen(true)
  }

  useEffect(() => {
    if (suggestions.length === 0) {
      setSelectedId(undefined)
      return
    }

    if (initialSuggestionId && initialSuggestionId !== selectedId) {
      setSelectedId(initialSuggestionId)
      return
    }

    if (!selectedId) {
      setSelectedId(suggestions[0]?.id)
    }
  }, [initialSuggestionId, selectedId, suggestions])

  useEffect(() => {
    if (!storage) return

    let mounted = true
    storage
      .getItem("history")
      .then((value) => {
        if (!mounted || !value) return
        try {
          const parsed = JSON.parse(value) as AutomationHistoryEntry[]
          setHistory(parsed)
        } catch {
          // ignore parse errors in dev mocks
        }
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [storage])

  useEffect(() => {
    if (!storage) return
    storage.setItem("history", JSON.stringify(history)).catch(() => {})
  }, [history, storage])

  const initialMessages: AIChatMessage[] = useMemo(() => {
    if (!selectedSuggestion) {
      return []
    }

    return [
      {
        id: `${selectedSuggestion.id}-intro`,
        role: "assistant",
        content: `Here's how \"${selectedSuggestion.title}\" impacts your ${selectedSuggestion.category} metrics. Ask for clarifications or adjustments anytime.`,
        timestamp: new Date(),
      },
    ]
  }, [selectedSuggestion])

  const responseGenerator = (query: string) => {
    if (!selectedSuggestion) {
      return "Let me know which automation you'd like to explore and I'll pull MoneyGraph context for you."
    }

    const normalized = query.toLowerCase()
    const firstMetric = selectedSuggestion.metrics[0]
    if (normalized.includes("risk") || normalized.includes("confidence")) {
      return `This automation carries a ${selectedSuggestion.risk} implementation risk with ${Math.round(selectedSuggestion.confidence * 100)}% confidence based on MoneyGraph's sensitivity analysis.`
    }

    if (normalized.includes("timeline") || normalized.includes("schedule")) {
      return `Recommended timing: ${selectedSuggestion.recommendedSchedule}. You can also choose a different schedule in the confirmation dialog.`
    }

    if (firstMetric) {
      return `${firstMetric.label} moves from ${formatMetricValue(firstMetric, firstMetric.before)} to ${formatMetricValue(firstMetric, firstMetric.after)} after execution.`
    }

    return `I'll keep monitoring ${selectedSuggestion.title}. Let me know if you'd like a different automation.`
  }

  const beforeMessagesSlot = selectedSuggestion ? (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
        <span>Copilot suggestions</span>
        <Badge variant="outline" className="text-[10px] uppercase">
          MoneyGraph aware
        </Badge>
      </div>
      <div className="space-y-2">
        {suggestions.map((suggestion) => {
          const isActive = suggestion.id === selectedSuggestion.id
          const RiskIcon = riskIcons[suggestion.risk]
          return (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => setSelectedId(suggestion.id)}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-left transition-colors",
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-border/40 bg-card/80 hover:border-border/80",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{suggestion.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
                </div>
                <Badge className={cn("flex items-center gap-1", riskStyles[suggestion.risk])}>
                  <RiskIcon className="h-3.5 w-3.5" />
                  <span className="capitalize">{suggestion.risk}</span>
                </Badge>
              </div>
            </button>
          )
        })}
      </div>

      <Card className="card-standard border-primary/20">
        <CardContent className="space-y-4 p-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">{selectedSuggestion.title}</p>
            <p className="text-xs text-muted-foreground">{selectedSuggestion.diffNarrative.summary}</p>
          </div>

          <div className="grid gap-3">
            {selectedSuggestion.metrics.map((metric) => (
              <div
                key={metric.id}
                className="flex items-center justify-between gap-4 rounded-md border border-border/40 bg-card px-3 py-2"
              >
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
                  {metric.rationale && <p className="text-[11px] text-muted-foreground/80">{metric.rationale}</p>}
                </div>
                <div className="text-right text-sm font-semibold text-foreground">
                  <span className="block text-muted-foreground text-xs">{formatMetricValue(metric, metric.before)}</span>
                  <span className="block text-primary">{formatMetricValue(metric, metric.after)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedSuggestion.moneyGraphReferences.map((reference) => (
              <Badge key={reference} variant="outline" className="text-[10px]">
                {reference.replace(/:/g, " • ")}
              </Badge>
            ))}
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Recommended schedule</p>
            <p>{selectedSuggestion.recommendedSchedule}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setReviewOpen(true)}>
              Review & confirm
            </Button>
            <Button variant="outline" size="sm" onClick={() => setDeclineOpen(true)}>
              Decline
            </Button>
            {selectedSuggestion.relatedScenarioId && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <a href={`#playbook-${selectedSuggestion.relatedScenarioId}`}>View playbook</a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  ) : null

  const afterMessagesSlot = (
    <div className="space-y-3 pt-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Automation history</p>
        <Badge variant="outline" className="text-[10px]">
          Logged locally
        </Badge>
      </div>
      {history.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No automations logged yet. Confirm an automation to see MoneyGraph traceability here.
        </p>
      ) : (
        <ul className="space-y-3">
          {history.map((entry) => {
            const suggestion = getAutomationSuggestionById(entry.suggestionId)
            return (
              <li
                key={entry.id}
                className="rounded-lg border border-border/40 bg-muted/40 p-3 text-xs text-muted-foreground"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{entry.label}</p>
                    <p className="text-[11px]">
                      {new Date(entry.executedAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {entry.scheduledFor && <p className="mt-1">Scheduled: {entry.scheduledFor}</p>}
                    {entry.reason && <p className="mt-1">Reason: {entry.reason}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className="capitalize">
                      {entry.status}
                    </Badge>
                    {entry.status !== "undone" && entry.decision === "accepted" && suggestion && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleUndo(entry, suggestion)}
                        aria-label={`Undo ${entry.label}`}
                      >
                        <Undo2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )

  const handleConfirm = () => {
    if (!selectedSuggestion) return
    if (isOffline) {
      toast.error("Automations paused while offline", {
        description: "Reconnect to confirm or schedule suggestions.",
      })
      return
    }

    const scheduledFor = scheduleLabels[scheduleChoice]
    const entry: AutomationHistoryEntry = {
      id: `${selectedSuggestion.id}:${Date.now()}`,
      suggestionId: selectedSuggestion.id,
      label: selectedSuggestion.title,
      executedAt: new Date().toISOString(),
      scheduledFor,
      status: "scheduled",
      decision: "accepted",
    }

    setHistory((prev) => upsertAutomationHistory(prev, entry))
    trackAutomationDecision({ suggestion: selectedSuggestion, decision: "accepted", scheduledFor })
    toast.success("Automation scheduled", {
      description: `${selectedSuggestion.title} queued for ${scheduledFor}.`,
      action: {
        label: "Undo",
        onClick: () => handleUndo(entry, selectedSuggestion),
      },
    })
    openFeedbackPrompt(selectedSuggestion.title, 5)
    setReviewOpen(false)
  }

  const handleDeclineSubmit = () => {
    if (!selectedSuggestion) return

    const entry: AutomationHistoryEntry = {
      id: `${selectedSuggestion.id}:${Date.now()}`,
      suggestionId: selectedSuggestion.id,
      label: selectedSuggestion.title,
      executedAt: new Date().toISOString(),
      status: "declined",
      decision: "declined",
      reason: declineReason,
    }

    setHistory((prev) => upsertAutomationHistory(prev, entry))
    trackAutomationDecision({
      suggestion: selectedSuggestion,
      decision: "declined",
      reason: declineReason,
    })
    toast("Automation declined", {
      description: declineReason,
    })
    openFeedbackPrompt(selectedSuggestion.title, 2)
    setDeclineOpen(false)
  }

  const handleUndo = (entry: AutomationHistoryEntry, suggestion: AutomationSuggestion) => {
    const updated: AutomationHistoryEntry = {
      ...entry,
      status: "undone",
      executedAt: new Date().toISOString(),
    }
    setHistory((prev) => upsertAutomationHistory(prev, updated))
    trackAutomationUndo({ suggestion })
    toast.success("Automation undone", {
      description: `${suggestion.title} removed from schedule.`,
    })
  }

  return (
    <>
      <AIChatSidebar
        isOpen={isOpen}
        onClose={onClose}
        title="Automation Copilot"
        icon={Sparkles}
        initialMessages={initialMessages}
        promptPlaceholder="Ask how this automation impacts your MoneyGraph nodes..."
        responseGenerator={responseGenerator}
        beforeMessagesSlot={beforeMessagesSlot}
        afterMessagesSlot={afterMessagesSlot}
      />

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm automation</DialogTitle>
            <DialogDescription>
              {selectedSuggestion?.diffNarrative.headline ?? "Review the projected impact before confirming."}
              {isOffline ? (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-200">
                  You are offline. Scheduling will resume once you reconnect.
                </p>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          {selectedSuggestion && (
            <div className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{selectedSuggestion.diffNarrative.summary}</p>
                {selectedSuggestion.diffNarrative.tradeOffs && (
                  <ul className="list-disc pl-5 text-xs">
                    {selectedSuggestion.diffNarrative.tradeOffs.map((tradeOff) => (
                      <li key={tradeOff}>{tradeOff}</li>
                    ))}
                  </ul>
                )}
              </div>

              <ScrollArea className="h-32 rounded-md border border-border/40">
                <div className="space-y-2 p-3">
                  {selectedSuggestion.metrics.map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className="font-medium text-foreground">
                        {formatMetricValue(metric, metric.before)} → {formatMetricValue(metric, metric.after)}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase">Schedule</p>
                <Select value={scheduleChoice} onValueChange={(value) => setScheduleChoice(value as keyof typeof scheduleLabels)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(scheduleLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setReviewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isOffline} aria-disabled={isOffline} data-requires-online>
              Confirm automation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={declineOpen} onOpenChange={setDeclineOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Decline automation</DialogTitle>
            <DialogDescription>
              Help us improve Copilot suggestions by sharing why this automation is not a fit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Select a reason</p>
            <Select value={declineReason} onValueChange={setDeclineReason}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a reason" />
              </SelectTrigger>
              <SelectContent>
                {declineReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeclineOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeclineSubmit}>
              Decline automation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FeedbackPrompt
        surface="automation"
        open={feedbackOpen}
        onOpenChange={handleFeedbackOpenChange}
        context={feedbackContext ?? "Copilot"}
        defaultRating={feedbackRating}
      />
    </>
  )
}

function formatMetricValue(metric: AutomationSuggestion["metrics"][number], value: number) {
  switch (metric.unit) {
    case "currency":
      return formatCurrency(value)
    case "percent":
      return `${value.toFixed(metric.precision ?? 1)}%`
    case "number":
      return value.toFixed(metric.precision ?? 0)
    case "score":
    default:
      return value.toFixed(metric.precision ?? 0)
  }
}
