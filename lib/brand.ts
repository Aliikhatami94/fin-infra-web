export const BRAND = {
  name: "ClarityLedger",
  tagline: "Unified Financial Intelligence Platform",
  description: "Holistic finance management and insights workspace",
} as const

type Brand = typeof BRAND

export type BrandName = Brand["name"]
