import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { BRAND } from "@/lib/brand"

export function LandingHeader() {
  return (
  <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        aria-label="Primary"
        className="border-b border-border/20 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/40 transition-colors"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
              aria-label={`${BRAND.name} home`}
            >
              <Sparkles className="h-4 w-4 text-primary" strokeWidth={2} aria-hidden />
              <span className="text-base font-semibold tracking-tight text-foreground">
                {BRAND.name}
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg"
              >
                <Link href="/sign-in" aria-label={`Sign in to your ${BRAND.name} account`}>
                  Sign In
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="h-8 px-4 rounded-full text-xs font-medium"
              >
                <Link href="/sign-up" aria-label={`Create your ${BRAND.name} account`}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
