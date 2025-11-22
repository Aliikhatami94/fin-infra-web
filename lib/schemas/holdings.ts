import { z } from "zod"

import type { Holding } from "@/types/domain"

export const holdingSchema: z.ZodType<Holding> = z.object({
  symbol: z.string(),
  name: z.string(),
  shares: z.number(),
  avgPrice: z.number(),
  currentPrice: z.number(),
  change: z.number(),
  assetClass: z.string().optional(),
  accountId: z.string().optional(),
})

export const holdingsResponseSchema = holdingSchema.array()
