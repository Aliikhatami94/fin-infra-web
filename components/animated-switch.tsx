"use client"

import type { ButtonHTMLAttributes, KeyboardEvent, MouseEvent } from "react"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface AnimatedSwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function AnimatedSwitch({
  checked,
  onCheckedChange,
  className,
  onClick,
  onKeyDown,
  type = "button",
  ...props
}: AnimatedSwitchProps) {
  const toggle = () => {
    onCheckedChange(!checked)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault()
      toggle()
    }
  }

  return (
    <button
      type={type}
      role="switch"
      aria-checked={checked}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          event.preventDefault()
          toggle()
        }
      }}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative inline-flex h-6 w-11 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-muted",
        className,
      )}
      {...props}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(
          "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background shadow-sm",
          checked && "translate-x-5",
        )}
      />
    </button>
  )
}
