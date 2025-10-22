import type { ComponentType } from "react"

export type AccountStatus = "active" | "needs_update"
export type AccountType = "Checking" | "Savings" | "Investment" | "Credit Card" | string

export interface Account {
  id: number
  name: string
  type: AccountType
  institution: string
  balance: number
  change: number
  lastSync: string
  status: AccountStatus
  nextBillDue: string | null
  nextBillAmount: number | null
}

export interface Transaction {
  id: number
  date: string
  merchant: string
  amount: number
  category: string
  icon: ComponentType<{ className?: string }>
}

export type SortField = "name" | "balance" | "change"
export type SortDirection = "asc" | "desc"
export type GroupBy = "none" | "institution" | "type"
