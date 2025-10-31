"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronLeft, Loader2, ShieldCheck, Sparkles, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FeedbackPrompt } from "@/components/feedback-prompt"
import { MaskableValue, usePrivacy } from "@/components/privacy-provider"
import { useOnboardingState } from "@/hooks/use-onboarding-state"
import { buildPersonaSummary, fetchMoneyGraph, listLinkableInstitutions, simulateInstitutionLink } from "@/lib/services"
import {
  trackOnboardingDropoff,
  trackOnboardingStepCompleted,
  trackOnboardingStepViewed,
} from "@/lib/analytics/events"

import { toast } from "@/components/ui/sonner"
import type {
  InstitutionConnectionStatus,
  LinkedInstitution,
  OnboardingBudgetingStyle,
  OnboardingGoalFocus,
  OnboardingPersona,
  OnboardingRiskTolerance,
} from "@/types/domain"

const steps = [
  {
    id: "profile",
    title: "Tell us what matters",
    description: "Capture your goals so we can prioritize the right insights.",
  },
  {
    id: "connect",
    title: "Securely connect your institutions",
    description: "Link accounts to populate your Money Graph and personalized KPIs.",
  },
  {
    id: "personalize",
    title: "Preview your Money Graph",
    description: "Review how your accounts, transactions, and goals connect before diving in.",
  },
] as const

type StepId = (typeof steps)[number]["id"]

const goalOptions: { value: OnboardingGoalFocus; title: string; description: string }[] = [
  {
    value: "wealth_building",
    title: "Grow long-term wealth",
    description: "Prioritize investments, net worth, and growth opportunities.",
  },
  {
    value: "debt_paydown",
    title: "Eliminate debt",
    description: "Surface payoff plans, utilization alerts, and snowball insights.",
  },
  {
    value: "financial_stability",
    title: "Protect cash flow",
    description: "Focus on emergency fund health, recurring bills, and runway.",
  },
]

const riskOptions: { value: OnboardingRiskTolerance; title: string; description: string }[] = [
  { value: "conservative", title: "Conservative", description: "Preserve capital and avoid large swings." },
  { value: "balanced", title: "Balanced", description: "Blend growth with stability." },
  { value: "aggressive", title: "Aggressive", description: "Lean into higher-volatility opportunities." },
]

const budgetingOptions: { value: OnboardingBudgetingStyle; title: string; description: string }[] = [
  { value: "hands_on", title: "Hands on", description: "I want to approve every automation and adjustment." },
  { value: "hybrid", title: "Hybrid", description: "Guide me with suggestions and let me automate repeatable wins." },
  { value: "automated", title: "Automated", description: "Set it and nudge me only when risk thresholds change." },
]

const defaultPersona: OnboardingPersona = {
  goalsFocus: "wealth_building",
  riskTolerance: "balanced",
  budgetingStyle: "hybrid",
}

type PersonaOptionProps<T> = {
  value: T
  title: string
  description: string
  active: boolean
  onSelect: (value: T) => void
}

