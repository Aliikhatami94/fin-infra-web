"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Sparkles } from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { ProtectedRoute } from "@/components/protected-route"

function WelcomeGatePageContent() {
  const router = useRouter()
  const { user } = useAuth()

  // If the user has completed onboarding (server-side flag), redirect to dashboard
  useEffect(() => {
    if (!user) return
    if (user.onboarding_completed) {
      router.replace("/overview")
    }
  }, [user, router])

  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* Soft backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/80 to-background/95" />
      <div className="pointer-events-none absolute inset-0 -z-10 backdrop-blur-xl" />

      <main className="mx-auto flex min-h-dvh w-full max-w-[720px] flex-col items-center justify-center p-6">
        <Card className="w-full shadow-[var(--shadow-bold)]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure setup
              </Badge>
            </div>
            <CardTitle className="text-2xl font-semibold text-foreground">Welcome back</CardTitle>
            <CardDescription>
              Finish onboarding to unlock your personalized Money Graph and live KPIs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1">
              <li>Connect your institutions to power live insights.</li>
              <li>Confirm your goals so we can prioritize what matters.</li>
              <li>Preview your Money Graph before you dive in.</li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-muted-foreground">
              Your data is encrypted and never shared without permission.
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button asChild variant="ghost">
                <Link href="/demo">Browse demo</Link>
              </Button>
              <Button asChild className="gap-2">
                <Link href="/onboarding">
                  <Sparkles className="h-4 w-4" />
                  Start guided onboarding
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

export default function WelcomeGatePage() {
  return (
    <ProtectedRoute requireOnboarding={false}>
      <WelcomeGatePageContent />
    </ProtectedRoute>
  )
}
