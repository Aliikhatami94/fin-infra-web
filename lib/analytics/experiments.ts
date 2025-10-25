import { useMemo } from "react"

const RAW_FLAGS = process.env.NEXT_PUBLIC_EXPERIMENT_FLAGS ?? ""
const KNOWN_FLAGS = ["growthDashboards", "feedbackPrompts", "insightUnreadHighlight", "shareExports"] as const

export type FeatureFlagKey = (typeof KNOWN_FLAGS)[number]
export type ExperimentVariant = "control" | "enabled" | "disabled" | string

const FALLBACK_VARIANTS: Partial<Record<FeatureFlagKey, ExperimentVariant>> = {
  growthDashboards: "control",
  feedbackPrompts: "control",
  insightUnreadHighlight: "control",
  shareExports: "control",
}

function parseFlags(raw: string): Record<string, ExperimentVariant> {
  if (!raw) {
    return {}
  }

  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce<Record<string, ExperimentVariant>>((acc, entry) => {
      const [key, variant] = entry.split(":").map((value) => value.trim())
      if (!key) {
        return acc
      }
      acc[key] = (variant as ExperimentVariant | undefined) ?? "enabled"
      return acc
    }, {})
}

const parsedFlags = parseFlags(RAW_FLAGS)

export function getExperimentVariant(flag: FeatureFlagKey): ExperimentVariant {
  return parsedFlags[flag] ?? FALLBACK_VARIANTS[flag] ?? "control"
}

export function isFeatureEnabled(flag: FeatureFlagKey, options?: { defaultEnabled?: boolean }): boolean {
  const variant = getExperimentVariant(flag)
  if (variant === "disabled") {
    return false
  }
  if (variant === "enabled") {
    return true
  }
  return options?.defaultEnabled ?? false
}

export function getExperimentCohort(): string {
  return process.env.NEXT_PUBLIC_EXPERIMENT_COHORT ?? "control"
}

export function getAttributionSource(): string {
  return process.env.NEXT_PUBLIC_ATTRIBUTION_SOURCE ?? "unknown"
}

export function getAnalyticsSamplingRate(): number {
  const raw = process.env.NEXT_PUBLIC_ANALYTICS_SAMPLING_RATE
  const value = raw ? Number.parseFloat(raw) : NaN
  if (Number.isNaN(value)) {
    return 0
  }
  return Math.min(100, Math.max(0, value))
}

function hashString(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

export function shouldSampleEvent(seed?: string): boolean {
  const rate = getAnalyticsSamplingRate()
  if (rate >= 100) {
    return true
  }
  if (rate <= 0) {
    return false
  }
  if (!seed) {
    return Math.random() * 100 < rate
  }
  return hashString(seed) % 100 < rate
}

export function useFeatureFlag(flag: FeatureFlagKey, options?: { defaultEnabled?: boolean }) {
  return useMemo(
    () => ({
      enabled: isFeatureEnabled(flag, options),
      variant: getExperimentVariant(flag),
      cohort: getExperimentCohort(),
    }),
    [flag, options],
  )
}

export function listResolvedFlags(): Array<{ key: FeatureFlagKey; variant: ExperimentVariant }> {
  return KNOWN_FLAGS.map((key) => ({ key, variant: getExperimentVariant(key) }))
}
