"use client"

import { differenceInCalendarDays, parseISO } from "date-fns"
import { useMemo, useState } from "react"
import {
  AlarmClock,
  BellRing,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock,
  MessageSquare,
  MoreHorizontal,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { TaskRescheduleDialog } from "@/components/task-reschedule-dialog"
import { formatDueDateWithRelative, formatDate } from "@/lib/format"
import type { AccountabilityTask } from "@/types/domain"

type ChecklistTask = AccountabilityTask & {
  effectiveDueDate: Date
  dueInDays: number
  isSnoozed: boolean
}

type ConfirmationState = {
  title: string
  description?: string
  confirmLabel?: string
  confirmVariant?: "default" | "secondary" | "destructive"
  onConfirm: () => void
}

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
      } as ChecklistTask
    })

  const memberMap = useMemo(
    () => new Map(activeWorkspace.members.map((member) => [member.id, member])),
    [activeWorkspace.members],
  )

  const [confirmation, setConfirmation] = useState<ConfirmationState | null>(null)
  const [rescheduleTask, setRescheduleTask] = useState<ChecklistTask | null>(null)
  const [openDiscussionTaskId, setOpenDiscussionTaskId] = useState<string | null>(null)

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

  const renderTask = (task: ChecklistTask) => {
    const overdue = overdueTasks.includes(task)
    const dueSoon = task.dueInDays <= 2 && task.dueInDays >= 0
    const isCompleted = task.status === "completed"
    const snoozedUntil = task.snoozedUntil ? parseISO(task.snoozedUntil) : null
    const explicitAssignee = task.assignedTo ? memberMap.get(task.assignedTo) ?? null : null
    const resolvedAssignee = explicitAssignee ?? getAssignee(task.entityType, task.entityId)
    const dueMeta = formatDueDateWithRelative(task.effectiveDueDate, { baseDate: now })
    const reminderTargetName = resolvedAssignee?.name?.split(" ")[0] ?? activeWorkspace.name.split(" ")[0]

    const openReminderConfirm = () =>
      setConfirmation({
        title: `Send reminder to ${reminderTargetName}?`,
        description: `${reminderTargetName} will get a nudge (${task.reminder.toLowerCase()}).`,
        confirmLabel: "Send reminder",
        confirmVariant: "secondary",
        onConfirm: () => {
          toast.success("Reminder scheduled", {
            description: `${reminderTargetName} will get a nudge (${task.reminder.toLowerCase()}).`,
          })
        },
      })

    const openCompletionConfirm = () => {
      if (isCompleted) {
        setConfirmation({
          title: `Reopen “${task.label}”?`,
          description: "The task will return to the active list and reminders resume.",
          confirmLabel: "Reopen task",
          onConfirm: () => updateTaskStatus(task.id, "pending"),
        })
      } else {
        setConfirmation({
          title: `Mark “${task.label}” as complete?`,
          description: "Completion archives the task for everyone, but you can reopen it later.",
          confirmLabel: "Mark complete",
          confirmVariant: "secondary",
          onConfirm: () => updateTaskStatus(task.id, "completed"),
        })
      }
    }

    const openDiscussionConfirm = () =>
      setConfirmation({
        title: `Discuss “${task.label}”?`,
        description: "Opens the shared notes drawer so the whole workspace sees the thread.",
        confirmLabel: "Open discussion",
        onConfirm: () => setOpenDiscussionTaskId(task.id),
      })

    return (
      <div
        key={task.id}
        className={cn(
          "flex flex-col gap-3 rounded-xl border border-border/40 bg-muted/10 p-4 transition-colors md:flex-row md:items-center md:gap-4",
          overdue && "border-amber-400/40 bg-amber-50/60 dark:border-amber-500/30 dark:bg-amber-900/20",
          isCompleted && "border-primary/30 bg-primary/5",
        )}
      >
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
            {task.label}
            {overdue && (
              <Badge className="border border-amber-400 bg-amber-100 text-amber-800 dark:border-amber-500/60 dark:bg-amber-900/40 dark:text-amber-200">
                Overdue
              </Badge>
            )}
            {dueSoon && !overdue && <Badge variant="secondary">Due soon</Badge>}
            {task.isSnoozed && !overdue && <Badge variant="outline">Snoozed</Badge>}
            {isCompleted && <Badge variant="outline" className="border-primary text-primary">Completed</Badge>}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className={cn("flex items-center gap-1", overdue && "text-amber-700 dark:text-amber-200")}
                    aria-label={`Due ${dueMeta.absolute} – ${dueMeta.relative}`}
                  >
                    <CalendarClock className="h-3.5 w-3.5" aria-hidden />
                    <span className="flex items-center gap-1">
                      <span>Due {dueMeta.absolute}</span>
                      <span className="text-muted-foreground/80">– {dueMeta.relative}</span>
                    </span>
                  </span>
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  <p className="font-medium text-foreground">Due {dueMeta.absoluteFull}</p>
                  <p className="text-muted-foreground">{dueMeta.relative}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="rounded-full" onClick={openReminderConfirm}>
              <BellRing className="mr-2 h-4 w-4" />
              Send reminder
            </Button>
            <Button size="sm" variant={isCompleted ? "outline" : "secondary"} className="rounded-full" onClick={openCompletionConfirm}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {isCompleted ? "Reopen" : "Complete"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => setRescheduleTask(task)}
            >
              <CalendarClock className="mr-2 h-4 w-4" />
              Reschedule
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
            <Button variant="ghost" size="sm" className="gap-2 rounded-full" onClick={openDiscussionConfirm}>
              <MessageSquare className="h-4 w-4" />
              Discuss
            </Button>
            <CollaborationDrawer
              entityId={task.entityId}
              entityType={task.entityType}
              entityName={task.label}
              hideTrigger
              open={openDiscussionTaskId === task.id}
              onOpenChange={(open) => {
                if (!open) {
                  setOpenDiscussionTaskId((current) => (current === task.id ? null : current))
                }
              }}
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
    <>
      {confirmation && (
        <ConfirmDialog
          open
          title={confirmation.title}
          description={confirmation.description}
          confirmLabel={confirmation.confirmLabel}
          confirmVariant={confirmation.confirmVariant}
          onConfirm={confirmation.onConfirm}
          onOpenChange={(open) => {
            if (!open) {
              setConfirmation(null)
            }
          }}
        />
      )}
      {rescheduleTask && (
        <TaskRescheduleDialog
          open={!!rescheduleTask}
          onOpenChange={(open) => {
            if (!open) {
              setRescheduleTask(null)
            }
          }}
          taskLabel={rescheduleTask.label}
          currentDueDate={rescheduleTask.effectiveDueDate}
          initialSelection={rescheduleTask.snoozedUntil ? parseISO(rescheduleTask.snoozedUntil) : rescheduleTask.effectiveDueDate}
          onApply={(date) => {
            snoozeTask(rescheduleTask.id, date.toISOString())
            toast.success("Task rescheduled", {
              description: `Due on ${formatDate(date, { month: "long", day: "numeric", year: "numeric" })}`,
            })
          }}
          onClear={rescheduleTask.snoozedUntil ? () => {
            handleClearSnooze(rescheduleTask.id)
            toast.success("Snooze cleared", {
              description: "The task has been restored to its original due date.",
            })
          } : undefined}
        />
      )}
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
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">Overdue</p>
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
    </>
  )
}
