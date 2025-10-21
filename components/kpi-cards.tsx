"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Wallet, CreditCard, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

export function KPICards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi) => (
        <TooltipProvider key={kpi.label}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 border border-border/50">
                <CardContent className="p-4 h-[120px] flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <p className="text-xs text-muted-foreground/70">{kpi.label}</p>
                      <p className="text-2xl font-bold font-mono tabular-nums">{kpi.value}</p>
                      <div className="flex items-center gap-1 text-xs">
                        {kpi.trend === "up" ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <span className={cn(kpi.trend === "up" ? "text-green-600" : "text-red-600")}>{kpi.change}</span>
                      </div>
                    </div>
                    <div className="h-12 w-16 ml-2">
                      <svg viewBox="0 0 100 50" className="h-full w-full">
                        <polyline
                          points={kpi.sparkline.map((val, i) => `${i * 11},${50 - val / 2}`).join(" ")}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={cn(kpi.trend === "up" ? "text-green-600" : "text-red-600")}
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
