"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, DollarSign, Target } from "lucide-react"
import { motion } from "framer-motion"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { LastSyncBadge } from "@/components/last-sync-badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const sparklineData = [
  { month: "Jan", value: 42000 },
  { month: "Feb", value: 44000 },
  { month: "Mar", value: 46500 },
  { month: "Apr", value: 48000 },
  { month: "May", value: 51000 },
  { month: "Jun", value: 54000 },
  { month: "Jul", value: 59500 },
]

const contributionData = [
  { month: "Jan", value: 800 },
  { month: "Feb", value: 900 },
  { month: "Mar", value: 1000 },
  { month: "Apr", value: 1100 },
  { month: "May", value: 1150 },
  { month: "Jun", value: 1180 },
  { month: "Jul", value: 1200 },
]

function MiniSparkline({ data, color }: { data: { value: number }[]; color: string }) {
  const max = Math.max(...data.map((d) => d.value))
  const min = Math.min(...data.map((d) => d.value))
  const range = max - min

  return (
    <svg width="80" height="40" className="overflow-visible">
      <polyline
        points={data
          .map((d, i) => {
            const x = (i / (data.length - 1)) * 80
            const y = 40 - ((d.value - min) / range) * 40
            return `${x},${y}`
          })
          .join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function GoalsSummaryKPIs() {
  const totalSaved = 59500
  const totalTarget = 188000
  const percentComplete = Math.round((totalSaved / totalTarget) * 100)
  const monthlyContribution = 1200
  const targetContribution = 1400
  const contributionRate = Math.round((monthlyContribution / targetContribution) * 100)

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <motion.div {...createStaggeredCardVariants(0, 0)}>
        <Card className="card-standard card-lift">
          <CardContent className="p-6 min-h-[140px] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm text-muted-foreground">Total Goal Progress</p>
                  <LastSyncBadge timestamp="5 min ago" source="Manual" />
                </div>
                <p className="text-2xl font-bold tabular-nums">
                  ${(totalSaved / 1000).toFixed(0)}k
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}
                    / ${(totalTarget / 1000).toFixed(0)}k
                  </span>
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-sm font-medium text-[var(--color-positive)]">+{percentComplete}%</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Previous: $54,000</p>
                      <p className="text-xs">Current: ${totalSaved.toLocaleString()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-xs text-muted-foreground">complete</span>
              </div>
              <MiniSparkline data={sparklineData} color="hsl(217, 91%, 60%)" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...createStaggeredCardVariants(1, 0)}>
        <Card className="card-standard card-lift">
          <CardContent className="p-6 min-h-[140px] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm text-muted-foreground">Monthly Contribution</p>
                  <LastSyncBadge timestamp="5 min ago" source="Manual" />
                </div>
                <p className="text-2xl font-bold tabular-nums">
                  ${monthlyContribution.toLocaleString()}
                  <span className="text-base font-normal text-muted-foreground">/mo</span>
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                <DollarSign className="h-5 w-5 text-[var(--color-positive)]" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-sm font-medium text-[var(--color-warning)]">{contributionRate}%</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Target: ${targetContribution.toLocaleString()}/mo</p>
                      <p className="text-xs">Current: ${monthlyContribution.toLocaleString()}/mo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-xs text-muted-foreground">of target</span>
              </div>
              <MiniSparkline data={contributionData} color="var(--color-positive)" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...createStaggeredCardVariants(2, 0)}>
        <Card className="card-standard card-lift">
          <CardContent className="p-6 min-h-[140px] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm text-muted-foreground">Funding Status</p>
                  <LastSyncBadge timestamp="5 min ago" source="Manual" />
                </div>
                <p className="text-2xl font-bold">On Track</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-[var(--color-positive)]" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Emergency Fund</span>
                <span className="font-medium">$500/mo</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">House Down Payment</span>
                <span className="font-medium">$600/mo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
