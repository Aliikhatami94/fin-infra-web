/**
 * Centralized color utility functions for consistent color usage across the dashboard
 * These map to the CSS custom properties defined in globals.css
 */

export const colors = {
  // Semantic colors for data visualization
  positive: "hsl(var(--color-positive))",
  negative: "hsl(var(--color-negative))",
  warning: "hsl(var(--color-warning))",
  info: "hsl(var(--color-info))",

  // Chart colors
  chart1: "hsl(var(--chart-1))",
  chart2: "hsl(var(--chart-2))",
  chart3: "hsl(var(--chart-3))",
  chart4: "hsl(var(--chart-4))",
  chart5: "hsl(var(--chart-5))",
} as const

// Utility function to get color based on value (positive/negative)
export const getValueColor = (value: number, neutral = false) => {
  if (neutral || value === 0) return "text-muted-foreground"
  return value > 0 ? "text-[var(--color-positive)]" : "text-[var(--color-negative)]"
}

// Utility function to get background color based on value
export const getValueBgColor = (value: number, neutral = false) => {
  if (neutral || value === 0) return "bg-muted"
  return value > 0 ? "bg-green-500/10" : "bg-red-500/10"
}

// Utility function to get border color based on value
export const getValueBorderColor = (value: number, neutral = false) => {
  if (neutral || value === 0) return "border-border"
  return value > 0 ? "border-green-500/20" : "border-red-500/20"
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
