"use client"

import { useAuth } from "@/lib/auth/context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, type ReactNode } from "react"

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

  useEffect(() => {
    // First check: Must be authenticated
    if (!isLoading && !user) {
      router.push(redirectTo)
      return
    }

    // Second check: If accessing dashboard routes, must have completed onboarding
    if (!isLoading && user && requireOnboarding) {
      // Allow access to onboarding flow and welcome page
      const allowedPaths = ["/welcome", "/onboarding"]
      const isAllowedPath = allowedPaths.some(path => pathname?.startsWith(path))
      
      if (!isAllowedPath && !user.onboarding_completed) {
        router.push("/welcome")
      }
    }
  }, [user, isLoading, router, redirectTo, requireOnboarding, pathname])

  // Show nothing while checking auth or redirecting
  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show nothing while checking onboarding status for dashboard routes
  if (requireOnboarding && !user.onboarding_completed) {
    const allowedPaths = ["/welcome", "/onboarding"]
    const isAllowedPath = allowedPaths.some(path => pathname?.startsWith(path))
    
    if (!isAllowedPath) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Checking onboarding status...</p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}
