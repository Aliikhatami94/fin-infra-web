"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { InsightCard } from "@/components/insights/InsightCard"
import { getInsights } from "@/lib/insights/service"
import type { InsightAction } from "@/lib/insights/definitions"
import { AutomationCopilotDrawer } from "@/components/automation-copilot-drawer"

export function BudgetAIInsights() {
  const insights = getInsights({ surface: "budget" })
  const [copilotOpen, setCopilotOpen] = useState(false)

  const handleAction = ({ action }: { action: InsightAction }) => {
    if (action.id === "automation:budget-sweep") {
      setCopilotOpen(true)
    }
  }

  return (
    <>
      <motion.section
        {...createStaggeredCardVariants(0, 0.2)}
        aria-labelledby="budget-insights-heading"
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
          </div>
          <h3 id="budget-insights-heading" className="text-sm font-semibold text-foreground">
            AI Budget Insights
          </h3>
        </div>
        <div className="grid gap-4">
          {insights.map((insight, index) => (
            <InsightCard key={insight.id} insight={insight} index={index} onAction={handleAction} />
          ))}
        </div>
      </motion.section>

      <AutomationCopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        surface="budget"
        initialSuggestionId="budget-sweep-autosave"
      />
    </>
  )
}
