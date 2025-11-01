"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Info, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function RiskSection() {
  return (
    <TooltipProvider>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-standard">
          <CardHeader>
            <CardTitle>Risk Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Beta vs S&P 500</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Measures how much your portfolio moves relative to the S&P 500. A beta of 1.15 means your
                        portfolio is 15% more volatile than the market.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="font-semibold tabular-nums text-foreground">1.15</span>
              </div>
              <Progress value={57.5} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Volatility Percentile</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Your portfolio is more volatile than 68% of similar portfolios. Higher volatility means larger
                        price swings.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="font-semibold tabular-nums text-foreground">68th</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Max Drawdown</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        The largest peak-to-trough decline in your portfolio value. This shows the worst loss you&#39;ve
                        experienced.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="font-semibold tabular-nums text-red-600 dark:text-red-400">-12.4%</span>
              </div>
              <Progress value={12.4} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-standard">
          <CardHeader>
            <CardTitle>Diversification Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="relative">
                <svg className="h-32 w-32 -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.72)}`}
                    className="text-primary"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">72</span>
                </div>
              </div>
            </div>
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Your score is good, but you are heavily concentrated in the Technology sector (35%). Consider adding
                exposure to Healthcare or Consumer sectors to improve diversification.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
