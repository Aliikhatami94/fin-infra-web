"use client"

import { differenceInCalendarDays, parseISO } from "date-fns"
import { AlarmClock, CheckCircle2, ClipboardList, Clock } from "lucide-react"

import { useWorkspace } from "@/components/workspace-provider"
import { AssignmentMenu } from "@/components/assignment-menu"
import { CollaborationDrawer } from "@/components/collaboration-drawer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AccountabilityChecklistProps {
  surface: "overview" | "documents"
}

export function AccountabilityChecklist({ surface }: AccountabilityChecklistProps) {
  const { tasks, activeWorkspace, updateTaskStatus } = useWorkspace()

  const relevantTasks = tasks.filter((task) =>
    task.workspaceId === activeWorkspace.id && (task.surfaces.includes(surface) || task.surfaces.includes("global")),
  )

  if (relevantTasks.length === 0) {
    return null
  }

  return (
    <Card className="card-standard">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Shared accountability</CardTitle>
            <CardDescription>
              Keep bills, document uploads, and follow-ups visible to everyone in {activeWorkspace.name}.
            </CardDescription>
          </div>
          <ClipboardList className="h-5 w-5 text-muted-foreground" aria-hidden />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {relevantTasks.map((task) => {
          const dueInDays = differenceInCalendarDays(parseISO(task.dueDate), new Date())
          const overdue = dueInDays < 0 || task.status === "overdue"
          const dueSoon = dueInDays <= 2 && dueInDays >= 0
          const isCompleted = task.status === "completed"

          return (
            <div
              key={task.id}
              className={cn(
                "flex flex-col gap-3 rounded-xl border border-border/40 bg-muted/10 p-4 transition-colors md:flex-row md:items-center md:gap-4",
                overdue && "border-destructive/40 bg-destructive/5",
                isCompleted && "border-primary/30 bg-primary/5",
              )}
            >
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
                  {task.label}
                  {overdue && <Badge variant="destructive">Overdue</Badge>}
                  {dueSoon && !overdue && <Badge variant="secondary">Due soon</Badge>}
                  {isCompleted && <Badge variant="outline" className="border-primary text-primary">Completed</Badge>}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <AlarmClock className="h-3.5 w-3.5" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {task.reminder}
                  </span>
                  <AssignmentMenu entityId={task.entityId} entityType={task.entityType} showLabel />
                </div>
              </div>
              <div className="flex flex-col gap-2 md:items-end">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={isCompleted ? "outline" : "secondary"}
                    className="rounded-full"
                    onClick={() => updateTaskStatus(task.id, isCompleted ? "pending" : "completed")}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {isCompleted ? "Reopen" : "Complete"}
                  </Button>
                  <CollaborationDrawer
                    entityId={task.entityId}
                    entityType={task.entityType}
                    entityName={task.label}
                    triggerLabel="Discuss"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
