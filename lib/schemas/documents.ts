import { z } from "zod"

import type { Document } from "@/types/domain"
import { iconSchema } from "./accounts"

export const documentSchema: z.ZodType<Document> = z.object({
  id: z.number(),
  name: z.string(),
  institution: z.string(),
  type: z.string(),
  date: z.string(),
  dateValue: z.date(),
  size: z.string(),
  sizeValue: z.number(),
})

export const documentsResponseSchema = documentSchema.array()

export const documentInsightSchema = z.object({
  icon: iconSchema,
  text: z.string(),
  color: z.string(),
  bgColor: z.string(),
  action: z.string(),
  priority: z.enum(["low", "medium", "high"]).optional(),
})

export const documentInsightsResponseSchema = documentInsightSchema.array()
