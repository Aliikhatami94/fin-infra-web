import type { TaxHarvestingScenario } from "@/types/domain"

export const taxHarvestingScenario: TaxHarvestingScenario = {
  currentTaxLiability: 18450,
  defaultTaxRate: 32,
  minTaxRate: 10,
  maxTaxRate: 37,
  step: 1,
  harvestablePositions: [
    { asset: "GOOGL", loss: 850 },
    { asset: "AMD", loss: 320 },
    { asset: "PLTR", loss: 1200 },
    { asset: "COIN", loss: 580 },
    { asset: "SQ", loss: 250 },
  ],
}
