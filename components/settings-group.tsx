"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface SettingsGroupProps {
  title: string
  description: string
  icon?: ReactNode
  children: ReactNode
}

export function SettingsGroup({ title, description, icon, children }: SettingsGroupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -1 }}
      className="p-6 md:p-8 rounded-xl border border-border/30 bg-card shadow-sm transition-all duration-300 ease-[cubic-bezier(0.35,0.2,0.14,0.95)] hover:shadow-md hover:border-border/50"
    >
      <div className="flex items-center gap-2 mb-1">
        {icon && <div className="text-primary">{icon}</div>}
        <h2 className="text-base font-medium text-foreground">{title}</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      <div className="divide-y divide-border/20">{children}</div>
    </motion.div>
  )
}
