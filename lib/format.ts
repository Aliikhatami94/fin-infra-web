// Formatting utilities for consistent number/date display across the app

import { format, formatDistanceStrict } from "date-fns"

export type NumberFormatOptions = Intl.NumberFormatOptions & {
  signDisplay?: "auto" | "always" | "never" | "exceptZero"
}

export function formatNumber(value: number, opts: NumberFormatOptions = {}) {
  const { signDisplay, ...rest } = opts
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
    ...rest,
    signDisplay,
  }).format(value)
}

export function formatCurrency(
  value: number,
  opts: NumberFormatOptions = { minimumFractionDigits: 0, maximumFractionDigits: 0 },
) {
  const { signDisplay, ...rest } = opts
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...rest,
    signDisplay,
  }).format(value)
}

export function formatCurrencyCompact(value: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", notation: "compact" }).format(
    value,
  )
}

export function formatPercent(value: number, opts: NumberFormatOptions = {}) {
  const { signDisplay, ...rest } = opts
  return new Intl.NumberFormat(undefined, {
    style: "percent",
    maximumFractionDigits: 2,
    ...rest,
    signDisplay,
  }).format(value / 100)
}

export function formatDate(date: Date, opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "2-digit" }) {
  return new Intl.DateTimeFormat(undefined, opts).format(date)
}

interface FormatDueDateWithRelativeOptions {
  baseDate?: Date
  includeYear?: boolean
  roundingMethod?: "floor" | "ceil" | "round"
}

export function formatDueDateWithRelative(
  date: Date,
  { baseDate = new Date(), includeYear = true, roundingMethod = "floor" }: FormatDueDateWithRelativeOptions = {},
) {
  const absolute = format(date, includeYear ? "MMM d, yyyy" : "MMM d")
  const absoluteFull = format(date, "MMMM d, yyyy")
  const relative = formatDistanceStrict(date, baseDate, {
    addSuffix: true,
    unit: "day",
    roundingMethod,
  })

  return {
    absolute,
    absoluteFull,
    relative,
    isPast: date.getTime() < baseDate.getTime(),
  }
}
