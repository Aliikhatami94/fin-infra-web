import { z } from "zod"

import type { Goal, GoalMilestone } from "@/types/domain"
import { iconSchema } from "./accounts"

const goalMilestoneSchema: z.ZodType<GoalMilestone> = z.object({
  label: z.string(),
  target: z.number(),
  achieved: z.boolean(),
  celebrationCta: z.string().optional(),
})

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
  milestones: z.array(goalMilestoneSchema).optional(),
  celebrationMessage: z.string().optional(),
  scenarioNotes: z.string().optional(),
})

export const goalsResponseSchema = goalSchema.array()
