"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { LandingHeader } from "@/components/landing-header"
import { BackToTopButton } from "@/components/back-to-top-button"
import { SkipLink } from "@/components/skip-link"
import { FooterBackToTop } from "@/components/footer-back-to-top"
import { AutomationLearnMoreModal } from "@/components/automation-learn-more-modal"
import { InsightPreviewModal } from "@/components/insight-preview-modal"
import { AllocationComparisonSlider } from "@/components/allocation-comparison-slider"
import { LandingInteractiveDemo } from "@/components/marketing/landing-interactive-demo"
import { TrendingUp, Shield, Zap, BarChart3, Sparkles, Lock, ExternalLink, ArrowDownRight } from "lucide-react"
import { BRAND } from "@/lib/brand"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const [contentVisible, setContentVisible] = useState(() =>
    typeof window !== "undefined" && (window as Window & { __introPlayed?: boolean }).__introPlayed ? true : false,
  )
  const [showIntro, setShowIntro] = useState(() =>
    typeof window !== "undefined" && (window as Window & { __introPlayed?: boolean }).__introPlayed ? false : true,
  )
  const cleanupTimerRef = useRef<number | null>(null)
  const introFallbackTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    // Skip intro on client-side navigations within the same document
    if ((window as Window & { __introPlayed?: boolean }).__introPlayed) {
      setContentVisible(true)
      setShowIntro(false)
      // Ensure we always start at the top
      try {
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        window.scrollTo(0, 0)
      } catch {}
      return
    }

    // Ensure we always start at the top
    try {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      window.scrollTo(0, 0)
    } catch {}

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    if (mediaQuery.matches) {
      setContentVisible(true)
      setShowIntro(false)
      ;(window as Window & { __introPlayed?: boolean }).__introPlayed = true
      return
    }

    introFallbackTimerRef.current = window.setTimeout(() => {
      introFallbackTimerRef.current = null
      // Reveal content and keep scroll at top
      setContentVisible(true)
      ;(window as Window & { __introPlayed?: boolean }).__introPlayed = true
      try {
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        window.scrollTo(0, 0)
      } catch {}
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current)
        cleanupTimerRef.current = null
      }
      cleanupTimerRef.current = window.setTimeout(() => {
        setShowIntro(false)
        cleanupTimerRef.current = null
      }, 520)
    }, 1800)

    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        if (introFallbackTimerRef.current) {
          clearTimeout(introFallbackTimerRef.current)
          introFallbackTimerRef.current = null
        }
        if (cleanupTimerRef.current) {
          clearTimeout(cleanupTimerRef.current)
          cleanupTimerRef.current = null
        }
        setContentVisible(true)
        setShowIntro(false)
      }
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current)
        cleanupTimerRef.current = null
      }
      if (introFallbackTimerRef.current) {
        clearTimeout(introFallbackTimerRef.current)
        introFallbackTimerRef.current = null
      }
    }
  }, [])

  // Lock body scroll while intro overlay is visible and keep at top
  useEffect(() => {
    if (typeof document === "undefined") return
    if (showIntro) {
      const prevOverflow = document.body.style.overflow
      const prevOverscroll = document.documentElement.style.overscrollBehavior
      try {
        document.body.style.overflow = "hidden"
        document.documentElement.style.overscrollBehavior = "contain"
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        window.scrollTo(0, 0)
      } catch {}
      return () => {
        document.body.style.overflow = prevOverflow
        document.documentElement.style.overscrollBehavior = prevOverscroll
      }
    } else {
      try {
        document.body.style.overflow = ""
        document.documentElement.style.overscrollBehavior = ""
        window.scrollTo(0, 0)
      } catch {}
    }
  }, [showIntro])

  const handleIntroAnimationEnd = () => {
    if (contentVisible) {
      return
    }

    // Snap to top as the intro ends
    try {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      window.scrollTo(0, 0)
    } catch {}

    setContentVisible(true)
    ;(window as Window & { __introPlayed?: boolean }).__introPlayed = true

    if (introFallbackTimerRef.current) {
      clearTimeout(introFallbackTimerRef.current)
      introFallbackTimerRef.current = null
    }

    if (cleanupTimerRef.current) {
      clearTimeout(cleanupTimerRef.current)
      cleanupTimerRef.current = null
    }

    if (typeof window !== "undefined") {
      cleanupTimerRef.current = window.setTimeout(() => {
        setShowIntro(false)
        cleanupTimerRef.current = null
      }, 520)
    }
  }

  const getTransitionDelay = (index: number, baseDelay: number) =>
    contentVisible ? `${baseDelay + index * 0.05}s` : "0s"

  return (
    <div className="relative min-h-screen overflow-hidden">
        <SkipLink />
        <div
          className={cn(
            "transition-opacity duration-700 ease-[var(--ease-standard)]",
            contentVisible ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <LandingHeader />
        </div>
        <div
          className={cn(
            "transition-opacity duration-700 ease-[var(--ease-standard)]",
            contentVisible ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <BackToTopButton />
        </div>

        {showIntro && (
          <div
            className={cn(
              "pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-background via-background to-background/95 transition-opacity duration-400 ease-[var(--ease-standard)]",
              contentVisible ? "opacity-0" : "opacity-100",
            )}
            aria-hidden
          >
            <div className="relative flex items-center justify-center">
              <div className="intro-icon-glow absolute inset-0 rounded-[2.75rem]" aria-hidden />
              <div
                className="intro-icon relative flex h-48 w-48 items-center justify-center rounded-[2.75rem] bg-gradient-to-br from-primary via-primary/85 to-primary/65 text-primary-foreground shadow-[0_36px_120px_rgba(80,62,185,0.35)]"
                onAnimationEnd={handleIntroAnimationEnd}
              >
                <TrendingUp className="h-24 w-24" strokeWidth={2.25} aria-hidden />
              </div>
            </div>
          </div>
        )}

        <main id="main-content" className="relative">
          <LandingInteractiveDemo />

          <section
            id="product-highlights"
            aria-labelledby="product-highlights-heading"
            className="relative px-6 py-32 lg:px-8 scroll-mt-20"
          >
            <div
              className={cn(
                "mx-auto max-w-7xl transition-all duration-500 ease-[var(--ease-standard)]",
                contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
              )}
              style={{ transitionDelay: contentVisible ? "0.35s" : "0s" }}
            >
              <h2
                id="product-highlights-heading"
                className="mb-12 text-center text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight text-foreground"
              >
                Product highlights
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <Link
                    key={feature.title}
                    href={feature.href}
                    className={cn(
                      "group relative flex h-full min-h-[20rem] flex-col justify-between overflow-hidden rounded-3xl border border-border/30 bg-card/80 p-8 text-left shadow-[var(--shadow-soft)] transition-all duration-500 ease-[var(--ease-standard)]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
                      "hover:-translate-y-1 hover:shadow-[var(--shadow-bold)] hover:border-primary/40",
                      contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
                    )}
                    style={{ transitionDelay: getTransitionDelay(index, 0.4) }}
                    aria-label={`Learn more about ${feature.title}`}
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

          <section aria-labelledby="feature-highlights" className="relative px-6 pb-24 lg:px-8">
            <div
              className={cn(
                "mx-auto max-w-5xl space-y-24 transition-all duration-500 ease-[var(--ease-standard)]",
                contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
              )}
              style={{ transitionDelay: contentVisible ? "0.45s" : "0s" }}
            >
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">Product highlights</p>
                <h2 id="feature-highlights" className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight">
                  Discover how {BRAND.name} elevates every part of your workflow
                </h2>
              </div>

              {featureHighlights.map((highlight, index) => (
                <article
                  key={highlight.id}
                  id={highlight.id}
                  aria-labelledby={`${highlight.id}-title`}
                  className={cn(
                    "grid items-center gap-8 rounded-3xl border border-border/30 bg-card/80 p-8 shadow-[var(--shadow-soft)] lg:grid-cols-[1.2fr_1fr] scroll-mt-20 transition-all duration-500 ease-[var(--ease-standard)]",
                    contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
                  )}
                  style={{ transitionDelay: getTransitionDelay(index, 0.55) }}
                >
                  <div className="space-y-4">
                    <h3 id={`${highlight.id}-title`} className="text-2xl font-semibold tracking-tight text-foreground">
                      {highlight.title}
                    </h3>
                    <p className="text-base leading-relaxed text-muted-foreground">{highlight.body}</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {highlight.points.map((point) => (
                        <li key={point} className="flex items-start gap-2">
                          <span aria-hidden className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-border/40 bg-background/60 p-6 text-sm leading-relaxed text-muted-foreground shadow-inner">
                    {highlight.snapshot}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="relative px-6 py-32 lg:px-8">
            <div
              className={cn(
                "mx-auto max-w-4xl text-center transition-all duration-500 ease-[var(--ease-standard)]",
                contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
              )}
              style={{ transitionDelay: contentVisible ? "0.65s" : "0s" }}
            >
              <h2 className="mb-6 text-[clamp(2.25rem,5vw,3.5rem)] font-semibold tracking-tight">
                Ready to unify your
                <br />
                finance operations?
              </h2>
              <p className="mb-10 text-xl font-light text-muted-foreground lg:text-2xl">
                Join leading finance teams who rely on {BRAND.name} for real-time clarity
              </p>
              <div className="mb-10 flex flex-col items-center gap-4 text-sm text-muted-foreground sm:flex-row sm:justify-center">
                <div className="flex items-center gap-3 rounded-full border border-border/40 bg-card/80 px-4 py-2 shadow-sm">
                  <span className="font-semibold uppercase tracking-wide text-foreground/80">Fortress Bank</span>
                  <span className="font-semibold uppercase tracking-wide text-foreground/80">Radial Ventures</span>
                  <span className="font-semibold uppercase tracking-wide text-foreground/80">Northern Equity</span>
                </div>
                <div className="max-w-sm text-xs italic text-muted-foreground">
                  {`“${BRAND.name} delivers the clarity our family office needed to act quickly and confidently.” — Maya, CIO`}
                </div>
              </div>
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full px-8 text-base font-medium shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-offset-2"
              >
                <Link href="/sign-up" aria-label={`Get started with ${BRAND.name} today`}>
                  Get Started
                </Link>
              </Button>
            </div>
          </section>
        </main>

        <footer
          className={cn(
            "relative border-t border-border/20 bg-background/40 backdrop-blur-xl transition-opacity duration-700 ease-[var(--ease-standard)]",
            contentVisible ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            {/* Main Footer Content */}
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
              {/* Brand Column */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="text-lg font-semibold">{BRAND.name}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Financial clarity for every decision. AI-powered insights for modern finance teams.
                </p>
                <FooterBackToTop />
              </div>

              {/* Product Column */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Product</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/features/analytics" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded">
                      Analytics
                    </Link>
                  </li>
                  <li>
                    <Link href="/features/security" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded">
                      Security
                    </Link>
                  </li>
                  <li>
                    <Link href="/features/automation" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded">
                      Automation
                    </Link>
                  </li>
                  <li>
                    <Link href="/features/insights" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded">
                      Insights
                    </Link>
                  </li>
                  <li>
                    <Link href="/features/portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded">
                      Portfolio
                    </Link>
                  </li>
                  <li>
                    <Link href="/features/cashflow" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded">
                      Cash Flow
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Company</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded">
                      Demo
                    </Link>
                  </li>
                  <li>
                    <Link href="/#product-highlights" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded">
                      Features
                    </Link>
                  </li>
                  <li>
                    <a 
                      href="https://github.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                    >
                      GitHub
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal Column */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Legal</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 pt-8 border-t border-border/20">
              <p className="text-xs text-center text-muted-foreground">
                © 2025 {BRAND.name}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
  )
}

const features = [
  {
    icon: <BarChart3 className="h-7 w-7" />,
    title: "Real-time Analytics",
    description: "Track your portfolio performance with live data and comprehensive analytics.",
    href: "/features/analytics",
  },
  {
    icon: <Lock className="h-7 w-7" />,
    title: "Secure & Reliable",
    description: "Bank-level security with encrypted data storage and secure authentication.",
    href: "/features/security",
  },
  {
    icon: <Zap className="h-7 w-7" />,
    title: "Integrated Workflows",
    description: "Automate reconciliations, approvals, and reporting without leaving your finance hub.",
    href: "/features/automation",
  },
  {
    icon: <Sparkles className="h-7 w-7" />,
    title: "Smart Insights",
    description: "AI-powered insights help you make informed decisions and spot opportunities.",
    href: "/features/insights",
  },
  {
    icon: <TrendingUp className="h-7 w-7" />,
    title: "Portfolio Tracking",
    description: "Monitor all your investments in one place with detailed performance metrics.",
    href: "/features/portfolio",
  },
  {
    icon: <Shield className="h-7 w-7" />,
    title: "Cash Flow Planning",
    description: "Stay ahead of inflows and outflows with guidance that keeps liquidity on track.",
    href: "/features/cashflow",
  },
]

const featureHighlights = [
  {
    id: "feature-analytics",
    title: "Command your finances with a live control center",
    body: "Stay ahead of shifting markets and budgets with streaming balances, performance benchmarks, and alerting that surfaces the moments that matter most.",
    points: [
      "Customize dashboards with saved views for every strategy.",
      "Benchmark against major indices with intraday refreshes.",
      "Share read-only snapshots with stakeholders in one click.",
    ],
    snapshot: (
      <>
        <p className="font-medium text-foreground">Live KPIs &amp; watchlists</p>
        <p className="mt-2">
          Configure cards for net worth, cash runway, and drawdowns with update badges when metrics change.
        </p>
      </>
    ),
  },
  {
    id: "feature-security",
    title: "Bank-grade protections without the friction",
    body: "Every login, device, and download is wrapped in layered security so your team can move fast while staying compliant.",
    points: [
      "Adaptive MFA with hardware key support.",
      "Session timeline with one-click revoke controls.",
      "Export audit logs with SOC 2 ready formatting.",
    ],
    snapshot: (
      <>
        <p className="font-medium text-foreground">Security status</p>
        <p className="mt-2">
          See at a glance which policies are enabled and when the last compliance review was completed.
        </p>
      </>
    ),
  },
  {
    id: "feature-automation",
    title: "Automate tedious workflows end-to-end",
    body: "Smart rules tag transactions, trigger approvals, and nudge teammates so nothing slips between quarterly reviews.",
    points: [
      "Segment transactions by strategy, entity, or custodian automatically.",
      "Send instant alerts to Slack or email when thresholds hit.",
      "Sync clean data to your reporting stack via API or CSV.",
    ],
    snapshot: (
      <>
        <p className="font-medium text-foreground">Automation timeline</p>
        <p className="mt-2">
          Preview pending rules, approvals, and follow-ups to keep back office workflows humming.
        </p>
        <div className="mt-4">
          <AutomationLearnMoreModal />
        </div>
      </>
    ),
  },
  {
    id: "feature-insights",
    title: "AI that surfaces opportunities, not noise",
    body: "Our copilots synthesize holdings, macro signals, and cash flow to highlight where to take action next.",
    points: [
      "Prioritize by risk, return, or liquidity impact.",
      "Pin insights to revisit and resolve with audit history.",
      "Dismiss items with context so teams stay aligned.",
    ],
    snapshot: (
      <>
        <p className="font-medium text-foreground">Insight digest</p>
        <p className="mt-2">
          Receive morning briefings that summarize emerging trends and recommended actions across portfolios.
        </p>
        <div className="mt-4">
          <InsightPreviewModal />
        </div>
      </>
    ),
  },
  {
    id: "feature-portfolio",
    title: "One portfolio view for every stakeholder",
    body: "Aggregate brokerage, banking, and alternatives in a single command center with flexible sharing controls.",
    points: [
      "Visualize allocation drift with suggested rebalancing actions.",
      "Model scenarios across tax lots, fees, and cash needs.",
      "Provide LPs and execs curated snapshots without extra prep.",
    ],
    snapshot: <AllocationComparisonSlider />,
  },
  {
    id: "feature-cashflow",
    title: "Forecast cash flow with confidence",
    body: "Anticipate liquidity crunches and runway opportunities with predictive projections tied to real transaction data.",
    points: [
      "Overlay expected inflows with committed outflows.",
      "Pin insights to capture important scenarios for the team.",
      "Download board-ready summaries in a couple of clicks.",
    ],
    snapshot: (
      <>
        <p className="font-medium text-foreground">Liquidity planner</p>
        <p className="mt-2">
          Scenario plan around fundraising, payroll, and capital calls with rolling 12-month projections.
        </p>
      </>
    ),
  },
]
