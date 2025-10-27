"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  DollarSign,
  PieChart
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const sampleInsights = [
  {
    type: "opportunity",
    priority: "high",
    icon: <TrendingUp className="h-5 w-5" />,
    title: "Tax Loss Harvesting Opportunity",
    description: "Harvest $12,400 in losses from underperforming tech positions to offset gains. Estimated tax savings: $3,100.",
    impact: "$3,100 saved",
    action: "Review positions",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-900",
  },
  {
    type: "alert",
    priority: "high",
    icon: <AlertTriangle className="h-5 w-5" />,
    title: "Portfolio Concentration Risk",
    description: "Tech sector allocation has grown to 42% (target: 35%). Consider rebalancing to maintain risk profile.",
    impact: "7% over target",
    action: "View rebalancing",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-900",
  },
  {
    type: "insight",
    priority: "medium",
    icon: <DollarSign className="h-5 w-5" />,
    title: "Cash Deployment Recommendation",
    description: "Cash balance ($240K) exceeds 6-month runway by $90K. Consider deploying excess into short-term treasuries.",
    impact: "+2.1% yield potential",
    action: "See options",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-900",
  },
  {
    type: "performance",
    priority: "medium",
    icon: <PieChart className="h-5 w-5" />,
    title: "Allocation Drift Detected",
    description: "Your portfolio has drifted 8% from target allocation over the last quarter due to market movements.",
    impact: "8% drift",
    action: "Rebalance now",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-900",
  },
]

const digestPreview = {
  date: "Monday, October 27, 2025",
  greeting: "Good morning! Here's your daily insight digest.",
  summary: "4 insights require your attention today. We've identified 1 high-priority tax opportunity and 1 risk alert.",
  insights: sampleInsights,
}

export function InsightPreviewModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 h-9 rounded-full"
          aria-label="See example of AI insights digest"
        >
          See Example Insight Digest
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            <DialogTitle className="text-2xl">AI Insight Digest</DialogTitle>
          </div>
          <DialogDescription>
            {digestPreview.date}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Greeting & Summary */}
          <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
            <p className="text-sm font-medium text-foreground mb-1">
              {digestPreview.greeting}
            </p>
            <p className="text-sm text-muted-foreground">
              {digestPreview.summary}
            </p>
          </div>

          {/* Insights List */}
          <div className="space-y-3">
            {digestPreview.insights.map((insight, index) => (
              <div
                key={index}
                className={`rounded-lg border p-4 space-y-2 ${insight.bgColor} ${insight.borderColor}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`mt-0.5 ${insight.color}`}>
                      {insight.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground text-sm">
                          {insight.title}
                        </h3>
                        {insight.priority === "high" && (
                          <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                            High Priority
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {insight.description}
                      </p>
                      <div className="flex items-center gap-3 pt-1">
                        <span className={`text-xs font-semibold ${insight.color}`}>
                          {insight.impact}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs font-medium"
                        >
                          {insight.action}
                          <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mt-6 rounded-lg bg-muted/50 p-4 border border-border/40">
            <p className="text-sm text-foreground font-medium mb-2">
              Get personalized insights for your portfolio
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              Our AI copilot analyzes your holdings, cash flow, and market conditions to surface actionable opportunities every morning.
            </p>
            <Button asChild size="sm" className="rounded-full">
              <a href="/sign-up">Start Your Free Trial</a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
