import { z } from "zod"

import type { Document } from "@/types/domain"

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
