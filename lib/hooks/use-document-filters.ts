"use client"

import { useCallback, useMemo, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const parseList = (value: string | null) =>
  value?.split(",").map((item) => item.trim()).filter(Boolean) ?? []

const serializeList = (values: readonly string[]) => values.join(",")

export function useDocumentFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [isUpdating, startTransition] = useTransition()

  const query = searchParams.get("query") ?? ""
  const types = parseList(searchParams.get("types"))
  const accounts = parseList(searchParams.get("accounts"))
  const years = parseList(searchParams.get("years"))

  const updateParams = useCallback(
    (updates: Record<string, string | string[] | null | undefined>) => {
      const next = new URLSearchParams(searchParams)

      Object.entries(updates).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length === 0) {
            next.delete(key)
          } else {
            next.set(key, serializeList(value))
          }
        } else if (typeof value === "string") {
          if (value) {
            next.set(key, value)
          } else {
            next.delete(key)
          }
        } else {
          next.delete(key)
        }
      })

      startTransition(() => {
        router.replace(`${pathname}?${next.toString()}`, { scroll: false })
      })
    },
    [pathname, router, searchParams],
  )

  const toggleValue = useCallback(
    (key: "types" | "accounts" | "years", value: string) => {
      const currentValues = parseList(searchParams.get(key))
      const exists = currentValues.includes(value)
      const nextValues = exists ? currentValues.filter((item) => item !== value) : [...currentValues, value]
      updateParams({ [key]: nextValues })
    },
    [searchParams, updateParams],
  )

  const clearAll = useCallback(() => {
    updateParams({ query: null, types: [], accounts: [], years: [] })
  }, [updateParams])

  return useMemo(
    () => ({
      isUpdating,
      searchQuery: query,
      selectedTypes: types,
      selectedAccounts: accounts,
      selectedYears: years,
      setSearchQuery: (value: string) => updateParams({ query: value }),
      toggleType: (value: string) => toggleValue("types", value),
      toggleAccount: (value: string) => toggleValue("accounts", value),
      toggleYear: (value: string) => toggleValue("years", value),
      clearAll,
    }),
    [accounts, clearAll, isUpdating, query, toggleValue, types, updateParams, years],
  )
}
