"use client"

import { differenceInCalendarDays, parseISO } from "date-fns"
import { useMemo } from "react"
import {
  AlarmClock,
  CheckCircle2,
  ClipboardList,
  Clock,
  MoreHorizontal,
  CalendarClock,
  BellRing,
} from "lucide-react"

import { useWorkspace } from "@/components/workspace-provider"
import { AssignmentMenu } from "@/components/assignment-menu"
import { CollaborationDrawer } from "@/components/collaboration-drawer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/components/ui/sonner"

interface AccountabilityChecklistProps {
  surface: "overview" | "documents"
}

export function AccountabilityChecklist({ surface }: AccountabilityChecklistProps) {
  const { tasks, activeWorkspace, updateTaskStatus, snoozeTask, dismissTask, getAssignee } = useWorkspace()

  const now = new Date()
  const relevantTasks = tasks
    .filter((task) =>
      task.workspaceId === activeWorkspace.id &&
      (task.surfaces.includes(surface) || task.surfaces.includes("global")) &&
      !task.dismissedAt,
    )
    .map((task) => {
      const effectiveDueDate = parseISO(task.snoozedUntil ?? task.dueDate)
      return {
        ...task,
        effectiveDueDate,
        dueInDays: differenceInCalendarDays(effectiveDueDate, now),
        isSnoozed: !!task.snoozedUntil && differenceInCalendarDays(effectiveDueDate, now) > 0,
      }
    })

  const memberMap = useMemo(
    () => new Map(activeWorkspace.members.map((member) => [member.id, member])),
    [activeWorkspace.members],
  )

  const overdueTasks = relevantTasks
    .filter((task) => task.dueInDays < 0 || task.status === "overdue")
    .sort((a, b) => a.effectiveDueDate.getTime() - b.effectiveDueDate.getTime())

  const upcomingTasks = relevantTasks
    .filter((task) => !overdueTasks.includes(task))
    .sort((a, b) => a.effectiveDueDate.getTime() - b.effectiveDueDate.getTime())

  const handleSnooze = (taskId: string, days: number) => {
    const target = new Date()
    target.setDate(target.getDate() + days)
    snoozeTask(taskId, target.toISOString())
  }

  const handleClearSnooze = (taskId: string) => {
    snoozeTask(taskId, null)
  }

  const handleDismiss = (taskId: string) => {
    dismissTask(taskId, true)
  }

  const renderTask = (task: (typeof relevantTasks)[number]) => {
    const overdue = overdueTasks.includes(task)
    const dueSoon = task.dueInDays <= 2 && task.dueInDays >= 0
    const isCompleted = task.status === "completed"
    const snoozedUntil = task.snoozedUntil ? parseISO(task.snoozedUntil) : null
    const explicitAssignee = task.assignedTo ? memberMap.get(task.assignedTo) ?? null : null
    const resolvedAssignee = explicitAssignee ?? getAssignee(task.entityType, task.entityId)
    const dueDateLabel = task.effectiveDueDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    const dueDescriptor = overdue
      ? `${Math.abs(task.dueInDays)} day${Math.abs(task.dueInDays) === 1 ? "" : "s"} past due`
      : task.dueInDays === 0
        ? "Due today"
        : `Due in ${task.dueInDays} day${task.dueInDays === 1 ? "" : "s"}`
    const reminderTargetName = resolvedAssignee?.name?.split(" ")[0] ?? activeWorkspace.name.split(" ")[0]

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
            {task.isSnoozed && !overdue && <Badge variant="outline">Snoozed</Badge>}
            {isCompleted && <Badge variant="outline" className="border-primary text-primary">Completed</Badge>}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className={cn("flex items-center gap-1", overdue && "text-destructive")}
              aria-label={`Due ${dueDateLabel}${overdue ? `, ${dueDescriptor}` : ""}`}
            >
              <CalendarClock className="h-3.5 w-3.5" aria-hidden />
              <span>
                Due {dueDateLabel}
                <span className="ml-1 text-muted-foreground/80">({dueDescriptor})</span>
              </span>
            </span>
            {task.isSnoozed && snoozedUntil && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Snoozed until {snoozedUntil.toLocaleDateString()}
              </span>
            )}
            <span className="flex items-center gap-1">
              <AlarmClock className="h-3.5 w-3.5" />
              {task.reminder}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <Avatar className="h-6 w-6 border border-border/40 bg-background">
                <AvatarFallback className="text-[10px]">
                  {resolvedAssignee?.avatarFallback ?? "?"}
                </AvatarFallback>
              </Avatar>
              <span>
                {resolvedAssignee ? (
                  <>
                    Assigned to <span className="font-medium text-foreground">{resolvedAssignee.name}</span>
                  </>
                ) : (
                  <span className="font-medium text-foreground">Unassigned</span>
                )}
              </span>
              <AssignmentMenu
                entityId={task.entityId}
                entityType={task.entityType}
                variant="ghost"
                showLabel={false}
              />
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() =>
                toast.success("Reminder scheduled", {
                  description: `${reminderTargetName} will get a nudge (${task.reminder.toLowerCase()}).`,
                })
              }
            >
              <BellRing className="mr-2 h-4 w-4" />
              Send reminder
            </Button>
            <Button
              size="sm"
              variant={isCompleted ? "outline" : "secondary"}
              className="rounded-full"
              onClick={() => updateTaskStatus(task.id, isCompleted ? "pending" : "completed")}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {isCompleted ? "Reopen" : "Complete"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <MoreHorizontal className="h-4 w-4" aria-hidden />
                  <span className="sr-only">Task options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onSelect={(event) => event.preventDefault()} disabled>
                  {task.effectiveDueDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSnooze(task.id, 1)}>Snooze 1 day</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSnooze(task.id, 7)}>Snooze 1 week</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSnooze(task.id, 30)}>Snooze 30 days</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleClearSnooze(task.id)} disabled={!task.snoozedUntil}>
                  Clear snooze
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onSelect={() => handleDismiss(task.id)}>
                  Dismiss task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
  }

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
      <CardContent className="space-y-6">
        {overdueTasks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-destructive">Overdue</p>
              <span className="text-xs text-muted-foreground">{overdueTasks.length} task(s)</span>
            </div>
            <div className="space-y-3">{overdueTasks.map(renderTask)}</div>
          </div>
        )}
        {upcomingTasks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">On deck</p>
              <span className="text-xs text-muted-foreground">{upcomingTasks.length} task(s)</span>
            </div>
            <div className="space-y-3">{upcomingTasks.map(renderTask)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
