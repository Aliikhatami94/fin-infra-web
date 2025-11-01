/**
 * Standardized chart colors for consistent data visualization across all dashboard pages
 * All colors reference CSS custom properties defined in app/globals.css
 * 
 * Usage:
 * - Import the appropriate palette for your chart type
 * - Use the colors in the same order for consistent visual language
 * - For semantic data (positive/negative), use SEMANTIC_COLORS
 */

// ============================================================================
// SEMANTIC COLORS - Use for data with inherent meaning (gains/losses, etc.)
// ============================================================================

export const SEMANTIC_COLORS = {
  positive: "hsl(142, 76%, 45%)", // Green - use for gains, income, positive trends
  negative: "hsl(0, 84%, 60%)",   // Red - use for losses, expenses, negative trends
  neutral: "hsl(217, 91%, 60%)",  // Blue - use for neutral or informational data
  warning: "hsl(45, 93%, 47%)",   // Amber - use for warnings or cautions
} as const

// ============================================================================
// CATEGORICAL COLORS - Use for pie/donut charts and multi-series data
// ============================================================================

/**
 * Primary palette for pie charts and categorical data
 * Order optimized for visual distinction and accessibility
 * Use this for: Asset allocation, sector breakdown, regional distribution
 */
export const PIE_CHART_COLORS = [
  "hsl(217, 91%, 60%)",  // Blue - Primary
  "hsl(142, 76%, 45%)",  // Green - Secondary
  "hsl(24, 95%, 53%)",   // Orange - Tertiary
  "hsl(262, 83%, 58%)",  // Purple - Quaternary
  "hsl(340, 82%, 52%)",  // Pink - Quinary
  "hsl(45, 93%, 47%)",   // Amber - Senary
  "hsl(186, 94%, 40%)",  // Cyan - Septenary
  "hsl(0, 84%, 60%)",    // Red - Octonary
] as const

/**
 * Alternative palette for nested or comparison pie charts
 * Lighter variants for secondary emphasis
 */
export const PIE_CHART_COLORS_ALT = [
  "hsl(217, 91%, 70%)",
  "hsl(142, 76%, 55%)",
  "hsl(24, 95%, 63%)",
  "hsl(262, 83%, 68%)",
  "hsl(340, 82%, 62%)",
  "hsl(45, 93%, 57%)",
] as const

// ============================================================================
// LINE & AREA CHART COLORS
// ============================================================================

/**
 * Primary line/area chart colors with matching gradient definitions
 * Use for: Time series, trends, performance tracking
 */
export const LINE_CHART_COLORS = {
  primary: {
    stroke: "hsl(217, 91%, 60%)",    // Blue line
    fill: "hsl(217, 91%, 60%)",      // For area fills
    gradient: "colorPrimary",         // Gradient ID for AreaChart defs
  },
  secondary: {
    stroke: "hsl(142, 76%, 45%)",    // Green line
    fill: "hsl(142, 76%, 45%)",
    gradient: "colorSecondary",
  },
  tertiary: {
    stroke: "hsl(24, 95%, 53%)",     // Orange line
    fill: "hsl(24, 95%, 53%)",
    gradient: "colorTertiary",
  },
  quaternary: {
    stroke: "hsl(262, 83%, 58%)",    // Purple line
    fill: "hsl(262, 83%, 58%)",
    gradient: "colorQuaternary",
  },
} as const

/**
 * Chart color references using CSS custom properties
 * Use these when you want theme-aware colors that adapt to light/dark mode
 */
export const CHART_VAR_COLORS = {
  chart1: "hsl(var(--chart-1))",  // Primary chart color
  chart2: "hsl(var(--chart-2))",  // Secondary chart color
  chart3: "hsl(var(--chart-3))",  // Tertiary chart color
  chart4: "hsl(var(--chart-4))",  // Quaternary chart color
  chart5: "hsl(var(--chart-5))",  // Quinary chart color
} as const

// ============================================================================
// BAR CHART COLORS
// ============================================================================

/**
 * Bar chart colors for categorical comparisons
 * Use for: Budget vs actual, period comparisons, category breakdowns
 */
export const BAR_CHART_COLORS = {
  primary: "hsl(217, 91%, 60%)",    // Blue - main data series
  secondary: "hsl(142, 76%, 45%)",  // Green - comparison series
  tertiary: "hsl(24, 95%, 53%)",    // Orange - tertiary series
  quaternary: "hsl(262, 83%, 58%)", // Purple - quaternary series
} as const

/**
 * Special bar chart color presets for common use cases
 */
