import type { GroupBy, SortDirection, SortField } from "./types"
import type { Account } from "@/types/domain"

export function filterAccounts(accounts: Account[], hideZeroBalance: boolean): Account[] {
  if (!hideZeroBalance) {
    return accounts
  }

  return accounts.filter((account) => account.balance !== 0)
}

export function sortAccounts(
  accounts: Account[],
  field: SortField,
  direction: SortDirection,
): Account[] {
  return [...accounts].sort((a, b) => {
    let aVal: string | number = 0
    let bVal: string | number = 0

    if (field === "name") {
      aVal = a.name.toLowerCase()
      bVal = b.name.toLowerCase()
    } else if (field === "balance") {
      aVal = a.balance
      bVal = b.balance
    } else if (field === "change") {
      aVal = a.change
      bVal = b.change
    }

    if (aVal < bVal) return direction === "asc" ? -1 : 1
    if (aVal > bVal) return direction === "asc" ? 1 : -1
    return 0
  })
}

export function groupAccounts(accounts: Account[], groupBy: GroupBy) {
  if (groupBy === "none") {
    return { "All Accounts": accounts }
  }

  const groups: Record<string, Account[]> = {}

  accounts.forEach((account) => {
    const key = groupBy === "institution" ? account.institution : account.type
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(account)
  })

  return groups
}
