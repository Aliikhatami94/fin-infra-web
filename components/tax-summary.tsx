"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingDown, Info, Clock, PieChart, TrendingUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts"
import { motion } from "framer-motion"

const capitalGainsData = [
  { name: "ST", value: 4200, color: "hsl(25, 95%, 53%)" },
  { name: "LT", value: 8140, color: "hsl(142, 76%, 36%)" },
]

interface TaxSummaryProps {
  onFilterChange?: (filter: string | null) => void
}

export function TaxSummary({ onFilterChange }: TaxSummaryProps) {
  const handleBarClick = (data: any) => {
    if (onFilterChange) {
      if (data.name === "ST") {
        onFilterChange("short-term")
      } else if (data.name === "LT") {
        onFilterChange("long-term")
      }
    }
  }

  return (
    <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
      <Card className="card-standard card-lift min-h-[140px]">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">Estimated Tax Liability</p>
              <p className="text-3xl font-semibold tabular-nums text-foreground">$18,450</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">vs. $16,000 paid to date</p>
            <Badge className="text-xs bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">
              $2,450 shortfall
            </Badge>
            <div className="mt-3">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: "87%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">87% paid</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-standard card-lift min-h-[140px]">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-muted-foreground">Capital Gains YTD</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Short-Term: $4,200 (higher tax rate)</p>
                      <p className="text-xs">Long-Term: $8,140 (lower tax rate)</p>
                      <p className="text-xs mt-1 text-muted-foreground">Click bars to filter table below</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-3xl font-semibold tabular-nums text-foreground">$12,340</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-8 -mx-2 cursor-pointer">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={capitalGainsData} onClick={handleBarClick}>
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {capitalGainsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-2 text-xs">
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-900 transition-smooth"
                onClick={() => onFilterChange?.("short-term")}
              >
                ST: $4,200
              </Badge>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 cursor-pointer hover:bg-green-200 dark:hover:bg-green-900 transition-smooth"
                onClick={() => onFilterChange?.("long-term")}
              >
                LT: $8,140
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-standard card-lift min-h-[140px]">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">Dividends YTD</p>
              <p className="text-3xl font-semibold tabular-nums text-foreground">$2,850</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950">
              <PieChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Badge
                variant="secondary"
                className="text-xs bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
              >
                Qualified: $2,400
              </Badge>
              <Badge
                variant="secondary"
                className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
              >
                Non-Qual: $450
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Non-Qualified taxed at ordinary income rate</p>
          </div>
        </CardContent>
      </Card>

      <Card className="card-standard card-lift min-h-[140px]">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">Potential Tax Savings</p>
              <p className="text-3xl font-semibold tabular-nums text-green-600 dark:text-green-400">$3,200</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950">
              <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Available loss harvesting</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs border-green-300 text-green-700 dark:text-green-400">
                5 positions identified
              </Badge>
              <Badge variant="outline" className="text-xs border-orange-300 text-orange-700 dark:text-orange-400">
                <Clock className="h-3 w-3 mr-1" />
                Act by Dec 31
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
