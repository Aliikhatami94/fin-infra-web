/**
 * Centralized color utility functions for consistent color usage across the dashboard
 * These map to the CSS custom properties defined in globals.css
 */

export const colors = {
  // Semantic colors for data visualization
  positive: "var(--color-positive)",
  negative: "var(--color-negative)",
  warning: "var(--color-warning)",
  info: "var(--color-info)",

  // Chart colors
  chart1: "hsl(var(--chart-1))",
  chart2: "hsl(var(--chart-2))",
  chart3: "hsl(var(--chart-3))",
  chart4: "hsl(var(--chart-4))",
  chart5: "hsl(var(--chart-5))",
} as const

export type SemanticTone = "positive" | "negative" | "warning" | "info" | "neutral"

const semanticToneStyles: Record<SemanticTone, {
  textClass: string
  iconClass: string
  surfaceClass: string
  borderClass: string
  strokeColor: string
}> = {
  positive: {
    textClass: "text-[var(--semantic-positive-text)]",
    iconClass: "text-[var(--color-positive)]",
    surfaceClass: "bg-[var(--semantic-positive-surface)]",
    borderClass: "border-[var(--semantic-positive-border)]",
    strokeColor: "var(--color-positive)",
  },
  negative: {
    textClass: "text-[var(--semantic-negative-text)]",
    iconClass: "text-[var(--color-negative)]",
    surfaceClass: "bg-[var(--semantic-negative-surface)]",
    borderClass: "border-[var(--semantic-negative-border)]",
    strokeColor: "var(--color-negative)",
  },
  warning: {
    textClass: "text-[var(--semantic-warning-text)]",
    iconClass: "text-[var(--color-warning)]",
    surfaceClass: "bg-[var(--semantic-warning-surface)]",
    borderClass: "border-[var(--semantic-warning-border)]",
    strokeColor: "var(--color-warning)",
  },
  info: {
    textClass: "text-[var(--semantic-info-text)]",
    iconClass: "text-[var(--color-info)]",
    surfaceClass: "bg-[var(--semantic-info-surface)]",
    borderClass: "border-[var(--semantic-info-border)]",
    strokeColor: "var(--color-info)",
  },
  neutral: {
    textClass: "text-muted-foreground",
    iconClass: "text-muted-foreground",
    surfaceClass: "bg-muted",
    borderClass: "border-border",
    strokeColor: "var(--muted-foreground)",
  },
}

const resolveTone = (value: number, neutral = false): SemanticTone => {
  if (neutral || value === 0) return "neutral"
  return value > 0 ? "positive" : "negative"
}

// Utility function to get color classes for numeric trends
export const getValueColor = (value: number, neutral = false) => {
  const tone = resolveTone(value, neutral)
  return semanticToneStyles[tone].iconClass
}

// Utility function to get background color based on value
export const getValueBgColor = (value: number, neutral = false) => {
  const tone = resolveTone(value, neutral)
  return semanticToneStyles[tone].surfaceClass
}

// Utility function to get border color based on value
export const getValueBorderColor = (value: number, neutral = false) => {
  const tone = resolveTone(value, neutral)
  return semanticToneStyles[tone].borderClass
}

export const getTrendSemantic = (value: number, neutral = false) => {
  const tone = resolveTone(value, neutral)
  return {
    tone,
    ...semanticToneStyles[tone],
  }
}

// Category colors for consistent badge styling
export const categoryColors = {
  portfolio: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  budget: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  tax: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  goal: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  insight: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  alert: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
} as const

export type CategoryType = keyof typeof categoryColors
