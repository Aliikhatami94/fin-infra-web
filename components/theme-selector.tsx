"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Monitor, Moon, Sun } from "lucide-react"
import { cardHoverVariants } from "@/lib/motion-variants"

type Theme = "light" | "dark" | "system"

export function ThemeSelector() {
  const [selected, setSelected] = useState<Theme>("dark")

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
    { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {themes.map((theme) => (
        <motion.button
          key={theme.value}
          {...cardHoverVariants}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "rounded-lg border transition-all duration-300 p-4 flex flex-col items-center gap-3",
            selected === theme.value
              ? "border-primary ring-2 ring-primary/20 bg-muted/40"
              : "border-border/40 hover:border-border/80 hover:bg-muted/20",
          )}
          onClick={() => setSelected(theme.value)}
        >
          <div
            className={cn(
              "w-full aspect-video rounded-md shadow-inner flex items-center justify-center",
              theme.value === "light"
                ? "bg-gradient-to-br from-slate-50 to-slate-100"
                : theme.value === "dark"
                  ? "bg-gradient-to-br from-slate-900 to-slate-950"
                  : "bg-gradient-to-br from-slate-400 to-slate-600",
            )}
          >
            {theme.icon}
          </div>
          <span className="text-xs font-medium capitalize">{theme.label}</span>
        </motion.button>
      ))}
    </div>
  )
}
