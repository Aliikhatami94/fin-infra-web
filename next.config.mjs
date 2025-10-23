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
  const isProd = process.env.NODE_ENV === "production"
  if (isProd) {
    throw new Error(`Missing required environment variables: ${missingEnv.join(", ")}`)
  } else {
    // In development, provide safe fallbacks and warn instead of crashing
    console.warn(
      `Warning: Missing environment variables in development: ${missingEnv.join(", ")}. Using development-safe defaults.`,
    )
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
const nextConfig = {
  experimental: {
    bundleAnalyzer: {
      enabled: process.env.ANALYZE === "true",
      budgets: {
        default: { total: 600 * 1024 },
        "/(dashboard)/overview": { total: 480 * 1024 },
        "/(dashboard)/accounts": { total: 520 * 1024 },
        "/(dashboard)/portfolio": { total: 520 * 1024 },
        "/(dashboard)/crypto": { total: 520 * 1024 },
        "/(dashboard)/cash-flow": { total: 480 * 1024 },
        "/(dashboard)/budget": { total: 460 * 1024 },
        "/(dashboard)/goals": { total: 460 * 1024 },
        "/(dashboard)/taxes": { total: 460 * 1024 },
        "/(dashboard)/insights": { total: 480 * 1024 },
        "/(dashboard)/documents": { total: 500 * 1024 },
        "/(dashboard)/settings": { total: 420 * 1024 },
      },
    },
  },
}

export default withBundleAnalyzer(nextConfig)
