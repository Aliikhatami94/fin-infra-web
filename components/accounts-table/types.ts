export type SortField = "name" | "balance" | "change"
export type SortDirection = "asc" | "desc"
export type GroupBy = "none" | "institution" | "type"

export type { Account, Transaction, AccountStatus, AccountType } from "@/types/domain"