export const BAR_CHART_PRESETS = {
  // For cash flow charts: income vs expenses
  cashFlow: {
    inflow: "hsl(142, 76%, 45%)",   // Green for income
    outflow: "hsl(24, 95%, 53%)",   // Orange for expenses
    net: "hsl(217, 91%, 60%)",      // Blue for net
  },
  
  // For budget variance: under vs over budget
  budgetVariance: {
    underBudget: "hsl(142, 76%, 45%)",  // Green for savings
    overBudget: "hsl(0, 84%, 60%)",     // Red for overspend
    onBudget: "hsl(217, 91%, 60%)",     // Blue for on-track
  },
  
  // For performance comparisons
  performance: {
    portfolio: "hsl(217, 91%, 60%)",    // Blue
    benchmark: "hsl(220, 13%, 55%)",    // Gray
    target: "hsl(142, 76%, 45%)",       // Green
  },
} as const

// ============================================================================
// GRADIENT DEFINITIONS - For AreaChart components
// ============================================================================

/**
 * Gradient configurations for area charts
 * Use these with <defs> in your AreaChart component
 * 
 * Example:
 * <defs>
 *   <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
 *     <stop offset="5%" stopColor={LINE_CHART_COLORS.primary.fill} stopOpacity={0.2} />
 *     <stop offset="95%" stopColor={LINE_CHART_COLORS.primary.fill} stopOpacity={0} />
 *   </linearGradient>
 * </defs>
 */
export const AREA_CHART_GRADIENTS = {
  primary: {
    id: "colorPrimary",
    color: LINE_CHART_COLORS.primary.fill,
    topOpacity: 0.2,
    bottomOpacity: 0,
  },
  secondary: {
    id: "colorSecondary",
    color: LINE_CHART_COLORS.secondary.fill,
    topOpacity: 0.2,
    bottomOpacity: 0,
  },
  tertiary: {
    id: "colorTertiary",
    color: LINE_CHART_COLORS.tertiary.fill,
    topOpacity: 0.2,
    bottomOpacity: 0,
  },
  quaternary: {
    id: "colorQuaternary",
    color: LINE_CHART_COLORS.quaternary.fill,
    topOpacity: 0.2,
    bottomOpacity: 0,
  },
} as const

// ============================================================================
// CHART STYLING CONSTANTS
// ============================================================================

/**
 * Consistent chart element styling
 */
export const CHART_STYLES = {
  // Grid and axis styling
  grid: {
    stroke: "hsl(var(--border))",
    strokeDasharray: "3 3",
    opacity: 0.5,
    vertical: false,
  },
  
  // Axis styling - uses a medium gray that's visible in both light and dark themes
  axis: {
    stroke: "#888888",
    fill: "#888888",
    fontSize: 12,
    tickLine: true,
    axisLine: true,
    tickSize: 5,
    tickMargin: 8,
  },
  
  // Line styling
  line: {
    strokeWidth: 2,
    dot: { r: 4 },
    activeDot: { r: 6 },
  },
  
  // Bar styling
  bar: {
    radius: [4, 4, 0, 0] as [number, number, number, number],
  },
  
  // Pie/Donut styling
  pie: {
    innerRadiusRatio: 0.6,  // For donut charts (60% of outer radius)
    paddingAngle: 2,
    strokeWidth: 0,
  },
} as const

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a color from the pie chart palette by index
 * Wraps around if index exceeds palette length
 */
export function getPieChartColor(index: number): string {
  return PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]
}

/**
 * Get semantic color based on value (positive/negative/neutral)
 */
export function getSemanticColor(value: number, threshold = 0): string {
  if (value > threshold) return SEMANTIC_COLORS.positive
  if (value < threshold) return SEMANTIC_COLORS.negative
  return SEMANTIC_COLORS.neutral
}

/**
 * Generate a consistent color palette for a specific number of categories
 */
export function getCategoricalPalette(count: number): string[] {
  if (count <= PIE_CHART_COLORS.length) {
    return Array.from({ length: count }, (_, i) => PIE_CHART_COLORS[i])
  }
  // For more than 8 categories, cycle through the palette
  return Array.from({ length: count }, (_, i) => getPieChartColor(i))
}

/**
 * Create gradient definition JSX for area charts
 */
export function createAreaGradientDef(
  id: string,
  color: string,
  topOpacity = 0.2,
  bottomOpacity = 0
): string {
  return `
    <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="${color}" stopOpacity="${topOpacity}" />
      <stop offset="95%" stopColor="${color}" stopOpacity="${bottomOpacity}" />
    </linearGradient>
  `
}
