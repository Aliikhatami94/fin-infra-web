import { documents } from "@/lib/mock"
import { documentsResponseSchema } from "@/lib/schemas"
import type { Document } from "@/types/domain"

export function getDocuments(): Document[] {
  return documentsResponseSchema.parse(documents)
}
