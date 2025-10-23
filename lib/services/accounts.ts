import { accountsData, mockTransactions } from "@/lib/mock"
import { accountsResponseSchema, transactionsResponseSchema } from "@/lib/schemas"
import type { Account, Transaction } from "@/types/domain"

/**
 * Returns the list of connected accounts using the shared domain contract.
 * The mock data is validated with Zod so consumers get strongly typed results
 * now and runtime safety once data is fetched from an API.
 */
export function getAccounts(): Account[] {
  return accountsResponseSchema.parse(accountsData)
}

/**
 * Returns a limited set of recent transactions for account detail panes.
 * Validation keeps icon and numeric shapes consistent across consumers.
 */
export function getRecentTransactions(): Transaction[] {
  return transactionsResponseSchema.parse(mockTransactions)
}
