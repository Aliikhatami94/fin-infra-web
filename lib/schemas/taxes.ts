import { z } from "zod"

import type { TaxHarvestablePosition, TaxHarvestingScenario } from "@/types/domain"

export const taxHarvestablePositionSchema: z.ZodType<TaxHarvestablePosition> = z.object({
  asset: z.string(),
  loss: z.number(),
  selected: z.boolean().optional(),
})

export const taxHarvestingScenarioSchema: z.ZodType<TaxHarvestingScenario> = z.object({
  currentTaxLiability: z.number(),
  defaultTaxRate: z.number(),
  minTaxRate: z.number(),
  maxTaxRate: z.number(),
  step: z.number(),
  harvestablePositions: taxHarvestablePositionSchema.array(),
})
