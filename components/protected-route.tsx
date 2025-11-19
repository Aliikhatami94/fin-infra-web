"use client"

import { useAuth } from "@/lib/auth/context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"

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
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Wait for auth to finish loading before any redirects
    if (isLoading) {
      console.log("[ProtectedRoute] Still loading auth, waiting...")
      return
    }

    // Don't check again if we're already redirecting
    if (isRedirecting) {
      console.log("[ProtectedRoute] Already redirecting, skipping")
      return
    }

    // First check: Must be authenticated
    if (!user) {
      console.log("[ProtectedRoute] No user, redirecting to", redirectTo)
      setIsRedirecting(true)
      router.push(redirectTo)
      return
    }

    // CRITICAL: Wait until onboarding_completed has a definitive value (true or false)
    // Don't make any decisions while it's null or undefined
    if (user.onboarding_completed === null || user.onboarding_completed === undefined) {
      console.log("[ProtectedRoute] onboarding_completed is", user.onboarding_completed, "- waiting for definitive value")
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
      }
    }
  }, [user, isLoading, router, redirectTo, requireOnboarding, pathname, isRedirecting])

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
