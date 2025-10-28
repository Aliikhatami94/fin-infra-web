"use client"

import { useState, useEffect } from "react"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/sonner"

export function GlobalFeedbackTrigger() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false)

  // Detect when chat sidebar is open to hide feedback button and avoid overlap
  useEffect(() => {
    const checkSidebar = () => {
      const sidebar = document.querySelector('[data-chat-sidebar]')
      setChatSidebarOpen(!!sidebar)
    }
    
    // Initial check
    checkSidebar()
    
    // Use MutationObserver to detect DOM changes
    const observer = new MutationObserver(() => {
      // Small delay to sync with Framer Motion exit animation
      requestAnimationFrame(checkSidebar)
    })
    observer.observe(document.body, { childList: true, subtree: true })
    
    // Also listen for animation/transition events
    const handleTransition = () => requestAnimationFrame(checkSidebar)
    document.addEventListener('transitionend', handleTransition)
    document.addEventListener('animationend', handleTransition)
    
    return () => {
      observer.disconnect()
      document.removeEventListener('transitionend', handleTransition)
      document.removeEventListener('animationend', handleTransition)
    }
  }, [])

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
      {!chatSidebarOpen && (
        <div className="fixed bottom-6 right-6 z-[100] lg:hidden">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="h-12 w-12 rounded-full shadow-lg"
                aria-label="Give feedback"
                onClick={() => setOpen(true)}
                disabled={open}
                aria-expanded={open}
              >
                <HelpCircle className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Feedback</TooltipContent>
          </Tooltip>
        </div>
      )}

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
