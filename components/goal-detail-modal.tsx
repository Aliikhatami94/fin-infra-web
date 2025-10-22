"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { TrendingUp } from "lucide-react"

const projectionData = [
  { month: "Jan", amount: 18000 },
  { month: "Feb", amount: 18500 },
  { month: "Mar", amount: 19000 },
  { month: "Apr", amount: 19500 },
  { month: "May", amount: 20000 },
  { month: "Jun", amount: 20500 },
  { month: "Jul", amount: 21000 },
  { month: "Aug", amount: 21500 },
  { month: "Sep", amount: 22000 },
  { month: "Oct", amount: 22500 },
  { month: "Nov", amount: 23000 },
  { month: "Dec", amount: 23500 },
]

interface GoalDetailModalProps {
  goal: {
    name: string
    current: number
    target: number
    percent: number
    monthlyTarget: number
    fundingSource: string
    eta: string
    icon: any
    color: string
    bgColor: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GoalDetailModal({ goal, open, onOpenChange }: GoalDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${goal.bgColor}`}>
              <goal.icon className={`h-5 w-5 ${goal.color}`} />
            </div>
            <DialogTitle className="text-xl">{goal.name}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Progress</span>
              <span className="text-sm font-medium">
                ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
              </span>
            </div>
            <Progress value={goal.percent} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{goal.percent}% Complete</span>
              <span className="text-muted-foreground">ETA: {goal.eta}</span>
            </div>
          </div>

          {/* Goal Details */}
          <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Target</p>
              <p className="text-lg font-semibold">${goal.monthlyTarget}/mo</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Funding Source</p>
              <p className="text-lg font-semibold">{goal.fundingSource}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-lg font-semibold">${(goal.target - goal.current).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Months to Goal</p>
              <p className="text-lg font-semibold">{goal.eta}</p>
            </div>
          </div>

          {/* Projection Chart */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <h3 className="font-semibold">Savings Projection</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on your current contribution rate of ${goal.monthlyTarget}/month
            </p>
            <div className="h-64 w-full rounded-lg border p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData}>
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
                  />
                  <Line type="monotone" dataKey="amount" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
