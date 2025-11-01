"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

import { InsightCard } from "@/components/insights/InsightCard"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { getInsights } from "@/lib/insights/service"
import type { InsightAction, InsightDefinition } from "@/lib/insights/definitions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TaxesAIInsightsProps {
  onLaunchCopilot?: () => void
}

export function TaxesAIInsights({ onLaunchCopilot }: TaxesAIInsightsProps) {
  const insights = getInsights({ surface: "taxes" })

  if (insights.length === 0) {
    return null
  }

  const priorityGroups: {
    key: "high" | "medium" | "low"
    label: string
    description: string
    tone: string
    items: InsightDefinition[]
  }[] = [
    {
      key: "high",
      label: "Urgent",
      description: "Items that guard against penalties or missed savings.",
      tone: "text-red-600 dark:text-red-400",
      items: [],
    },
    {
      key: "medium",
      label: "Upcoming",
      description: "Plan these soon to stay on track for filing.",
      tone: "text-amber-600 dark:text-amber-400",
      items: [],
    },
    {
      key: "low",
      label: "On radar",
      description: "Nice-to-haves that round out your tax package.",
      tone: "text-slate-600 dark:text-slate-300",
      items: [],
    },
  ]

  insights.forEach((insight) => {
    const priority = insight.priority ?? "medium"
    const group = priorityGroups.find((entry) => entry.key === priority)
    if (group) {
      group.items.push(insight)
    }
  })

  const handleAction = ({ action }: { action: InsightAction }) => {
    if (action.id === "automation:tax-harvest") {
      onLaunchCopilot?.()
    }
  }

  let cardIndex = 0

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
      <div className="space-y-6">
        {priorityGroups
          .filter((group) => group.items.length > 0)
          .map((group) => {
            const showDocumentsLink = group.items.some((item) => item.category === "documents")

            return (
              <section key={group.key} className="space-y-3" aria-label={`${group.label} tax insights`}>
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <p className={`text-sm font-semibold ${group.tone}`}>{group.label}</p>
                    <p className="text-xs text-muted-foreground">{group.description}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {group.items.length} item{group.items.length === 1 ? "" : "s"}
                  </Badge>
                  {showDocumentsLink && (
                    <Button asChild variant="link" size="sm" className="px-0 text-xs">
                      <Link href="/dashboard/documents">View missing documents</Link>
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {group.items.map((insight) => {
                    const renderedCard = (
                      <InsightCard
                        key={insight.id}
                        insight={insight}
                        index={cardIndex}
                        onAction={handleAction}
                      />
                    )
                    cardIndex += 1
                    return renderedCard
                  })}
                </div>
              </section>
            )
          })}
      </div>
    </motion.section>
  )
}
