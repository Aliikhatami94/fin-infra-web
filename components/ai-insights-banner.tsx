"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, TrendingDown, Target } from "lucide-react"
import { createStaggeredCardVariants } from "@/lib/motion-variants"

export function AIInsightsBanner() {
  const insights = [
    {
      icon: TrendingDown,
      text: "Your credit utilization decreased 4% this month. Excellent trend.",
      color: "text-[var(--color-positive)]",
      bgColor: "bg-[var(--color-positive)]/10",
    },
    {
      icon: Target,
      text: "You're on track to reach your emergency fund goal 2 months early.",
      color: "text-[var(--color-info)]",
      bgColor: "bg-[var(--color-info)]/10",
    },
  ]

  return (
    <motion.div {...createStaggeredCardVariants(0, 0.3)}>
      <Card className="border-border/30 bg-gradient-to-r from-purple-500/5 to-blue-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
              <div className="space-y-2">
                {insights.map((insight, index) => {
                  const Icon = insight.icon
                  return (
                    <div key={index} className="flex items-start gap-2">
                      <div
                        className={`h-5 w-5 rounded ${insight.bgColor} flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <Icon className={`h-3 w-3 ${insight.color}`} />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{insight.text}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
