"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Wallet, CreditCard, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { MaskableValue } from "@/components/privacy-provider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { motion } from "framer-motion"

const kpis = [
  {
    label: "Net Worth",
    value: "$487,234",
    change: "+12.4%",
    trend: "up",
    sparkline: [45, 52, 48, 55, 58, 62, 65, 68, 72, 75],
    icon: DollarSign,
    lastSynced: "2 minutes ago",
  },
  {
    label: "Investable Assets",
    value: "$324,891",
    change: "+8.2%",
    trend: "up",
    sparkline: [30, 35, 32, 38, 42, 45, 48, 52, 55, 58],
    icon: Wallet,
    lastSynced: "2 minutes ago",
  },
  {
    label: "Cash Available",
    value: "$52,180",
    change: "-2.1%",
    trend: "down",
    sparkline: [60, 58, 55, 54, 52, 50, 48, 47, 45, 44],
    icon: DollarSign,
    lastSynced: "5 minutes ago",
  },
  {
    label: "Debt Balance",
    value: "$18,500",
    change: "-5.3%",
    trend: "down",
    sparkline: [25, 24, 23, 22, 20, 19, 18, 17, 16, 15],
    icon: CreditCard,
    lastSynced: "1 hour ago",
  },
  {
    label: "Today's P/L",
    value: "+$2,847",
    change: "+1.8%",
    trend: "up",
    sparkline: [0, 2, 1, 3, 5, 4, 6, 7, 8, 9],
    icon: Activity,
    lastSynced: "Just now",
  },
  {
    label: "Credit Score",
    value: "785",
    change: "+12 pts",
    trend: "up",
    sparkline: [70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
    icon: Activity,
    lastSynced: "1 week ago",
  },
]

const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg className="w-20 h-10" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function KPICards() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi, index) => (
        <TooltipProvider key={kpi.label}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={kpi.label === "Net Worth" ? "/net-worth-detail" : "#"}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Card className="cursor-pointer card-standard card-lift">
                    <CardContent className="p-6 min-h-[140px] flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">{kpi.label}</p>
                          <p className="text-2xl font-bold font-mono tabular-nums truncate">
                            <MaskableValue value={kpi.value} srLabel={`${kpi.label} value`} />
                          </p>
                        </div>
                        <div
                          className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                            kpi.trend === "up" ? "bg-green-500/10" : "bg-red-500/10",
                          )}
                        >
                          <kpi.icon className={cn("h-5 w-5", kpi.trend === "up" ? "text-green-600" : "text-red-600")} />
                        </div>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="flex items-center gap-1 text-xs">
                          {kpi.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 text-green-600/80" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-600/80" />
                          )}
                          <span className={cn(kpi.trend === "up" ? "text-green-600/80" : "text-red-600/80")}>
                            <MaskableValue value={kpi.change} srLabel={`${kpi.label} change`} />
                          </span>
                        </div>
                        <Sparkline
                          data={kpi.sparkline}
                          color={kpi.trend === "up" ? "rgb(22, 163, 74)" : "rgb(220, 38, 38)"}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Last synced: {kpi.lastSynced}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}
