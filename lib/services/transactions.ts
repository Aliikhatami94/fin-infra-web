import { transactionsMock } from "@/lib/mock"
import { transactionsResponseSchema } from "@/lib/schemas"
import type { Transaction } from "@/types/domain"

export function getTransactions(): Transaction[] {
  return transactionsResponseSchema.parse(transactionsMock)
}
