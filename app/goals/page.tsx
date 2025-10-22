"use client"

import { useState } from "react"
import { GoalsSummaryKPIs } from "@/components/goals-summary-kpis"
import { GoalsGrid } from "@/components/goals-grid"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

export default function GoalsPage() {
  const [showAddGoal, setShowAddGoal] = useState(false)

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Financial Goals</h1>
        <Button onClick={() => setShowAddGoal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </div>

      <GoalsSummaryKPIs />

      <GoalsGrid />

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
              <Button className="flex-1" onClick={() => setShowAddGoal(false)}>
                Create Goal
              </Button>
              <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
