"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Target, PartyPopper } from "lucide-react"
import { motion } from "framer-motion"

interface GoalCelebrationProps {
  milestone: 25 | 50 | 75 | 100
  goalName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const milestoneConfig = {
  25: {
    icon: Star,
    title: "Great Start!",
    message: "You've reached 25% of your goal",
    color: "text-yellow-600",
    bgColor: "bg-yellow-500/10",
  },
  50: {
    icon: Target,
    title: "Halfway There!",
    message: "You've reached the halfway point",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  75: {
    icon: PartyPopper,
    title: "Almost There!",
    message: "You've reached 75% of your goal",
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
  },
  100: {
    icon: Trophy,
    title: "Goal Achieved!",
    message: "Congratulations on reaching your goal",
    color: "text-green-600",
    bgColor: "bg-green-500/10",
  },
}

export function GoalCelebration({ milestone, goalName, open, onOpenChange }: GoalCelebrationProps) {
  const config = milestoneConfig[milestone]
  const Icon = config.icon

  useEffect(() => {
    if (open) {
      // Trigger confetti animation
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="flex flex-col items-center text-center space-y-6 py-6"
        >
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", delay: 0.2, duration: 0.8 }}
            className={`flex h-24 w-24 items-center justify-center rounded-full ${config.bgColor}`}
          >
            <Icon className={`h-12 w-12 ${config.color}`} />
          </motion.div>

          <div className="space-y-2">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold"
            >
              {config.title}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground"
            >
              {config.message}
            </motion.p>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg font-semibold"
            >
              {goalName}
            </motion.p>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full"
          >
            <Button className="w-full" onClick={() => onOpenChange(false)}>
              Continue
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
