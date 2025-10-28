"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/sonner"

export function GlobalFeedbackTrigger() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Listen for custom event to open feedback dialog from anywhere (e.g., sidebar)
  useEffect(() => {
    const handleOpenFeedback = () => setOpen(true)
    window.addEventListener('openFeedbackDialog', handleOpenFeedback)
    return () => window.removeEventListener('openFeedbackDialog', handleOpenFeedback)
  }, [])

  const reset = () => {
    setName("")
    setEmail("")
    setMessage("")
  }

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Please enter your feedback message.")
      return
    }
    setSubmitting(true)
    try {
      // No backend here; simulate submission and log to console for now
      // In production, wire this to an API route or third-party form endpoint
      console.info("Feedback submitted", { name, email, message })
      await new Promise((r) => setTimeout(r, 600))
      toast.success("Thanks for the feedback!")
      setOpen(false)
      reset()
    } catch (e) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Feedback trigger button is now in the sidebar, so this is hidden.
          Keep the dialog component here for the custom event system to work. */}

      {/* Modal dialog to guarantee overlay backdrop and darkening */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send feedback</DialogTitle>
            <DialogDescription>
              We love hearing from you. Share a bug, idea, or anything that could make this better.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="fb-name">Name (optional)</Label>
              <Input id="fb-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fb-email">Email (optional)</Label>
              <Input id="fb-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fb-message">Message</Label>
              <Textarea
                id="fb-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind"
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Sending…" : "Send feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default GlobalFeedbackTrigger
