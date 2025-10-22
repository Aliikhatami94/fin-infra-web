"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  Home,
  Plane,
  GraduationCap,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Pause,
  CheckCircle2,
  Edit,
  Plus,
  Link,
} from "lucide-react"
import { motion } from "framer-motion"
import { GoalDetailModal } from "./goal-detail-modal"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { goals } from "@/lib/mock"

function CircularProgress({
  percent,
  size = 120,
  strokeWidth = 8,
}: { percent: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percent / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        className="text-muted/20"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={
          percent >= 100
            ? "text-green-500"
            : percent >= 75
              ? "text-blue-500"
              : percent >= 50
                ? "text-yellow-500"
                : "text-orange-500"
        }
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
    </svg>
  )
}

export function GoalsGrid() {
  const [selectedGoal, setSelectedGoal] = useState<(typeof goals)[0] | null>(null)

  const activeGoals = goals.filter((g) => g.status === "active")
  const pausedGoals = goals.filter((g) => g.status === "paused")
  const completedGoals = goals.filter((g) => g.status === "completed")

  const renderGoalCard = (goal: (typeof goals)[0], index: number) => (
    <motion.div key={goal.id} {...createStaggeredCardVariants(index, 0)}>
      <Card className="card-standard card-lift cursor-pointer group" onClick={() => setSelectedGoal(goal)}>
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="relative shrink-0">
              <CircularProgress percent={goal.percent} size={100} strokeWidth={6} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <goal.icon className={`h-6 w-6 ${goal.color} mb-1`} />
                <span className="text-lg font-bold">{goal.percent}%</span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{goal.name}</h3>
                    {goal.status === "completed" && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Complete
                      </Badge>
                    )}
                    {goal.status === "paused" && (
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-200">
                        <Pause className="h-3 w-3 mr-1" />
                        Paused
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold tabular-nums">
                    ${goal.current.toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      / ${goal.target.toLocaleString()}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">Target: {goal.eta}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Adjust Target</DropdownMenuItem>
                    <DropdownMenuItem>Make One-Time Contribution</DropdownMenuItem>
                    <DropdownMenuItem>{goal.status === "paused" ? "Resume Goal" : "Pause Goal"}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {goal.status === "active" && goal.acceleration !== 0 && (
                <div
                  className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
                    goal.acceleration > 0
                      ? "bg-green-500/10 text-green-700 dark:text-green-400"
                      : "bg-red-500/10 text-red-700 dark:text-red-400"
                  }`}
                >
                  {goal.acceleration > 0 ? (
                    <TrendingUp className="h-4 w-4 shrink-0" />
                  ) : (
                    <TrendingDown className="h-4 w-4 shrink-0" />
                  )}
                  <span className="text-xs">
                    {goal.acceleration > 0
                      ? `You're ahead of schedule by ${Math.abs(goal.acceleration)} months`
                      : `You're behind schedule by ${Math.abs(goal.acceleration)} months`}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit Goal
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Funds
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <Link className="h-3 w-3" />
                </Button>
              </div>

              {/* Funding source info */}
              {goal.status === "active" && (
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>Funded by: {goal.fundingSource}</span>
                  <span className="font-medium text-foreground">${goal.monthlyTarget}/mo</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <>
      <Accordion type="multiple" defaultValue={["active", "completed"]} className="space-y-4">
        <AccordionItem value="active" className="border-none">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            Active Goals ({activeGoals.length})
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-6 md:grid-cols-2 pt-4">
              {activeGoals.map((goal, index) => renderGoalCard(goal, index))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {pausedGoals.length > 0 && (
          <AccordionItem value="paused" className="border-none">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              On Hold ({pausedGoals.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-6 md:grid-cols-2 pt-4">
                {pausedGoals.map((goal, index) => renderGoalCard(goal, index))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {completedGoals.length > 0 && (
          <AccordionItem value="completed" className="border-none">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Fully Funded ({completedGoals.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-6 md:grid-cols-2 pt-4">
                {completedGoals.map((goal, index) => renderGoalCard(goal, index))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {selectedGoal && (
        <GoalDetailModal
          goal={selectedGoal}
          open={!!selectedGoal}
          onOpenChange={(open) => !open && setSelectedGoal(null)}
        />
      )}
    </>
  )
}
