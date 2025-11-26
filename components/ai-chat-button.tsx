"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  AI_PROVIDER_ORDER,
  getProviderColorIcon,
  getProviderIcon,
  AI_PROVIDER_NAMES,
  type AIProviderKey,
} from "@/components/icons/ai-provider-icons"
import { cn } from "@/lib/utils"

interface AIChatButtonProps {
  onClick: () => void
  className?: string
  /** How often to switch providers (ms). Default 3000ms */
  interval?: number
  /** Whether to animate between providers. Default true */
  animate?: boolean
}

/**
 * Floating AI Chat button that cycles through provider icons with a smooth animation.
 * Displays each AI provider's icon in sequence to showcase multi-provider support.
 * Uses color icons for visual appeal.
 */
export function AIChatButton({
  onClick,
  className,
  interval = 3000,
  animate = true,
}: AIChatButtonProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextProvider = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % AI_PROVIDER_ORDER.length)
  }, [])

  useEffect(() => {
    if (!animate) return

    const timer = setInterval(nextProvider, interval)
    return () => clearInterval(timer)
  }, [animate, interval, nextProvider])

  const currentProvider = AI_PROVIDER_ORDER[currentIndex]
  // Use color icons for the floating button
  const CurrentIcon = getProviderColorIcon(currentProvider)

  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-[110] overflow-hidden",
        className
      )}
      size="icon"
      aria-label={`Open chat - powered by ${AI_PROVIDER_NAMES[currentProvider]}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProvider}
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="flex items-center justify-center"
        >
          {CurrentIcon && <CurrentIcon className="h-6 w-6" />}
        </motion.div>
      </AnimatePresence>
    </Button>
  )
}

/**
 * Static version that displays a specific provider icon
 */
export function AIChatButtonStatic({
  onClick,
  className,
  provider,
  useColor = true,
}: {
  onClick: () => void
  className?: string
  provider: AIProviderKey
  /** Whether to use color icon. Default true */
  useColor?: boolean
}) {
  const Icon = useColor ? getProviderColorIcon(provider) : getProviderIcon(provider)

  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-[110]",
        className
      )}
      size="icon"
      aria-label={`Open chat - powered by ${AI_PROVIDER_NAMES[provider]}`}
    >
      {Icon && <Icon className="h-6 w-6" />}
    </Button>
  )
}
