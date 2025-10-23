const ACCOUNT_NUMBER_PATTERN = /\b\d{8,}\b/g
const SSN_PATTERN = /\b\d{3}-\d{2}-\d{4}\b/g
const BALANCE_PATTERN = /\$\s?\d[\d,.]*(?:\.\d{2})?/g
const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
const PHONE_PATTERN = /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g

const REDACTED_TOKEN = "[REDACTED]"

function formatCurrencyRange(amount: number) {
  const lower = Math.max(amount - 100, 0)
  const upper = amount + 100
  return `$${lower.toLocaleString()}-${upper.toLocaleString()}`
}

function maskNumeric(value: number) {
  if (!Number.isFinite(value)) {
    return value
  }

  if (Math.abs(value) >= 1000) {
    const rounded = Math.round(Math.abs(value) / 100) * 100
    return value < 0 ? `-${formatCurrencyRange(rounded)}` : formatCurrencyRange(rounded)
  }

  return REDACTED_TOKEN
}

function redactString(value: string): string {
  return value
    .replace(ACCOUNT_NUMBER_PATTERN, REDACTED_TOKEN)
    .replace(SSN_PATTERN, REDACTED_TOKEN)
    .replace(BALANCE_PATTERN, REDACTED_TOKEN)
    .replace(EMAIL_PATTERN, REDACTED_TOKEN)
    .replace(PHONE_PATTERN, REDACTED_TOKEN)
}

function redactArray(value: unknown[]): unknown[] {
  return value.map((item) => redactValue(item))
}

function redactObject<T extends Record<string, unknown>>(value: T): T {
  const next: Record<string, unknown> = {}

  for (const [key, item] of Object.entries(value)) {
    next[key] = redactValue(item)
  }

  return next as T
}

export function redactValue<T>(value: T): T {
  if (typeof value === "string") {
    return redactString(value) as T
  }

  if (typeof value === "number") {
    return maskNumeric(value) as T
  }

  if (Array.isArray(value)) {
    return redactArray(value) as T
  }

  if (value instanceof Date) {
    return value
  }

  if (value && typeof value === "object") {
    return redactObject(value as Record<string, unknown>) as T
  }

  return value
}

export type RedactingLogger = {
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  debug: (...args: unknown[]) => void
}

function transformArgs(args: unknown[]) {
  return args.map((arg) => redactValue(arg))
}

export function createRedactingLogger(namespace: string, consoleRef: Console = console): RedactingLogger {
  const prefix = `[${namespace}]`

  return {
    info: (...args: unknown[]) => consoleRef.info(prefix, ...transformArgs(args)),
    warn: (...args: unknown[]) => consoleRef.warn(prefix, ...transformArgs(args)),
    error: (...args: unknown[]) => consoleRef.error(prefix, ...transformArgs(args)),
    debug: (...args: unknown[]) => consoleRef.debug(prefix, ...transformArgs(args)),
  }
}

export function sanitizeForLogging<T>(input: T): T {
  return redactValue(input)
}
