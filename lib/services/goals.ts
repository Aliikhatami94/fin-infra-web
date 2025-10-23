import { goals } from "@/lib/mock"
import { goalsResponseSchema } from "@/lib/schemas"
import type { Goal } from "@/types/domain"

export function getGoals(): Goal[] {
  return goalsResponseSchema.parse(goals)
}
