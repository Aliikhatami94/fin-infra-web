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
