import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"
import { BRAND } from "@/lib/brand"

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        aria-label="Primary"
        className="border-b border-border/5 bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
              aria-label={`${BRAND.name} home`}
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-primary/90 shadow-sm ring-1 ring-primary/20">
                <TrendingUp className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} aria-hidden />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
              <span className="text-lg font-semibold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {BRAND.name}
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-9 px-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors rounded-lg"
              >
                <Link href="/sign-in" aria-label={`Sign in to your ${BRAND.name} account`}>
                  Sign In
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="h-9 px-5 rounded-full bg-primary text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
