"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pin, PinOff } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { createStaggeredCardVariants } from "@/lib/motion-variants"

interface InsightCardProps {
  id: number
  icon: LucideIcon
  title: string
  description: string
  category: string
  variant: "spending" | "investment" | "goals" | "alert"
  trend?: number
  index: number
  isPinned?: boolean
}

const variantStyles = {
  spending: {
    iconColor: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    badgeColor: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200",
    progressColor: "bg-amber-400/60",
    hoverBorder: "hover:border-amber-200 dark:hover:border-amber-800",
  },
  investment: {
    iconColor: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-500/10",
    badgeColor: "bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-200",
    progressColor: "bg-sky-400/60",
    hoverBorder: "hover:border-sky-200 dark:hover:border-sky-800",
  },
  goals: {
    iconColor: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    badgeColor: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200",
    progressColor: "bg-emerald-400/60",
    hoverBorder: "hover:border-emerald-200 dark:hover:border-emerald-800",
  },
  alert: {
    iconColor: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-500/10",
    badgeColor: "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200",
    progressColor: "bg-rose-400/60",
    hoverBorder: "hover:border-rose-200 dark:hover:border-rose-800",
  },
}

export function InsightCard({
  id,
  icon: Icon,
  title,
  description,
  category,
  variant,
  trend,
  index,
  isPinned = false,
}: InsightCardProps) {
  const styles = variantStyles[variant]
  const [pinned, setPinned] = useState(isPinned)

  const handlePin = () => {
    setPinned(!pinned)
    console.log(`[v0] Insight ${id} ${!pinned ? "pinned" : "unpinned"}`)
  }

  return (
    <motion.div {...createStaggeredCardVariants(index, 0)}>
      <Card
        className={`group relative p-6 rounded-xl border ${pinned ? "border-primary/40 shadow-sm" : "border-border/30"} ${styles.hoverBorder} card-standard card-lift cursor-pointer hover:-translate-y-0.5`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handlePin}
        >
          {pinned ? (
            <PinOff className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Pin className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>

        <div className="flex justify-between items-start mb-3 pr-8">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${styles.bgColor}`}>
              <Icon className={`h-5 w-5 ${styles.iconColor}`} />
            </div>
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
          </div>
        </div>

        <Badge variant="outline" className={`${styles.badgeColor} text-xs mb-3`}>
          {category}
        </Badge>

        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

        {trend !== undefined && (
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(trend, 100)}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.2, ease: "easeOut" }}
            className={`h-1 mt-4 rounded ${styles.progressColor}`}
          />
        )}
      </Card>
    </motion.div>
  )
}
