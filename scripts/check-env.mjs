const requiredVariables = [
  "NEXT_PUBLIC_EXPERIMENT_FLAGS",
  "NEXT_PUBLIC_EXPERIMENT_COHORT",
  "NEXT_PUBLIC_AI_INSIGHTS_ROLLOUT",
  "NEXT_PUBLIC_ANALYTICS_SAMPLING_RATE",
  "NEXT_PUBLIC_ATTRIBUTION_SOURCE",
  "NEXT_PUBLIC_STORAGE_ENCRYPTION_KEY",
  "PLAID_SANDBOX_CLIENT_ID",
  "PLAID_SANDBOX_SECRET",
  "ENCRYPTION_SALT",
  "SESSION_ENCRYPTION_KEY",
]

const missing = requiredVariables.filter((key) => !process.env[key] || process.env[key].trim() === "")

// Determine strict production contexts where missing envs should fail the build.
const isVercelProd = process.env.VERCEL_ENV === "production"
const isMainPush = process.env.CI === "true" && (
  process.env.GITHUB_REF === "refs/heads/main" ||
  process.env.GITHUB_REF_NAME === "main" ||
  process.env.GITHUB_BASE_REF === "main"
)
const isProdNode = process.env.NODE_ENV === "production"
const isStrictFlag = process.env.STRICT_ENV_CHECK === "true"
const isStrict = isStrictFlag || isVercelProd || (isMainPush && isProdNode)

if (missing.length > 0) {
  const msg = `Missing required environment variables: ${missing.join(", ")}`
  if (isStrict) {
    console.error(msg)
    process.exit(1)
  } else {
    console.warn(`Warning (non-strict env check): ${msg}`)
    process.exit(0)
  }
}

console.info("Environment variables check passed.")
