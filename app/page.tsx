import Link from "next/link"
import { Button } from "@/components/ui/button"
import { VantaBackground } from "@/components/vanta-background"
import { TrendingUp, Shield, Zap, BarChart3, Sparkles, Lock, ExternalLink } from "lucide-react"
import { BRAND } from "@/lib/brand"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  return (
    <>
      <VantaBackground />

      <div className="relative min-h-screen">
        <header>
          <nav
            aria-label="Primary"
            className="fixed top-0 left-0 right-0 z-50 border-b border-border/20 bg-background/75 backdrop-blur-xl"
          >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" aria-hidden />
                  <span className="text-lg font-semibold tracking-tight">{BRAND.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-sm font-medium text-foreground/80 underline-offset-4 hover:text-foreground focus-visible:ring-offset-2"
                  >
                    <Link href="/sign-in" aria-label={`Sign in to your ${BRAND.name} account`}>
                      Sign In
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full text-sm font-semibold focus-visible:ring-offset-2"
                  >
                    <Link href="/sign-in" aria-label={`Create your ${BRAND.name} account`}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </nav>
        </header>

        <main id="main-content">
          <section className="relative px-6 pt-40 pb-32 lg:px-8 lg:pt-48">
            <div
              className="absolute inset-0 -z-10 block bg-gradient-to-b from-background/85 via-background/75 to-background/90 sm:hidden"
              aria-hidden="true"
            />
            <div className="mx-auto max-w-5xl">
              <div className="text-center">
                <h1 className="mb-7 text-foreground text-[clamp(2.75rem,6vw,4.75rem)] font-semibold tracking-tight leading-tight">
                  Trading Made
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Simplified
                  </span>
                </h1>

                <p className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
                  Track your portfolio, analyze market trends, and make informed decisions with our comprehensive trading
                  platform.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 rounded-full px-8 text-base font-medium shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-offset-2"
                  >
                    <Link href="/sign-in" aria-label={`Start trading with ${BRAND.name} by creating your account`}>
                      Start Trading
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-12 rounded-full px-8 text-base font-medium text-foreground hover:bg-foreground/5 focus-visible:ring-offset-2"
                  >
                    <Link href="/(dashboard)/overview" aria-label={`Watch a product demo of the ${BRAND.name} trading dashboard`}>
                      Watch Demo
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="relative px-6 py-32 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                  <Link
                    key={feature.title}
                    href={feature.href}
                    className={cn(
                      "group relative flex h-full min-h-[20rem] flex-col justify-between overflow-hidden rounded-3xl border border-border/30 bg-card/80 p-8 text-left shadow-[var(--shadow-soft)] transition-all",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
                      "hover:-translate-y-1 hover:shadow-[var(--shadow-bold)] hover:border-primary/40",
                    )}
                    aria-label={`${feature.title} – learn more`}
                  >
                    <div className="mb-6 flex h-14 w-14 items-center justify-center self-start rounded-2xl bg-[var(--surface-security)]/25 text-primary transition-transform duration-300 group-hover:-translate-y-1">
                      {feature.icon}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold tracking-tight text-foreground">{feature.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      Explore <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="relative px-6 py-32 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 text-[clamp(2.25rem,5vw,3.5rem)] font-semibold tracking-tight">
                Ready to start
                <br />
                trading?
              </h2>
              <p className="mb-10 text-xl font-light text-muted-foreground lg:text-2xl">
                Join thousands of traders who trust {BRAND.name}
              </p>
              <div className="mb-10 flex flex-col items-center gap-4 text-sm text-muted-foreground sm:flex-row sm:justify-center">
                <div className="flex items-center gap-3 rounded-full border border-border/40 bg-card/80 px-4 py-2 shadow-sm">
                  <span className="font-semibold uppercase tracking-wide text-foreground/80">Fortress Bank</span>
                  <span className="font-semibold uppercase tracking-wide text-foreground/80">Radial Ventures</span>
                  <span className="font-semibold uppercase tracking-wide text-foreground/80">Northern Equity</span>
                </div>
                <div className="max-w-sm text-xs italic text-muted-foreground">
                  “Fin-Infra delivers the clarity our family office needed to act quickly and confidently.” — Maya, CIO
                </div>
              </div>
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full px-8 text-base font-medium shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-offset-2"
              >
                <Link href="/sign-in" aria-label={`Get started with ${BRAND.name} today`}>
                  Get Started Now
                </Link>
              </Button>
            </div>
          </section>
        </main>

        <footer className="relative border-t border-border/20 bg-background/40 backdrop-blur-xl px-6 py-8 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">{BRAND.name}</span>
              </div>
              <p className="text-xs font-light text-muted-foreground">© 2025 {BRAND.name}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

const features = [
  {
    icon: <BarChart3 className="h-7 w-7" />,
    title: "Real-time Analytics",
    description: "Track your portfolio performance with live data and comprehensive analytics.",
    href: "/overview",
  },
  {
    icon: <Lock className="h-7 w-7" />,
    title: "Secure & Reliable",
    description: "Bank-level security with encrypted data storage and secure authentication.",
    href: "/settings/security",
  },
  {
    icon: <Zap className="h-7 w-7" />,
    title: "Lightning Fast",
    description: "Execute trades instantly with our optimized platform and real-time data.",
    href: "/transactions",
  },
  {
    icon: <Sparkles className="h-7 w-7" />,
    title: "Smart Insights",
    description: "AI-powered insights help you make informed decisions and spot opportunities.",
    href: "/insights",
  },
  {
    icon: <TrendingUp className="h-7 w-7" />,
    title: "Portfolio Tracking",
    description: "Monitor all your investments in one place with detailed performance metrics.",
    href: "/portfolio",
  },
  {
    icon: <Shield className="h-7 w-7" />,
    title: "Risk Management",
    description: "Advanced tools to help you manage risk and protect your investments.",
    href: "/cash-flow",
  },
]
