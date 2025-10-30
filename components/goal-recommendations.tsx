"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertCircle, Sparkles, DollarSign } from "lucide-react"
import { motion } from "framer-motion"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { toast } from "@/components/ui/sonner"

const recommendations = [
  {
    type: "boost",
    title: "Boost Your Emergency Fund",
    description:
      "You have $2,400 surplus cash this month. Consider increasing your Emergency Fund contribution from $500 to $800/month to reach your goal 3 months earlier.",
    impact: "Reach goal by Jan 2025 instead of Apr 2025",
    action: "Increase Contribution",
    icon: TrendingUp,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-200 dark:border-green-800",
    confirmTitle: "Increase monthly contribution?",
    confirmDescription: "This will adjust your Emergency Fund contribution from $500 to $800/month. You can change this at any time in your goal settings."
  },
  {
    type: "catchup",
    title: "House Down Payment Behind Schedule",
    description:
      "You're 3 months behind on your House Down Payment goal. To get back on track, increase your monthly contribution by $150 (from $600 to $750).",
    impact: "Get back on track by Dec 2024",
    action: "Adjust Budget",
    icon: AlertCircle,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-200 dark:border-orange-800",
    confirmTitle: "Adjust budget allocation?",
    confirmDescription: "This will increase your House Down Payment contribution from $600 to $750/month. Your budget categories will be updated to reflect this change."
  },
  {
    type: "opportunity",
    title: "Underutilized Credit Available",
    description:
      "You have $8,500 in available credit with 0% APR for 12 months. Consider using this strategically to accelerate your Vacation Fund while maintaining your emergency savings.",
    impact: "Reach vacation goal 6 months earlier",
    action: "Learn More",
    icon: Sparkles,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-200 dark:border-blue-800",
    confirmTitle: "Review credit utilization strategy?",
    confirmDescription: "This is a suggestion to use available credit strategically. Disclaimer: Using credit carries risks. Review terms carefully and ensure you can pay off balances before promotional rates expire."
  },
]

export function GoalRecommendations() {
  const [confirmAction, setConfirmAction] = useState<typeof recommendations[0] | null>(null)

  const handleConfirm = () => {
    if (confirmAction) {
      toast.success(`${confirmAction.action} completed`, {
        description: `Your ${confirmAction.title.toLowerCase()} has been updated.`
      })
    }
    setConfirmAction(null)
  }
  return (
    <div className="space-y-4 w-full min-w-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold">Smart Recommendations</h2>
          <p className="text-sm text-muted-foreground">AI-powered suggestions to optimize your goals</p>
        </div>
        <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-200 shrink-0">
          <Sparkles className="h-3 w-3 mr-1" />3 New
        </Badge>
      </div>

      <div className="space-y-3 w-full min-w-0">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full min-w-0"
          >
            <Card className={`card-standard card-lift border-l-4 ${rec.borderColor} w-full overflow-hidden`}>
              <CardContent className="p-4 w-full min-w-0">
                <div className="flex gap-4 min-w-0">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${rec.bgColor}`}>
                    <rec.icon className={`h-5 w-5 ${rec.color}`} />
                  </div>
                  <div className="flex-1 space-y-2 min-w-0 overflow-hidden">
                    <div className="min-w-0">
                      <h3 className="font-semibold break-words">{rec.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 break-words">{rec.description}</p>
                    </div>
                    <div className="w-full">
                      <div className="inline-flex items-start gap-1.5 rounded-md border px-2.5 py-1 text-xs bg-card max-w-full">
                        <DollarSign className="h-3 w-3 shrink-0 mt-0.5" />
                        <span className="break-words leading-tight">{rec.impact}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto bg-transparent"
                      onClick={() => setConfirmAction(rec)}
                    >
                      {rec.action}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={confirmAction?.confirmTitle || "Confirm action"}
        description={confirmAction?.confirmDescription || "Are you sure you want to proceed?"}
        confirmLabel={confirmAction?.action || "Continue"}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
