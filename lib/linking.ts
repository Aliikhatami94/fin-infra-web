"use client"

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

import { toast } from "@/components/ui/sonner"

export const DASHBOARD_FALLBACK_ROUTE = "/overview"

const DUMMY_ORIGIN = "https://example.com"

export const isHashLink = (href: string | null | undefined): href is string => {
  return typeof href === "string" && href.startsWith("#")
}

export const isAppRoute = (href: string | null | undefined): href is string => {
  return typeof href === "string" && /^\/(?!\/)/.test(href)
}

export const isInternalNavigation = (href: string | null | undefined): href is string => {
  return isAppRoute(href) || isHashLink(href)
}

export const isExternalUrl = (href: string | null | undefined): href is string => {
  if (typeof href !== "string" || href.length === 0) {
    return false
  }

  if (isInternalNavigation(href)) {
    return false
  }

  try {
    const target = new URL(
      href,
      typeof window !== "undefined" && window.location?.origin ? window.location.origin : DUMMY_ORIGIN,
    )
    if (typeof window === "undefined") {
      return target.origin !== DUMMY_ORIGIN
    }
    return target.origin !== window.location.origin
  } catch {
    return false
  }
}

export const getAnchorRel = (href: string | null | undefined) => {
  return isExternalUrl(href) ? "noreferrer noopener" : undefined
}

export const getAnchorTarget = (href: string | null | undefined) => {
  return isExternalUrl(href) ? "_blank" : undefined
}

interface NavigationOptions {
  replace?: boolean
  fallbackHref?: string
  fallbackLabel?: string
  toastMessage?: string
  toastDescription?: string
  silent?: boolean
}

const isPromiseLike = (value: unknown): value is Promise<unknown> => {
  return typeof value === "object" && value !== null && "then" in value && typeof (value as Promise<unknown>).then === "function"
}

export async function navigateInApp(
  router: AppRouterInstance,
  href: string,
  {
    replace = false,
    fallbackHref = DASHBOARD_FALLBACK_ROUTE,
    fallbackLabel,
    toastMessage,
    toastDescription,
    silent = false,
  }: NavigationOptions = {},
) {
  if (!isInternalNavigation(href)) {
    if (typeof window !== "undefined") {
      window.location.href = href
      return true
    }
    return false
  }

  try {
    const navigationResult = replace ? router.replace(href) : router.push(href)
    if (isPromiseLike(navigationResult)) {
      await navigationResult
    }
    return true
  } catch (error) {
    console.error(`[Navigation] Failed to navigate to ${href}`)
    console.error(error)

    if (!silent) {
      toast.error(toastMessage ?? "We couldn't open that view.", {
        description: toastDescription ?? "Check your connection and try again or return to your dashboard.",
        action: {
          label: fallbackLabel ?? "Back to dashboard",
          onClick: () => {
            try {
              const fallbackResult = router.push(fallbackHref)
              if (isPromiseLike(fallbackResult)) {
                fallbackResult.catch((fallbackError) => {
                  console.error(`[Navigation] Failed to navigate to fallback ${fallbackHref}`)
                  console.error(fallbackError)
                  if (typeof window !== "undefined") {
                    window.location.href = fallbackHref
                  }
                })
              }
            } catch (fallbackError) {
              console.error(`[Navigation] Failed to navigate to fallback ${fallbackHref}`)
              console.error(fallbackError)
              if (typeof window !== "undefined") {
                window.location.href = fallbackHref
              }
            }
          },
        },
      })
    }

    return false
  }
}

export async function prefetchAppRoute(router: AppRouterInstance, href: string) {
  if (!isAppRoute(href) || typeof router.prefetch !== "function") {
    return false
  }

  try {
    const prefetchResult = router.prefetch(href)
    if (isPromiseLike(prefetchResult)) {
      await prefetchResult
    }
    return true
  } catch (error) {
    console.error(`[Navigation] Failed to prefetch ${href}`)
    console.error(error)
    return false
  }
}

export const getBadgeTooltipCopy = (
  itemName: string,
  badge: string | number | undefined,
  explicitTooltip?: string,
) => {
  if (typeof explicitTooltip === "string" && explicitTooltip.trim().length > 0) {
    return explicitTooltip
  }

  if (badge === undefined) {
    return undefined
  }

  const count = typeof badge === "number" ? badge : Number.parseInt(String(badge), 10)
  if (Number.isFinite(count)) {
    const formattedCount = Math.abs(count as number)
    const itemLabel = formattedCount === 1 ? "item needs your attention" : "items need your attention"
    return `${formattedCount} ${itemLabel} in ${itemName}`
  }

  return `${itemName} has updates to review`
}
