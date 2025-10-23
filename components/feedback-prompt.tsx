"use client"

import { useEffect, useState } from "react"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { trackFeedbackRequested, trackFeedbackSubmitted } from "@/lib/analytics/events"
import { toast } from "@/components/ui/sonner"

const ratingOptions: Array<{ label: string; value: number }> = [
  { value: 5, label: "Exceptional clarity" },
  { value: 4, label: "Helpful" },
  { value: 3, label: "Neutral" },
  { value: 2, label: "Needs work" },
  { value: 1, label: "Confusing" },
]

interface FeedbackPromptProps {
  surface: string
  open: boolean
  onOpenChange: (open: boolean) => void
  context?: string
  defaultRating?: number
}

export function FeedbackPrompt({ surface, open, onOpenChange, context, defaultRating }: FeedbackPromptProps) {
  const [rating, setRating] = useState<number | null>(defaultRating ?? null)
  const [note, setNote] = useState("")

  useEffect(() => {
    if (open) {
      trackFeedbackRequested({ surface })
      setRating(defaultRating ?? null)
      setNote("")
    }
  }, [defaultRating, open, surface])

  const handleSubmit = () => {
    trackFeedbackSubmitted({ surface, rating: rating ?? undefined, comment: note })
    toast.success("Thanks for the signal", {
      description: "We use your feedback to rank future insights and automations.",
    })
    onOpenChange(false)
  }

  const handleSkip = () => {
    trackFeedbackSubmitted({ surface, skipped: true })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">How did this feel?</DialogTitle>
          <DialogDescription>
            Share a quick pulse so we can tune recommendations. Your response is tied to <Badge variant="secondary">{surface}</Badge>
            {context ? ` • ${context}` : null}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid gap-2">
            <p className="text-xs uppercase text-muted-foreground">Confidence rating</p>
            <div className="flex flex-wrap gap-2">
              {ratingOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={rating === option.value ? "default" : "outline"}
                  size="sm"
                  className="justify-start px-3 text-left text-xs"
                  onClick={() => setRating(option.value)}
                >
                  <span className="font-semibold">{option.value}</span>
                  <span className="ml-2 text-muted-foreground">{option.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase text-muted-foreground">What stood out?</p>
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Quick bullet on what we should keep or adjust"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:gap-3">
          <Button variant="ghost" type="button" onClick={handleSkip} className="sm:order-1">
            Skip for now
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={rating === null && note.trim().length === 0}>
            Submit feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
