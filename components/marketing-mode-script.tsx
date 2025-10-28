"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { isMarketingMode } from "@/lib/marketingMode"

/**
 * Client component that sets the marketing mode data attribute on the HTML element.
 * This activates the marketing mode CSS styles (hide scrollbars, cursors, etc.)
 */
export function MarketingModeScript() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const inMarketingMode = isMarketingMode(searchParams)
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-marketing-mode", inMarketingMode ? "true" : "false")
    }
  }, [searchParams])

  return null
}
