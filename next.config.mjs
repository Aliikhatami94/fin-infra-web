import { createRequire } from "module"

const require = createRequire(import.meta.url)

let withBundleAnalyzer = (config) => config

try {
  const bundleAnalyzer = require("@next/bundle-analyzer")
  withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
    openAnalyzer: false,
    analyzerMode: "static",
  })
} catch (error) {
  if (process.env.ANALYZE === "true") {
    console.warn("@next/bundle-analyzer is not installed; skipping bundle analysis.")
  }
}

const requiredEnvVars = [
  "NEXT_PUBLIC_AI_INSIGHTS_ROLLOUT",
  "NEXT_PUBLIC_ANALYTICS_SAMPLING_RATE",
  "NEXT_PUBLIC_STORAGE_ENCRYPTION_KEY",
  "PLAID_SANDBOX_CLIENT_ID",
  "PLAID_SANDBOX_SECRET",
  "ENCRYPTION_SALT",
  "SESSION_ENCRYPTION_KEY",
]

const missingEnv = requiredEnvVars.filter((key) => !process.env[key] || process.env[key].trim() === "")

if (missingEnv.length > 0) {
  // For prototyping and dev, always allow safe defaults unless STRICT_ENV_CHECK=true is explicitly set.
  const isStrict = process.env.STRICT_ENV_CHECK === "true"
  const isLint = process.env.npm_lifecycle_event === "lint"
  if (isStrict) {
    throw new Error(`Missing required environment variables: ${missingEnv.join(", ")}`)
  } else {
    // In non-strict contexts (local dev, CI lint/test, Vercel preview), provide safe fallbacks and warn instead of crashing
    if (!isLint) {
      console.warn(
        `Warning: Missing environment variables in non-strict mode: ${missingEnv.join(", ")}. Using development-safe defaults.`,
      )
    }
    const devDefaults = {
      NEXT_PUBLIC_AI_INSIGHTS_ROLLOUT: "0",
      NEXT_PUBLIC_ANALYTICS_SAMPLING_RATE: "0",
      NEXT_PUBLIC_STORAGE_ENCRYPTION_KEY: "dev-storage-key",
      PLAID_SANDBOX_CLIENT_ID: "dev-plaid-client-id",
      PLAID_SANDBOX_SECRET: "dev-plaid-secret",
      ENCRYPTION_SALT: "dev-salt",
      SESSION_ENCRYPTION_KEY: "dev-session-key",
    }
    for (const key of missingEnv) {
      process.env[key] = devDefaults[key] ?? process.env[key]
    }
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withBundleAnalyzer(nextConfig)
