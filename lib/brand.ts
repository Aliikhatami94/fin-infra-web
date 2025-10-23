export const BRAND = {
  name: "TradeHub",
  tagline: "Stock Trading Dashboard",
  description: "Professional stock trading dashboard",
} as const

type Brand = typeof BRAND

export type BrandName = Brand["name"]
