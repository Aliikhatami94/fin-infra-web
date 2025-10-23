import { z } from "zod"

import type { Account, Transaction } from "@/types/domain"
import type { IconComponent } from "@/types/domain"

// Accepts React components including function components, forwardRef, and memo wrappers
const isReactComponentType = (value: unknown): value is IconComponent => {
  if (typeof value === "function") return true
  if (typeof value === "object" && value !== null) {
    const v = value as { $$typeof?: symbol }
    const FWD = Symbol.for("react.forward_ref")
    const MEMO = Symbol.for("react.memo")
    return v.$$typeof === FWD || v.$$typeof === MEMO
  }
  return false
}

export const iconSchema: z.ZodType<IconComponent> = z.custom<IconComponent>(isReactComponentType, {
  message: "Expected a React component",
})

export const transactionSchema: z.ZodType<Transaction> = z.object({
  id: z.number(),
  date: z.string(),
  merchant: z.string(),
  amount: z.number(),
  category: z.string(),
  icon: iconSchema,
})

export const accountSchema: z.ZodType<Account> = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  institution: z.string(),
  balance: z.number(),
  change: z.number(),
  lastSync: z.string(),
  status: z.enum(["active", "needs_update", "disconnected"]),
  nextBillDue: z.string().nullable(),
  nextBillAmount: z.number().nullable(),
})

export const accountsResponseSchema = accountSchema.array()
export const transactionsResponseSchema = transactionSchema.array()
