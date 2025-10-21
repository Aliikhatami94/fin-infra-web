"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target, Home, Plane, GraduationCap } from "lucide-react"

const goals = [
  {
    id: 1,
    name: "Emergency Fund",
    icon: Target,
    current: 18000,
    target: 30000,
    percent: 60,
    eta: "8 months",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 2,
    name: "House Down Payment",
    icon: Home,
    current: 25000,
    target: 100000,
    percent: 25,
    eta: "3.5 years",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    id: 3,
    name: "Vacation Fund",
    icon: Plane,
    current: 4500,
    target: 8000,
    percent: 56,
    eta: "6 months",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    id: 4,
    name: "Education Fund",
    icon: GraduationCap,
    current: 12000,
    target: 50000,
    percent: 24,
    eta: "5 years",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/10",
  },
]

export function GoalsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {goals.map((goal) => (
        <Card key={goal.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${goal.bgColor}`}>
                <goal.icon className={`h-6 w-6 ${goal.color}`} />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground">{goal.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    ${goal.current.toLocaleString()} of ${goal.target.toLocaleString()}
                  </p>
                </div>
                <Progress value={goal.percent} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">{goal.percent}% complete</span>
                  <span className="text-muted-foreground">ETA: {goal.eta}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
