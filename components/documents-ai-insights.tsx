"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { Button } from "@/components/ui/button"
import { documentInsights } from "@/lib/mock"

export function DocumentsAIInsights() {
  const insights = documentInsights

  return (
    <motion.div {...createStaggeredCardVariants(0, 0.3)}>
      <Card className="border-border/30 bg-gradient-to-r from-purple-500/5 to-blue-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-semibold text-foreground">AI Document Insights</h3>
              <div className="space-y-3">
                {insights.map((insight, index) => {
                  const Icon = insight.icon
                  return (
                    <div key={index} className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-1">
                        <div
                          className={`h-5 w-5 rounded ${insight.bgColor} flex items-center justify-center flex-shrink-0 mt-0.5`}
                        >
                          <Icon className={`h-3 w-3 ${insight.color}`} />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{insight.text}</p>
                      </div>
                      <Button variant="outline" size="sm" className="flex-shrink-0 text-xs h-7 bg-transparent">
                        {insight.action}
                      </Button>
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
