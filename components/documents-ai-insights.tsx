"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { InsightCard } from "@/components/insights/InsightCard"
import { getInsights } from "@/lib/insights/service"

export function DocumentsAIInsights() {
  const insights = getInsights({ surface: "documents" })

  return (
    <motion.section
      {...createStaggeredCardVariants(0, 0.2)}
      aria-labelledby="document-insights-heading"
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
          <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
        </div>
        <h3 id="document-insights-heading" className="text-sm font-semibold text-foreground">
          AI Document Insights
        </h3>
      </div>
      <div className="grid gap-4">
        {insights.map((insight, index) => (
          <InsightCard key={insight.id} insight={insight} index={index} />
        ))}
      </div>
    </motion.section>
  )
}
