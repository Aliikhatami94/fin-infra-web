"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Line, LineChart, ResponsiveContainer } from "recharts"

const netFlowSparkline = [
  { value: 1200 },
  { value: 1500 },
  { value: 1300 },
  { value: 1800 },
  { value: 1600 },
  { value: 2100 },
  { value: 1500 },
]

const inflowSparkline = [
  { value: 8200 },
  { value: 8500 },
  { value: 8800 },
  { value: 9200 },
  { value: 8900 },
  { value: 9500 },
  { value: 9000 },
]

const outflowSparkline = [
  { value: 7000 },
  { value: 7000 },
  { value: 7500 },
  { value: 7400 },
  { value: 7300 },
  { value: 7400 },
  { value: 7500 },
]

export function CashFlowKPIs() {
  const netCashFlow = 1500
  const totalInflow = 9000
  const totalOutflow = 7500
  const changePercent = 10

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
        <Card className="card-standard card-lift">
          <CardContent className="p-6 min-h-[140px] flex flex-col justify-between">
            <div className="flex items-start justify-between mb-2">
              <div className="space-y-1 flex-1">
                <p className="text-xs text-muted-foreground">Net Cash Flow</p>
                <p className="text-2xl font-bold tabular-nums text-foreground">${netCashFlow.toLocaleString()}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs">
                {changePercent >= 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-500">+{changePercent}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-500" />
                    <span className="text-red-500">{changePercent}%</span>
                  </>
                )}
              </div>
              <div className="w-20 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={netFlowSparkline}>
                    <Line type="monotone" dataKey="value" stroke="hsl(210, 100%, 60%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="card-standard card-lift">
          <CardContent className="p-6 min-h-[140px] flex flex-col justify-between">
            <div className="flex items-start justify-between mb-2">
              <div className="space-y-1 flex-1">
                <p className="text-xs text-muted-foreground">Total Inflow</p>
                <p className="text-2xl font-bold tabular-nums text-foreground">${totalInflow.toLocaleString()}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <ArrowDownRight className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">83% from Salary</p>
              <div className="w-20 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={inflowSparkline}>
                    <Line type="monotone" dataKey="value" stroke="hsl(142, 76%, 45%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="card-standard card-lift">
          <CardContent className="p-6 min-h-[140px] flex flex-col justify-between">
            <div className="flex items-start justify-between mb-2">
              <div className="space-y-1 flex-1">
                <p className="text-xs text-muted-foreground">Total Outflow</p>
                <p className="text-2xl font-bold tabular-nums text-foreground">${totalOutflow.toLocaleString()}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                <ArrowUpRight className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Highest: Rent ($2,200)</p>
              <div className="w-20 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={outflowSparkline}>
                    <Line type="monotone" dataKey="value" stroke="hsl(24, 95%, 53%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
