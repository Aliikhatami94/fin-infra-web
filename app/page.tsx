import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LandingHeader } from "@/components/landing-header"
import { TrendingUp, Shield, Zap, BarChart3, Sparkles, Lock, ExternalLink, ArrowDownRight } from "lucide-react"
import { BRAND } from "@/lib/brand"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
        <LandingHeader />

        <main id="main-content">
          <section className="relative px-6 pt-32 pb-24 lg:px-8 lg:pt-40">
            <div
              className="absolute inset-0 -z-10 block bg-gradient-to-b from-background/90 via-background/80 to-background/95 sm:hidden"
              aria-hidden="true"
            />
            <div className="mx-auto max-w-5xl">
              <div className="text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  <span>AI-powered financial intelligence</span>
                </div>
                
                <h1 className="mb-6 text-foreground text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold tracking-tight leading-[1.1]">
                  Financial clarity for
                  <br />
                  <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                    every decision
                  </span>
                </h1>

                <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Orchestrate portfolios, cash flow, and planning in one secure platform built to surface actionable insights
                  the moment your finance team needs them.
                </p>

                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="h-11 rounded-full px-8 text-base font-medium bg-gradient-to-r from-primary to-primary/90 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                  >
                    <Link href="/sign-up" aria-label={`Launch your ${BRAND.name} workspace by creating an account`}>
                      Launch Your Workspace
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-11 rounded-full px-8 text-base font-medium border-border/50 hover:border-border hover:bg-accent/5"
                  >
                    <Link href="/demo" aria-label={`Watch a guided tour of the ${BRAND.name} financial platform`}>
                      Watch Platform Tour
                    </Link>
                  </Button>
                </div>
                <div className="mt-10 flex flex-col items-center justify-center gap-6 text-sm text-muted-foreground sm:flex-row">
                  <div className="flex flex-wrap items-center justify-center gap-3 rounded-full border border-border/30 bg-muted/30 px-5 py-2 backdrop-blur-sm">
                    <span className="text-xs font-medium text-muted-foreground">Trusted by</span>
                    <span className="text-xs font-semibold text-foreground">Fortress Bank</span>
                    <span className="text-xs font-semibold text-foreground">Radial Ventures</span>
                    <span className="text-xs font-semibold text-foreground">Northern Equity</span>
                  </div>
                  <div className="max-w-xs text-center text-xs italic text-muted-foreground">
                    {`“Our auditors praised the visibility ${BRAND.name} provides across every quarterly review.”`}
                  </div>
                </div>
                <Link
                  href="#product-highlights"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                  aria-label="Scroll to the feature highlights section"
                >
                  Explore product highlights
                  <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>

          <section
            id="product-highlights"
            aria-labelledby="product-highlights-heading"
            className="relative px-6 py-32 lg:px-8"
          >
            <div className="mx-auto max-w-7xl">
              <h2
                id="product-highlights-heading"
                className="mb-12 text-center text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight text-foreground"
              >
                Product highlights
              </h2>
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
            <div className="mx-auto max-w-5xl space-y-24">
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">Product highlights</p>
                <h2 id="feature-highlights" className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight">
                  Discover how {BRAND.name} elevates every part of your workflow
                </h2>
              </div>

              {featureHighlights.map((highlight) => (
                <article
                  key={highlight.id}
                  id={highlight.id}
                  aria-labelledby={`${highlight.id}-title`}
                  className="grid items-center gap-8 rounded-3xl border border-border/30 bg-card/80 p-8 shadow-[var(--shadow-soft)] lg:grid-cols-[1.2fr_1fr]"
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
            <div className="mx-auto max-w-4xl text-center">
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
    snapshot: (
      <>
        <p className="font-medium text-foreground">Allocation overview</p>
        <p className="mt-2">
          Break down holdings by asset class, geography, and performance to uncover concentration risk instantly.
        </p>
      </>
    ),
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
