"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

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
