import { taxHarvestingScenario } from "@/lib/mock"
import { taxHarvestingScenarioSchema } from "@/lib/schemas"
import type { TaxHarvestingScenario } from "@/types/domain"

export function getTaxHarvestingScenario(): TaxHarvestingScenario {
  return taxHarvestingScenarioSchema.parse(taxHarvestingScenario)
}
