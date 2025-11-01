export const BRAND = {
  name: "Autoclar",
  tagline: "Automated Financial Clarity",
  description: "Automate your financial clarity with intelligent insights, unified data, and effortless oversight",
} as const

type Brand = typeof BRAND

export type BrandName = Brand["name"]
