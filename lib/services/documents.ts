import { documentInsights, documents } from "@/lib/mock"
import { documentInsightsResponseSchema, documentsResponseSchema } from "@/lib/schemas"
import type { Document, DocumentInsight } from "@/types/domain"

export function getDocuments(): Document[] {
  return documentsResponseSchema.parse(documents)
}

export function getDocumentInsights(): DocumentInsight[] {
  return documentInsightsResponseSchema.parse(documentInsights)
}
