"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const rebalancingSuggestions = [
  {
    ticker: "AAPL",
    action: "sell",
    currentWeight: 15.2,
    targetWeight: 12.0,
    shares: 25,
    amount: 4750,
    reason: "Overweight in Technology sector",
  },
  {
    ticker: "GOOGL",
    action: "buy",
    currentWeight: 6.0,
    targetWeight: 8.0,
    shares: 15,
    amount: 2100,
    reason: "Underweight in Technology sector",
  },
  {
    ticker: "JNJ",
    action: "buy",
    currentWeight: 0,
    targetWeight: 5.0,
    shares: 30,
    amount: 4800,
    reason: "Add Healthcare exposure",
  },
]

export function RebalancingPreview() {
  return (
    <Card className="card-standard border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Rebalancing Suggestions</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Based on your target allocation</p>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-block">
                  <Button size="sm" className="gap-2" disabled>
                    <Sparkles className="h-4 w-4" />
                    Execute Rebalance
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Coming soon - Manual rebalancing</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {rebalancingSuggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.ticker}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <Badge
                variant={suggestion.action === "buy" ? "default" : "secondary"}
                className="min-w-[60px] justify-center"
              >
                {suggestion.action === "buy" ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {suggestion.action.toUpperCase()}
              </Badge>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold">{suggestion.ticker}</p>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground">{suggestion.shares} shares</p>
                </div>
                <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span className="font-mono">{suggestion.currentWeight}%</span>
                  <ArrowRight className="h-3 w-3" />
                  <span className="font-mono font-medium text-foreground">{suggestion.targetWeight}%</span>
                </div>
                <p className="text-sm font-semibold font-mono">
                  {suggestion.action === "buy" ? "+" : "-"}${suggestion.amount.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        <div className="pt-3 border-t border-border/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estimated impact on portfolio:</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Risk Score:</span>
              <Badge variant="outline" className="text-green-600 border-green-600">
                -2.3% (Lower)
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