function PersonaOption<T extends string>({ value, title, description, active, onSelect }: PersonaOptionProps<T>) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`rounded-lg border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${active ? "border-primary bg-primary/5" : "border-border hover:border-primary/60"}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {active ? <Badge variant="default">Selected</Badge> : null}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </button>
  )
}

const stepOrder: StepId[] = steps.map((step) => step.id)

function getNextStep(current: StepId): StepId | null {
  const index = stepOrder.indexOf(current)
  if (index === -1) return null
  return stepOrder[index + 1] ?? null
}

export default function OnboardingPage() {
  const router = useRouter()
  const { masked } = usePrivacy()
  const { state, hydrated, markStatus, markStepComplete, upsertInstitution, updatePersona, progress } =
    useOnboardingState()
  const [currentStep, setCurrentStep] = useState<StepId>(steps[0].id)
  const [personaDraft, setPersonaDraft] = useState<OnboardingPersona>(defaultPersona)
  const [graphLoading, setGraphLoading] = useState(false)
  const [graphError, setGraphError] = useState<string | null>(null)
  const [moneyGraphAccounts, setMoneyGraphAccounts] = useState<Array<{ name: string; intentTags: string[]; supportsGoals: number[] }>>([])
  const [personaDetail, setPersonaDetail] = useState(buildPersonaSummary(defaultPersona))
  const [linkModalOpen, setLinkModalOpen] = useState(false)
  const [linkingInstitution, setLinkingInstitution] = useState<string | null>(null)
  const [linkErrors, setLinkErrors] = useState<Record<string, string>>({})
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [skipped, setSkipped] = useState(false)
  const totalSteps = steps.length
  const computeProgress = useCallback((count: number) => Math.min(100, Math.round((count / totalSteps) * 100)), [totalSteps])
  const institutions = useMemo(() => listLinkableInstitutions(), [])

  useEffect(() => {
    if (!hydrated) return
    setPersonaDraft(state.persona ?? defaultPersona)

    const completedCount = state.completedSteps.length
    if (completedCount > 0) {
      const nextIndex = Math.min(completedCount, steps.length - 1)
      setCurrentStep(steps[nextIndex].id)
    }

    if (state.status === "not_started") {
      markStatus("in_progress")
    } else if (state.status === "completed") {
      setCompleted(true)
    } else if (state.status === "skipped") {
      setSkipped(true)
    }
  }, [hydrated, markStatus, state.completedSteps.length, state.persona, state.status])

  const completedSteps = useMemo(() => new Set(state.completedSteps), [state.completedSteps])

  useEffect(() => {
    if (!hydrated) return
    trackOnboardingStepViewed({ stepId: currentStep, progress: computeProgress(completedSteps.size) })
  }, [completedSteps.size, computeProgress, currentStep, hydrated])

  useEffect(() => {
    if (!hydrated) return
    const hasConnected = state.linkedInstitutions.some((institution) => institution.status === "connected")
    if (hasConnected && !completedSteps.has("connect")) {
      markStepComplete("connect")
      trackOnboardingStepCompleted({ stepId: "connect", progress: computeProgress(completedSteps.size + 1) })
    }
  }, [completedSteps, computeProgress, hydrated, markStepComplete, state.linkedInstitutions])

  useEffect(() => {
    if (!feedbackOpen && pendingRedirect) {
      router.push(pendingRedirect)
      setPendingRedirect(null)
    }
  }, [feedbackOpen, pendingRedirect, router])

  useEffect(() => {
    return () => {
      if (!completed && !skipped) {
        trackOnboardingDropoff({
          stepId: currentStep,
          progress: computeProgress(completedSteps.size),
          status: "abandoned",
        })
      }
    }
  }, [completed, completedSteps.size, computeProgress, currentStep, skipped])

  useEffect(() => {
    const summarySource = state.persona ?? personaDraft
    setPersonaDetail(buildPersonaSummary(summarySource))
  }, [personaDraft, state.persona])

  useEffect(() => {
    if (currentStep !== "personalize" || graphLoading || moneyGraphAccounts.length > 0) return
    let cancelled = false
    setGraphLoading(true)
    setGraphError(null)

    fetchMoneyGraph()
      .then((graph) => {
        if (cancelled) return
        setMoneyGraphAccounts(
          graph.accounts.map((account) => ({
            name: account.name,
            intentTags: account.intentTags,
            supportsGoals: account.supportsGoals,
          })),
        )
      })
      .catch(() => {
        if (cancelled) return
        setGraphError("We weren't able to load the Money Graph preview. You can finish onboarding and try again later.")
      })
      .finally(() => {
        if (!cancelled) {
          setGraphLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [currentStep, graphLoading, moneyGraphAccounts.length])

  const connectedInstitutions = [...state.linkedInstitutions].sort((a, b) => a.name.localeCompare(b.name))

  const handlePersonaContinue = () => {
    updatePersona(personaDraft)
    if (!completedSteps.has("profile")) {
      trackOnboardingStepCompleted({ stepId: "profile", progress: computeProgress(completedSteps.size + 1) })
    }
    markStepComplete("profile")
    const next = getNextStep("profile")
    if (next) {
      setCurrentStep(next)
    }
  }

  const handleLinkInstitution = async (institutionId: string) => {
    const definition = institutions.find((item) => item.id === institutionId)
    if (!definition) return

    const optimistic: LinkedInstitution = {
      id: institutionId,
      name: definition.name,
      status: "linking",
      accounts: [],
      lastLinkedAt: new Date().toISOString(),
    }

    setLinkingInstitution(institutionId)
    setLinkErrors((prev) => ({ ...prev, [institutionId]: "" }))
    upsertInstitution(optimistic)

    try {
      const result = await simulateInstitutionLink(definition.id)
      upsertInstitution(result)
      setLinkModalOpen(false)
      toast.success(`${definition.name} connected`, {
        description: "We\u2019ll refresh balances and transactions in the background.",
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We couldn\u2019t connect this institution."
      upsertInstitution({ ...optimistic, status: "error", errorMessage: message })
      setLinkErrors((prev) => ({ ...prev, [institutionId]: message }))
      toast.error(`Couldn\u2019t connect to ${definition.name}`, {
        description: message,
      })
    } finally {
      setLinkingInstitution(null)
    }
  }

  const handleContinueFromConnect = () => {
    const next = getNextStep("connect")
    if (next) {
      setCurrentStep(next)
    }
  }

  const handleFinish = () => {
    if (!completedSteps.has("personalize")) {
      trackOnboardingStepCompleted({ stepId: "personalize", progress: computeProgress(completedSteps.size + 1) })
    }
    markStepComplete("personalize")
    markStatus("completed")
    setCompleted(true)
    setFeedbackOpen(true)
    setPendingRedirect("/dashboard")
  }

  const handleSkip = () => {
    setSkipped(true)
    trackOnboardingDropoff({
      stepId: currentStep,
      progress: computeProgress(completedSteps.size),
      reason: "user_skip",
      status: "skipped",
    })
    markStatus("skipped")
    router.push("/dashboard")
  }

  const currentStepDefinition = steps.find((step) => step.id === currentStep) ?? steps[0]

  const renderPersonaStep = () => (
    <Card className="card-standard">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Shape your experience</CardTitle>
        <CardDescription>
          Your answers tune dashboards, insights, and recommendations from day one.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Primary focus</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {goalOptions.map((option) => (
              <PersonaOption
                key={option.value}
                value={option.value}
                title={option.title}
                description={option.description}
                active={personaDraft.goalsFocus === option.value}
                onSelect={(value) => setPersonaDraft((prev) => ({ ...prev, goalsFocus: value }))}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Risk tolerance</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {riskOptions.map((option) => (
              <PersonaOption
                key={option.value}
                value={option.value}
                title={option.title}
                description={option.description}
                active={personaDraft.riskTolerance === option.value}
                onSelect={(value) => setPersonaDraft((prev) => ({ ...prev, riskTolerance: value }))}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Budgeting style</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {budgetingOptions.map((option) => (
              <PersonaOption
                key={option.value}
                value={option.value}
                title={option.title}
                description={option.description}
                active={personaDraft.budgetingStyle === option.value}
                onSelect={(value) => setPersonaDraft((prev) => ({ ...prev, budgetingStyle: value }))}
              />
            ))}
          </div>
        </section>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">You can adjust these in Settings anytime.</div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleSkip}>
            Skip for now
          </Button>
          <Button onClick={handlePersonaContinue}>Continue</Button>
        </div>
      </CardFooter>
    </Card>
  )

  const renderConnectStep = () => {
    const hasConnected = state.linkedInstitutions.some((institution) => institution.status === "connected")

    return (
      <Card className="card-standard">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Connect institutions</CardTitle>
          <CardDescription>
            We use OAuth-style flows and masked values to keep your credentials protected.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => setLinkModalOpen(true)} disabled={linkingInstitution !== null}>
              {linkingInstitution ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Linking…
                </>
              ) : (
                "Link an institution"
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              Connect at least one account to unlock dashboards populated with live balances.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {connectedInstitutions.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                No institutions linked yet.
              </div>
            ) : (
              connectedInstitutions.map((institution) => (
                <Card key={institution.id} className="border border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-foreground">{institution.name}</CardTitle>
                      <StatusBadge status={institution.status} />
                    </div>
                    {institution.errorMessage ? (
                      <CardDescription className="mt-1 text-sm text-destructive">
                        {institution.errorMessage}
                      </CardDescription>
                    ) : null}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {institution.accounts.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Account details will appear once the link is verified.</p>
                    ) : (
                      institution.accounts.map((account) => (
                        <div
                          key={account.id}
                          className="flex items-center justify-between rounded-md border border-border/60 bg-muted/30 px-3 py-2"
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground">{account.name}</p>
                            <p className="text-xs text-muted-foreground">{account.type}</p>
                          </div>
                          <div className="text-right">
                            <MaskableValue
                              className="text-sm font-mono"
                              value={`•••• ${account.mask}`}
                              maskedFallback={masked ? "••••" : `•••• ${account.mask}`}
                              srLabel={`${account.name} account mask`}
                            />
                            <MaskableValue
                              className="text-xs text-muted-foreground"
                              value={new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(account.balance)}
                              maskedFallback="Hidden"
                              srLabel={`${account.name} balance`}
                            />
                          </div>
                        </div>
                      ))
                    )}
                    {institution.status === "error" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => handleLinkInstitution(institution.id)}
                        isLoading={linkingInstitution === institution.id}
                      >
                        Retry
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            Linked accounts power your Money Graph and automate account health alerts.
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setCurrentStep("profile")}>Back</Button>
            <Button onClick={handleContinueFromConnect} disabled={!hasConnected}>
              Continue
            </Button>
          </div>
        </CardFooter>
      </Card>
    )
  }

  const renderPersonalizeStep = () => (
    <Card className="card-standard">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Your Money Graph preview</CardTitle>
          <CardDescription>
            Here’s how we’ll stitch together accounts, recurring cash flow, and your goals to drive insights.
          </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium text-foreground">{personaDetail.headline}</p>
          <p className="text-sm text-muted-foreground">{personaDetail.detail}</p>
        </div>

        {graphLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Generating preview…
          </div>
        ) : graphError ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            {graphError}
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {moneyGraphAccounts.map((account) => (
              <div key={account.name} className="rounded-lg border border-border bg-card/40 p-4">
                <h3 className="text-sm font-semibold text-foreground">{account.name}</h3>
                <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">Intent signals</p>
                <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                  {account.intentTags.map((tag) => (
                    <li key={tag}>• {tag.replace(/_/g, " ")}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">Supports goals</p>
                <p className="text-sm text-muted-foreground">
                  {account.supportsGoals.length > 0
                    ? account.supportsGoals.map((goalId) => `Goal ${goalId}`).join(", ")
                    : "No goal links yet"}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          Encryption by default. We never store credentials in plain text.
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setCurrentStep("connect")}>Back</Button>
          <Button onClick={handleFinish}>
            Launch dashboard
          </Button>
        </div>
      </CardFooter>
    </Card>
  )

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Preparing onboarding…
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
        <header className="sticky top-0 z-40 border-b border-border/20 bg-card/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} aria-label="Exit onboarding">
                <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-sm font-semibold text-foreground">Guided onboarding</p>
              <p className="text-xs text-muted-foreground">Progress synced securely</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <Sparkles className="h-3.5 w-3.5" /> Money Graph beta
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <section className="mb-8 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground md:text-3xl">{currentStepDefinition.title}</h1>
              <p className="text-sm text-muted-foreground md:text-base">{currentStepDefinition.description}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Progress</p>
              <p className="text-sm font-medium text-foreground">{progress}% complete</p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />

          <ol className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            {steps.map((step, index) => {
              const isComplete = completedSteps.has(step.id)
              const isActive = currentStep === step.id
              return (
                <li key={step.id} className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium transition ${isComplete ? "bg-primary text-primary-foreground border-primary" : isActive ? "border-primary text-primary" : "border-border text-muted-foreground"}`}
                  >
                    {isComplete ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        <section className="space-y-6">
          {currentStep === "profile" && renderPersonaStep()}
          {currentStep === "connect" && renderConnectStep()}
          {currentStep === "personalize" && renderPersonalizeStep()}
        </section>
      </main>

      <Dialog open={linkModalOpen} onOpenChange={setLinkModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Select an institution</DialogTitle>
            <DialogDescription>Choose an institution to simulate a secure OAuth-style connection.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            {institutions.map((institution) => {
              const status: InstitutionConnectionStatus | undefined = state.linkedInstitutions.find(
                (item) => item.id === institution.id,
              )?.status
              return (
                <button
                  key={institution.id}
                  type="button"
                  className={`rounded-lg border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${status === "connected" ? "border-primary bg-primary/5" : "border-border hover:border-primary/60"}`}
                  onClick={() => handleLinkInstitution(institution.id)}
                  disabled={linkingInstitution === institution.id}
                  aria-busy={linkingInstitution === institution.id}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{institution.name}</p>
                      <p className="text-xs text-muted-foreground">{institution.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {linkingInstitution === institution.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
                          <span className="text-xs text-muted-foreground">Connecting…</span>
                        </>
                      ) : (
                        <span className={`rounded-full px-2 py-1 text-xs ${institution.color}`}>OAuth mock</span>
                      )}
                    </div>
                  </div>
                  {linkErrors[institution.id] ? (
                    <p className="mt-2 text-xs text-destructive">{linkErrors[institution.id]}</p>
                  ) : null}
                  {linkingInstitution === institution.id ? (
                    <span className="sr-only" aria-live="polite">
                      Connecting to {institution.name}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
      </div>
      <FeedbackPrompt
        surface="onboarding"
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        context={state.persona?.goalsFocus ?? "First session"}
      />
    </>
  )
}

type StatusBadgeProps = { status: InstitutionConnectionStatus }

function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "connected":
      return (
        <Badge className="gap-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <Check className="h-3.5 w-3.5" /> Connected
        </Badge>
      )
    case "linking":
      return (
        <Badge className="gap-1 bg-blue-500/15 text-blue-600 dark:text-blue-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Linking
        </Badge>
      )
    case "error":
      return (
        <Badge variant="destructive" className="gap-1">
          <Wallet className="h-3.5 w-3.5" /> Needs attention
        </Badge>
      )
    default:
      return <Badge variant="outline">Pending</Badge>
  }
}
