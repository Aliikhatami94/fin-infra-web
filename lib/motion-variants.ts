"use client"

import type { Variants } from "framer-motion"

/**
 * Centralized Framer Motion variants for consistent animations across the dashboard
 * Use these variants to ensure uniform interaction language
 */

// Card animations - staggered entry with lift on hover
export const cardVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

// Card hover effect - subtle lift
export const cardHoverVariants = {
  whileHover: {
    y: -4,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1], // cubic-bezier matching Tailwind's ease-out
    },
  },
}

// Stagger children animation for grids/lists
export const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

// Item animation for use with containerVariants
export const itemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

// Tab content cross-fade
export const tabContentVariants: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

// Modal/Dialog animations
export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

// Slide in from right (for drawers/sidebars)
export const slideInRightVariants: Variants = {
  initial: { x: "100%" },
  animate: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    x: "100%",
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

// Fade in/out
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

// Spring animation for toggles/switches
export const springConfig = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
}

// Utility function to create staggered card animations with custom delay
export const createStaggeredCardVariants = (index: number, baseDelay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: baseDelay + index * 0.1,
      ease: [0.4, 0, 0.2, 1],
    },
  },
})
