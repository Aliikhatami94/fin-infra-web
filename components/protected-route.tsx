"use client"

import { useAuth } from "@/lib/auth/context"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { DASHBOARD_NAVIGATION } from "@/lib/navigation/routes"
import { isMarketingMode } from "@/lib/marketingMode"

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
  requireOnboarding?: boolean
}

export function ProtectedRoute({ 
  children, 
  redirectTo = "/sign-in",
  requireOnboarding = true 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isMarketing = isMarketingMode(searchParams)
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Wait for auth to finish loading before any redirects
    if (isLoading) {
      return
    }

    // Don't check again if we're already redirecting
    if (isRedirecting) {
      return
    }

    // First check: Must be authenticated
    if (!user) {
      setIsRedirecting(true)
      router.push(redirectTo)
      return
    }

    // CRITICAL: Wait until onboarding_completed has a definitive value (true or false)
    // Don't make any decisions while it's null or undefined
    if (user.onboarding_completed === null || user.onboarding_completed === undefined) {
      return
    }

    // Second check: If accessing dashboard routes, must have completed onboarding
    if (requireOnboarding) {
      // Allow access to onboarding flow and welcome page
      const allowedPaths = ["/welcome", "/onboarding"]
      const isAllowedPath = allowedPaths.some(path => pathname?.startsWith(path))
      
      // Only redirect if onboarding_completed is EXPLICITLY false
      if (!isAllowedPath && user.onboarding_completed === false) {
        setIsRedirecting(true)
        router.push("/welcome")
        return
      }
    }

    // Third check: Block access to coming soon pages (unless in marketing mode)
    if (!isMarketing && pathname) {
      const currentRoute = DASHBOARD_NAVIGATION.find(route => {
        if (route.exact) {
          return pathname === route.href
        }
        return pathname.startsWith(route.href)
      })

      if (currentRoute?.comingSoon) {
        setIsRedirecting(true)
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, router, redirectTo, requireOnboarding, pathname, isRedirecting, isMarketing])

  // Show loading spinner while checking auth OR while onboarding_completed is null/undefined
  if (isLoading || (user && (user.onboarding_completed === null || user.onboarding_completed === undefined))) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (redirect is happening)
  if (!user) {
    return null
  }

  // Don't render anything while redirecting to onboarding (prevent flash)
  // CRITICAL: Only block rendering if onboarding_completed is EXPLICITLY false
  if (requireOnboarding && user.onboarding_completed === false) {
    const allowedPaths = ["/welcome", "/onboarding"]
    const isAllowedPath = allowedPaths.some(path => pathname?.startsWith(path))
    
    if (!isAllowedPath) {
      return null
    }
  }

  return <>{children}</>
}
