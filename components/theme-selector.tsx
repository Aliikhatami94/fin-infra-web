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
        label: "Match system",
        icon: <Monitor className="h-4 w-4" />,
        description: `Follows your OS preference (${resolvedTheme ?? "auto"}).`,
      },
    ],
    [resolvedTheme],
  )

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {themes.map((option) => (
        <motion.button
          key={option.value}
          {...cardHoverVariants}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => setTheme(option.value)}
          aria-pressed={activeTheme === option.value}
          className={cn(
            "relative flex h-full flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all",
            activeTheme === option.value
              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
              : "border-border/50 hover:border-border/80 hover:bg-muted/20",
          )}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full text-primary",
              option.value === "light"
                ? "bg-[radial-gradient(circle_at_top_left,var(--primary)/35,transparent_55%)]"
                : option.value === "dark"
                  ? "bg-[radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.75),transparent_60%)] text-white"
                  : "bg-[radial-gradient(circle_at_center,var(--accent)/30,transparent_70%)]",
            )}
          >
            {option.icon}
          </div>
          <div className="space-y-1">
            <span className="text-sm font-semibold text-foreground">{option.label}</span>
            <p className="text-xs text-muted-foreground">{option.description}</p>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
