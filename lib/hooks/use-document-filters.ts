"use client"

import { useCallback, useEffect, useMemo, useRef, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const parseList = (value: string | null) =>
  value?.split(",").map((item) => item.trim()).filter(Boolean) ?? []

const serializeList = (values: readonly string[]) => values.join(",")

const STORAGE_KEY = "documents:filters"

export function useDocumentFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [isUpdating, startTransition] = useTransition()

  const query = searchParams.get("query") ?? ""
  const types = parseList(searchParams.get("types"))
  const accounts = parseList(searchParams.get("accounts"))
  const years = parseList(searchParams.get("years"))
  const serializedParams = searchParams.toString()
  const isHydrated = useRef(false)

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

  useEffect(() => {
    if (typeof window === "undefined") return
    const payload = { query, types, accounts, years }

    if (!isHydrated.current) {
      isHydrated.current = true
      if (serializedParams.length > 0) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
        return
      }

      try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<typeof payload>
          const updates: Record<string, string | string[] | null> = {}
          if (parsed.query) updates.query = parsed.query
          if (parsed.types && parsed.types.length > 0) updates.types = parsed.types
          if (parsed.accounts && parsed.accounts.length > 0) updates.accounts = parsed.accounts
          if (parsed.years && parsed.years.length > 0) updates.years = parsed.years
          if (Object.keys(updates).length > 0) {
            updateParams(updates)
          }
        }
      } catch {
        // Ignore malformed entries
      }
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [accounts, query, serializedParams, types, updateParams, years])

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
