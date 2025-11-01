"use client"

import type React from "react"

import { useMemo } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Monitor, Moon, Sun } from "lucide-react"
import { cardHoverVariants } from "@/lib/motion-variants"

type ThemeOption = "light" | "dark" | "system"

export function ThemeSelector() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const activeTheme = (theme ?? "system") as ThemeOption

  const themes: { value: ThemeOption; label: string; icon: React.ReactNode; description: string }[] = useMemo(
    () => [
      {
        value: "light" as const,
        label: "Daylight",
        icon: <Sun className="h-4 w-4" />,
        description: "Bright whites with muted neutrals.",
      },
      {
        value: "dark" as const,
        label: "Midnight",
        icon: <Moon className="h-4 w-4" />,
        description: "High-contrast panels for low light.",
      },
      {
        value: "system" as const,
        label: "System",
        icon: <Monitor className="h-4 w-4" />,
        description: `Follows your OS preference (${resolvedTheme ?? "auto"}).`,
      },
    ],
    [resolvedTheme],
  )

  return (
    <div className="grid gap-2 sm:gap-3 grid-cols-3">
      {themes.map((option) => (
        <motion.button
          key={option.value}
          {...cardHoverVariants}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => setTheme(option.value)}
          aria-pressed={activeTheme === option.value}
          className={cn(
            "relative flex h-full flex-col items-start gap-2 rounded-lg border p-2 sm:p-3 text-left transition-all",
            activeTheme === option.value
              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
              : "border-border/50 hover:border-border/80 hover:bg-muted/20",
          )}
        >
          <div
            className={cn(
              "flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-muted/50",
              activeTheme === option.value && "bg-primary/10 text-primary",
            )}
          >
            {option.icon}
          </div>
          <div className="space-y-0 sm:space-y-0.5">
            <span className="text-xs sm:text-sm font-medium text-foreground">{option.label}</span>
            <p className="text-[0.65rem] sm:text-xs text-muted-foreground hidden sm:block leading-tight">{option.description}</p>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
