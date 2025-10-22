"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertCircle, Sparkles, DollarSign } from "lucide-react"
import { motion } from "framer-motion"

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
  },
]

export function GoalRecommendations() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Smart Recommendations</h2>
          <p className="text-sm text-muted-foreground">AI-powered suggestions to optimize your goals</p>
        </div>
        <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-200">
          <Sparkles className="h-3 w-3 mr-1" />3 New
        </Badge>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`card-standard card-lift border-l-4 ${rec.borderColor}`}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${rec.bgColor}`}>
                    <rec.icon className={`h-5 w-5 ${rec.color}`} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-semibold">{rec.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-background text-xs">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {rec.impact}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full sm:w-auto bg-transparent">
                      {rec.action}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
