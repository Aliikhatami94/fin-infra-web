"use client"

import { useEffect, useState } from "react"
import { addDays } from "date-fns"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { formatDate } from "@/lib/format"

interface TaskRescheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskLabel: string
  currentDueDate: Date
  initialSelection?: Date
  onApply: (date: Date) => void
  onClear?: () => void
}

export function TaskRescheduleDialog({
  open,
  onOpenChange,
  taskLabel,
  currentDueDate,
  initialSelection,
  onApply,
  onClear,
}: TaskRescheduleDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialSelection ?? currentDueDate)

  useEffect(() => {
    if (!open) return
    setSelectedDate(initialSelection ?? currentDueDate)
  }, [open, initialSelection, currentDueDate])

  const handleApply = () => {
    if (!selectedDate) return
    onApply(selectedDate)
    onOpenChange(false)
  }

  const handleQuickSelect = (days: number) => {
    const next = addDays(new Date(), days)
    setSelectedDate(next)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Reschedule “{taskLabel}”</DialogTitle>
          <DialogDescription>
            Choose a new date to follow up on this task. Current due date: {formatDate(currentDueDate, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            .
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => handleQuickSelect(1)}>
              Tomorrow
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleQuickSelect(3)}>
              In 3 days
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleQuickSelect(7)}>
              Next week
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleQuickSelect(30)}>
              Next month
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedDate(currentDueDate)}>
              Reset to due date
            </Button>
          </div>
          <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} initialFocus />
        </div>
        <DialogFooter className="pt-2">
          {onClear ? (
            <Button
              variant="ghost"
              onClick={() => {
                onClear()
                onOpenChange(false)
              }}
              className="justify-start"
              type="button"
            >
              Clear snooze
            </Button>
          ) : null}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={!selectedDate}>
              Apply new date
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
