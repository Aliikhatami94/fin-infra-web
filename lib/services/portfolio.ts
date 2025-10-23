import { portfolioHoldings } from "@/lib/mock"
import { holdingsResponseSchema } from "@/lib/schemas"
import type { Holding } from "@/types/domain"

export function getPortfolioHoldings(): Holding[] {
  return holdingsResponseSchema.parse(portfolioHoldings)
}
