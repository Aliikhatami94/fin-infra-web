import { z } from "zod"

import type { Goal } from "@/types/domain"
import { iconSchema } from "./accounts"

export const goalSchema: z.ZodType<Goal> = z.object({
  id: z.number(),
  name: z.string(),
  icon: iconSchema,
  current: z.number(),
  target: z.number(),
  percent: z.number(),
  eta: z.string(),
  monthlyTarget: z.number(),
  fundingSource: z.string(),
  acceleration: z.number(),
  status: z.enum(["active", "paused", "completed"]),
  color: z.string(),
  bgColor: z.string(),
})

export const goalsResponseSchema = goalSchema.array()
