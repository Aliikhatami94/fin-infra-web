"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SuccessCelebrationDialogProps {
  open: boolean
  title: string
  description: string
  detail?: string
  actionLabel?: string
  onOpenChange: (open: boolean) => void
  onAction?: () => void
}

const confetti = Array.from({ length: 18 }).map((_, index) => ({
  id: index,
  delay: index * 0.04,
  rotate: (index % 2 === 0 ? 1 : -1) * (8 + index * 1.5),
  hue: 200 + (index % 5) * 18,
  top: `${(index * 37) % 100}%`,
  left: `${(index * 53) % 100}%`,
}))

function CelebrationBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl bg-[var(--surface-wealth)]">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/40 via-transparent to-transparent dark:from-white/10" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/30 via-transparent to-transparent dark:from-white/10" />
    </div>
  )
}

function ConfettiLayer() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {confetti.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute h-2 w-6 rounded-full opacity-0"
          style={{
            top: piece.top,
            left: piece.left,
            background: `linear-gradient(135deg, hsl(${piece.hue}, 95%, 65%), hsl(${piece.hue + 20}, 90%, 55%))`,
          }}
          initial={{ y: -12, opacity: 0 }}
          animate={{
            y: 12,
            opacity: [0, 1, 0],
            rotate: piece.rotate,
          }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            delay: piece.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

function SuccessCelebrationDialogComponent({
  open,
  title,
  description,
  detail,
  actionLabel = "View documents",
  onOpenChange,
  onAction,
}: SuccessCelebrationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden border-none p-0 text-left shadow-[var(--shadow-bold)]">
        <div className="relative p-8">
          <CelebrationBackdrop />
          <ConfettiLayer />
          <div className="relative z-10 space-y-4 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <Sparkles className="h-3.5 w-3.5" />
              Success
            </div>
            <DialogHeader className="space-y-2 text-white">
              <DialogTitle className="text-2xl font-semibold leading-tight text-white">{title}</DialogTitle>
              <DialogDescription className="text-sm text-white/90">
                {description}
              </DialogDescription>
              {detail ? <p className="text-xs text-white/80">{detail}</p> : null}
            </DialogHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                size="sm"
                className="rounded-full bg-white text-primary hover:bg-white/90"
                onClick={() => {
                  onAction?.()
                  onOpenChange(false)
                }}
              >
                {actionLabel}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => onOpenChange(false)}
              >
                Keep organizing
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const SuccessCelebrationDialog = memo(SuccessCelebrationDialogComponent)
