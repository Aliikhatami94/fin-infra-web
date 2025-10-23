"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

import { InsightCard } from "@/components/insights/InsightCard"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { getInsights } from "@/lib/insights/service"
import type { InsightAction } from "@/lib/insights/definitions"

interface TaxesAIInsightsProps {
  onLaunchCopilot?: () => void
}

export function TaxesAIInsights({ onLaunchCopilot }: TaxesAIInsightsProps) {
  const insights = getInsights({ surface: "taxes" })

  if (insights.length === 0) {
    return null
  }

  const handleAction = ({ action }: { action: InsightAction }) => {
    if (action.id === "automation:tax-harvest") {
      onLaunchCopilot?.()
    }
  }

  return (
    <motion.section
      {...createStaggeredCardVariants(0, 0.2)}
      aria-labelledby="taxes-insights-heading"
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
          <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
        </div>
        <h3 id="taxes-insights-heading" className="text-sm font-semibold text-foreground">
          AI Tax Insights
        </h3>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {insights.map((insight, index) => (
          <InsightCard key={insight.id} insight={insight} index={index} onAction={handleAction} />
        ))}
      </div>
    </motion.section>
  )
}
