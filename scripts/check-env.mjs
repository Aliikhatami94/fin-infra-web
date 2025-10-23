const requiredVariables = [
  "NEXT_PUBLIC_AI_INSIGHTS_ROLLOUT",
  "NEXT_PUBLIC_ANALYTICS_SAMPLING_RATE",
  "NEXT_PUBLIC_STORAGE_ENCRYPTION_KEY",
  "PLAID_SANDBOX_CLIENT_ID",
  "PLAID_SANDBOX_SECRET",
  "ENCRYPTION_SALT",
  "SESSION_ENCRYPTION_KEY",
]

const missing = requiredVariables.filter((key) => !process.env[key] || process.env[key].trim() === "")

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`)
  process.exit(1)
}

console.info("Environment variables check passed.")
