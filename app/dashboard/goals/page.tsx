"use client"

import { useMemo, useState } from "react"
import { GoalsSummaryKPIs } from "@/components/goals-summary-kpis"
import { GoalsGrid } from "@/components/goals-grid"
import { GoalsAIInsights } from "@/components/goals-ai-insights"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { GoalRecommendations } from "@/components/goal-recommendations"
import { ErrorBoundary } from "@/components/error-boundary"
import { getGoals } from "@/lib/services/goals"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { toast } from "@/components/ui/sonner"

export default function GoalsPage() {
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [filter, setFilter] = useState<"all" | "active" | "paused" | "completed">("all")
  const [contributionBoost, setContributionBoost] = useState(0)
  const [confirmCreateGoal, setConfirmCreateGoal] = useState(false)
  const goals = useMemo(() => getGoals(), [])

  const activeGoals = useMemo(() => goals.filter((goal) => goal.status === "active"), [goals])
  const totalActiveContribution = useMemo(() => {
    return activeGoals.reduce((total, goal) => {
      const remaining = Math.max(goal.target - goal.current, 0)
      const baseline = goal.monthlyTarget > 0 ? goal.monthlyTarget : Math.max(remaining / 12, 1)
      return total + baseline
    }, 0)
  }, [activeGoals])

  const projectedMonthsSaved = useMemo(() => {
    if (totalActiveContribution === 0) return 0
    return Math.max(0, (contributionBoost * activeGoals.length) / (totalActiveContribution || 1))
  }, [activeGoals.length, contributionBoost, totalActiveContribution])

  const handleCreateGoal = () => {
    setConfirmCreateGoal(false)
    setShowAddGoal(false)
    toast.success("Goal created successfully", {
      description: "Your new savings goal is now active and tracking."
    })
  }

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto p-4 max-w-[1200px] px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-foreground">Financial Goals</h1>
            <Button onClick={() => setShowAddGoal(true)} className="hidden md:flex">
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10 py-6 space-y-6">
        <GoalsSummaryKPIs />

        <Card className="card-standard">
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Scenario planner</h2>
                <p className="text-sm text-muted-foreground">
                  Experiment with an extra monthly contribution and preview timeline impacts across active goals.
                </p>
              </div>
              <div className="w-full max-w-md space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="contribution-boost-input" className="text-sm">
                    Additional monthly contribution
                  </Label>
                  <Input
                    id="contribution-boost-input"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={500}
                    step={25}
                    value={contributionBoost}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value, 10)
                      if (!Number.isNaN(value)) {
                        setContributionBoost(Math.min(Math.max(value, 0), 500))
                      }
                    }}
                    className="w-full"
                  />
                </div>
                <Slider
                  value={[contributionBoost]}
                  min={0}
                  max={500}
                  step={25}
                  onValueChange={([value]) => setContributionBoost(value)}
                  aria-label="Additional monthly contribution slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$0</span>
                  <span className="font-medium text-foreground">${contributionBoost}</span>
                  <span>$500</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {contributionBoost === 0
                ? "No boost applied yet—drag the slider to explore acceleration scenarios."
                : `Applying an additional $${contributionBoost}/mo could save roughly ${projectedMonthsSaved.toFixed(1)} months across your active goals.`}
            </p>
          </CardContent>
        </Card>

        <ErrorBoundary feature="Goal insights">
          <GoalsAIInsights />
        </ErrorBoundary>

        <GoalRecommendations />

        <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">All Goals</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="paused">On Hold</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <GoalsGrid
          goals={goals}
          filter={filter}
          contributionBoost={contributionBoost}
          totalActiveContribution={totalActiveContribution}
        />

        <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>Set up a new savings goal and track your progress</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input id="goal-name" placeholder="e.g., Emergency Fund" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-target">Target Amount</Label>
                <Input id="goal-target" type="number" placeholder="30000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="funding-source">Funding Source</Label>
                <Select>
                  <SelectTrigger id="funding-source">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking Account</SelectItem>
                    <SelectItem value="savings">High-Yield Savings</SelectItem>
                    <SelectItem value="investment">Investment Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-target">Monthly Contribution</Label>
                <Input id="monthly-target" type="number" placeholder="500" />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => setConfirmCreateGoal(true)}>
                  Create Goal
                </Button>
                <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={confirmCreateGoal}
          onOpenChange={setConfirmCreateGoal}
          title="Create new savings goal?"
          description="This will set up automatic tracking for your new goal. You can adjust the target amount, contribution, and funding source at any time."
          confirmLabel="Create goal"
          onConfirm={handleCreateGoal}
        />
        </div>
      </motion.div>

      <Button
        size="lg"
        className="fixed bottom-24 right-5 z-50 h-14 w-14 rounded-full p-0 shadow-lg md:hidden"
        onClick={() => setShowAddGoal(true)}
        aria-label="Add goal"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </>
  )
}
