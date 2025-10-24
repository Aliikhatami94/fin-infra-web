"use client"

import { useState } from "react"
import { CalendarCheck, Check, PiggyBank } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface ReviewSavingsPlanButtonProps {
  className?: string
}

export function ReviewSavingsPlanButton({ className }: ReviewSavingsPlanButtonProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={cn("text-xs", className)}>
          Review savings plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">Emergency fund plan</DialogTitle>
          <DialogDescription>
            Stay on track to reach a 6-month cushion. Review the upcoming transfers and make quick tweaks before they run.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-2">
          <div className="rounded-lg border bg-muted/40 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <PiggyBank className="h-4 w-4 text-primary" aria-hidden="true" />
                Emergency fund progress
              </div>
              <Badge variant="secondary" className="gap-1 text-xs">
                <Check className="h-3 w-3" aria-hidden="true" />
                On track
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              <Progress value={78} aria-label="Emergency fund is 78 percent funded" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>4.7 months saved</span>
                <span>Goal: 6 months</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Next automatic transfer</p>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <CalendarCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-foreground">$400 to High-Yield Savings</p>
                  <p className="text-muted-foreground">Scheduled for July 15 via Plaid automation</p>
                </div>
              </div>
              <Separator className="my-4" />
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                  Keep your monthly transfer to finish the goal in 5 weeks.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                  Optional: add a one-time $200 boost from checking to reach the goal sooner.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm} className="gap-2">
            <Check className="h-4 w-4" aria-hidden="true" />
            Confirm adjustments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
