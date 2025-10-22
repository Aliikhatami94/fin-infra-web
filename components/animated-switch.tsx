"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedSwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  id?: string
}

export function AnimatedSwitch({ checked, onCheckedChange, id }: AnimatedSwitchProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-muted",
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(
          "absolute h-5 w-5 bg-background rounded-full shadow-sm top-0.5 left-0.5",
          checked && "translate-x-5",
        )}
      />
    </button>
  )
}
