"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, PieChart, Sparkles } from "lucide-react"

import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { InsightCard } from "@/components/insights/InsightCard"
import { getInsights } from "@/lib/insights/service"
import type { InsightAction } from "@/lib/insights/definitions"
import { Button } from "@/components/ui/button"
import { AutomationCopilotDrawer } from "@/components/automation-copilot-drawer"

export function CryptoAIInsights() {
  const insights = getInsights({ surface: "crypto" })
  const [copilotOpen, setCopilotOpen] = useState(false)

  const handleAction = ({ action }: { action: InsightAction }) => {
    if (action.id === "automation:crypto-diversify") {
      setCopilotOpen(true)
    }
  }

  const showDiversificationCta = insights.some((insight) => insight.id === "crypto-concentration-risk")
  const diversificationSuggestions = [
    {
      id: "balanced-core",
      title: "Balanced core",
      description: "Keeps BTC conviction while lifting ETH for smart contract exposure.",
      weights: [
        { label: "BTC", weight: 55 },
        { label: "ETH", weight: 30 },
        { label: "Alt / Yield", weight: 15 },
      ],
      actionLabel: "Apply target mix",
    },
    {
      id: "growth-tilt",
      title: "Growth tilt",
      description: "Increase staking and L2 exposure while capping BTC at 45%.",
      weights: [
        { label: "BTC", weight: 45 },
        { label: "ETH", weight: 25 },
        { label: "DeFi / Staking", weight: 30 },
      ],
      actionLabel: "Simulate in Copilot",
    },
  ] as const

  const getPieGradient = (weights: { weight: number }[]) => {
    let start = 0
    const palette = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
    ]

    return weights
      .map((segment, index) => {
        const end = start + segment.weight
        const gradientSegment = `${palette[index % palette.length]} ${start}% ${end}%`
        start = end
        return gradientSegment
      })
      .join(", ")
  }

  return (
    <>
      <motion.section
        {...createStaggeredCardVariants(0, 0.2)}
        aria-labelledby="crypto-insights-heading"
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
          </div>
          <h3 id="crypto-insights-heading" className="text-sm font-semibold text-foreground">
            AI Market Insights
          </h3>
        </div>

        <section aria-labelledby="crypto-diversification-heading" className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <PieChart className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h4 id="crypto-diversification-heading" className="text-sm font-semibold text-foreground">
                Diversification suggestions
              </h4>
              <p className="text-xs text-muted-foreground">
                Copilot computed optimal mixes based on your guardrails and current drift.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {diversificationSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-border/60 bg-card/70 p-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="h-16 w-16 shrink-0 rounded-full border border-border/60"
                    style={{ backgroundImage: `conic-gradient(${getPieGradient(suggestion.weights)})` }}
                    role="img"
                    aria-label={`${suggestion.title} allocation pie`}
                  />
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{suggestion.title}</p>
                      <p className="text-xs text-muted-foreground leading-snug">{suggestion.description}</p>
                    </div>
                    <ul className="space-y-1 text-xs">
                      {suggestion.weights.map((weight, index) => (
                        <li key={`${suggestion.id}-${weight.label}`} className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: `hsl(var(--chart-${index + 1}))` }}
                            aria-hidden="true"
                          />
                          <span className="font-medium text-foreground">{weight.label}</span>
                          <span className="tabular-nums text-muted-foreground">{weight.weight}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" className="gap-1" onClick={() => setCopilotOpen(true)}>
                    {suggestion.actionLabel}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => setCopilotOpen(true)}>
                    Compare scenarios
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {showDiversificationCta && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-500/10 p-4 text-sm text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/20 dark:text-rose-200">
            <div>
              <p className="font-semibold">BTC is above your concentration guardrail.</p>
              <p className="text-xs opacity-80">
                Copilot can walk you through diversifying into ETH and SOL while respecting your MoneyGraph policy mix.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setCopilotOpen(true)}>
              Launch Copilot
            </Button>
          </div>
        )}

        <div className="grid gap-4">
          {insights.map((insight, index) => (
            <InsightCard key={insight.id} insight={insight} index={index} onAction={handleAction} />
          ))}
        </div>
      </motion.section>

      <AutomationCopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        surface="crypto"
        initialSuggestionId="crypto-diversify-btc"
      />
    </>
  )
}
