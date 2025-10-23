"use client"

import { useEffect, useMemo, useRef, useState, type ComponentType } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts"
import { TrendingUp, Edit, Calendar, DollarSign, TargetIcon, LinkIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/format"
import { SliderField } from "@/components/ui/slider"
import { trackPreferenceSlider } from "@/lib/analytics/events"

const contributionData = [
  { month: "Jan", actual: 18000, projected: null },
  { month: "Feb", actual: 18500, projected: null },
  { month: "Mar", actual: 19000, projected: null },
  { month: "Apr", actual: 19500, projected: null },
  { month: "May", actual: 20000, projected: null },
  { month: "Jun", actual: 20500, projected: null },
  { month: "Jul", actual: 21000, projected: null },
  { month: "Aug", actual: null, projected: 21500 },
  { month: "Sep", actual: null, projected: 22000 },
  { month: "Oct", actual: null, projected: 22500 },
  { month: "Nov", actual: null, projected: 23000 },
  { month: "Dec", actual: null, projected: 23500 },
]

const recentContributions = [
  { date: "Jul 15, 2024", amount: 500, source: "High-Yield Savings" },
  { date: "Jun 15, 2024", amount: 500, source: "High-Yield Savings" },
  { date: "May 15, 2024", amount: 500, source: "High-Yield Savings" },
  { date: "Apr 15, 2024", amount: 500, source: "High-Yield Savings" },
  { date: "Mar 15, 2024", amount: 500, source: "High-Yield Savings" },
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
    icon: ComponentType<{ className?: string }>
    color: string
    bgColor: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GoalDetailModal({ goal, open, onOpenChange }: GoalDetailModalProps) {
  const [isEditingTarget, setIsEditingTarget] = useState(false)
  const [isEditingAccount, setIsEditingAccount] = useState(false)
  const [newTarget, setNewTarget] = useState(goal.target.toString())
  const [newAccount, setNewAccount] = useState(goal.fundingSource)
  const [contribution, setContribution] = useState<number[]>([goal.monthlyTarget])
  const [risk, setRisk] = useState<number[]>([5])
  const hasTracked = useRef(false)

  const monthsRemaining = Math.ceil((goal.target - goal.current) / goal.monthlyTarget)
  const predictedDate = new Date()
  predictedDate.setMonth(predictedDate.getMonth() + monthsRemaining)
  const formattedPredictedDate = predictedDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })

  const contributionKey = useMemo(() => `goal:${goal.name}:contribution`, [goal.name])
  const riskKey = useMemo(() => `goal:${goal.name}:risk`, [goal.name])

  useEffect(() => {
    if (!open) return
    if (typeof window === "undefined") return
    const storedContribution = window.localStorage.getItem(contributionKey)
    const storedRisk = window.localStorage.getItem(riskKey)

    if (storedContribution) {
      const parsed = Number.parseFloat(storedContribution)
      if (!Number.isNaN(parsed)) {
        setContribution([parsed])
      }
    }

    if (storedRisk) {
      const parsedRisk = Number.parseFloat(storedRisk)
      if (!Number.isNaN(parsedRisk)) {
        setRisk([parsedRisk])
      }
    }
  }, [contributionKey, open, riskKey])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(contributionKey, String(contribution[0]))
  }, [contribution, contributionKey])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(riskKey, String(risk[0]))
  }, [risk, riskKey])

  useEffect(() => {
    if (!hasTracked.current) {
      hasTracked.current = true
      return
    }
    trackPreferenceSlider({ sliderId: "goal-planner:monthly-contribution", label: goal.name, values: contribution })
  }, [contribution, goal.name])

  useEffect(() => {
    if (!hasTracked.current) {
      return
    }
    trackPreferenceSlider({ sliderId: "goal-planner:risk-level", label: goal.name, values: risk })
  }, [goal.name, risk])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${goal.bgColor}`}>
              <goal.icon className={`h-5 w-5 ${goal.color}`} />
            </div>
            <DialogTitle className="text-xl">{goal.name}</DialogTitle>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contributions">Contributions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Progress</span>
                <span className="text-sm font-medium">
                  {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                </span>
              </div>
              <Progress value={goal.percent} className="h-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">{goal.percent}% Complete</span>
                <span className="text-muted-foreground">ETA: {goal.eta}</span>
              </div>
            </div>

            <div className="rounded-lg border bg-blue-500/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Predicted Completion</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Based on your current contribution rate of {formatCurrency(goal.monthlyTarget)}/month, you&#39;ll reach your goal
                    by <span className="font-medium text-foreground">{formattedPredictedDate}</span>
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="bg-background">
                      {monthsRemaining} months remaining
                    </Badge>
                    <Badge variant="outline" className="bg-background">
                      {formatCurrency(goal.target - goal.current)} to go
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Target</p>
                <p className="text-lg font-semibold">{formatCurrency(goal.monthlyTarget)}/mo</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Funding Source</p>
                <p className="text-lg font-semibold">{goal.fundingSource}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-lg font-semibold">{formatCurrency(goal.target - goal.current)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Monthly Growth</p>
                <p className="text-lg font-semibold text-[var(--color-positive)]">
                  {formatCurrency(goal.monthlyTarget, { signDisplay: "always" })}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <h3 className="font-semibold">Savings Projection</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Historical contributions and projected growth to reach ${goal.target.toLocaleString()}
              </p>
              <div className="h-64 w-full rounded-lg border p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={contributionData}>
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
                    <ReferenceLine
                      y={goal.target}
                      stroke="hsl(var(--muted-foreground))"
                      strokeDasharray="3 3"
                      label={{ value: "Target", position: "right", fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="hsl(217, 91%, 60%)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Actual"
                    />
                    <Line
                      type="monotone"
                      dataKey="projected"
                      stroke="hsl(217, 91%, 60%)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Projected"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contributions" className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Recent Contributions</h3>
              <p className="text-sm text-muted-foreground">Your contribution history for this goal</p>
            </div>

            <div className="space-y-2">
              {recentContributions.map((contribution, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                      <DollarSign className="h-4 w-4 text-[var(--color-positive)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{formatCurrency(contribution.amount)}</p>
                      <p className="text-xs text-muted-foreground">{contribution.source}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{contribution.date}</span>
                </div>
              ))}
            </div>

            <Button className="w-full">
              <DollarSign className="mr-2 h-4 w-4" />
              Make One-Time Contribution
            </Button>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Target Amount</h3>
                  <p className="text-sm text-muted-foreground">Adjust your savings goal</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsEditingTarget(!isEditingTarget)}>
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditingTarget ? "Cancel" : "Edit"}
                </Button>
              </div>

              {isEditingTarget ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="new-target">New Target Amount</Label>
                    <Input
                      id="new-target"
                      type="number"
                      value={newTarget}
                      onChange={(e) => setNewTarget(e.target.value)}
                      placeholder="30000"
                    />
                  </div>
                  <Button className="w-full" onClick={() => setIsEditingTarget(false)}>
                    <TargetIcon className="mr-2 h-4 w-4" />
                    Update Target
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border p-4">
                  <p className="text-2xl font-bold">{formatCurrency(goal.target)}</p>
                </div>
              )}
            </div>

            <div className="space-y-6 rounded-lg border p-4">
              <SliderField
                label="Monthly contribution"
                description="Adjust to see how faster contributions change your goal date."
                value={contribution}
                onValueChange={setContribution}
                min={0}
                max={goal.monthlyTarget * 3}
                step={50}
                formatValue={(values) => formatCurrency(values[0])}
              />
              <SliderField
                label="Risk preference"
                description="Higher risk assumes more aggressive growth and more volatility."
                value={risk}
                onValueChange={setRisk}
                min={1}
                max={10}
                step={1}
                formatValue={(values) => `${values[0]}/10`}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Funding Source</h3>
                  <p className="text-sm text-muted-foreground">Change the account linked to this goal</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsEditingAccount(!isEditingAccount)}>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  {isEditingAccount ? "Cancel" : "Change"}
                </Button>
              </div>

              {isEditingAccount ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="funding-source">Select Account</Label>
                    <Select value={newAccount} onValueChange={setNewAccount}>
                      <SelectTrigger id="funding-source">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High-Yield Savings">High-Yield Savings</SelectItem>
                        <SelectItem value="Checking Account">Checking Account</SelectItem>
                        <SelectItem value="Investment Account">Investment Account</SelectItem>
                        <SelectItem value="529 Plan">529 Plan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={() => setIsEditingAccount(false)}>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Update Funding Source
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border p-4">
                  <p className="font-medium">{goal.fundingSource}</p>
                  <p className="text-sm text-muted-foreground">Current balance: {formatCurrency(45230)}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-semibold">Linked Accounts</h3>
                <p className="text-sm text-muted-foreground">Choose which accounts contribute to this goal</p>
              </div>

              <div className="grid gap-2">
                {[
                  { name: "High-Yield Savings", balance: 32000 },
                  { name: "Checking Account", balance: 14500 },
                ].map((account) => (
                  <div key={account.name} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-xs text-muted-foreground">Balance: {formatCurrency(account.balance)}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Manage
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
