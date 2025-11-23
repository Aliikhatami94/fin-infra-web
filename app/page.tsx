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
import { LandingInteractiveDemo, FinanceBackground } from "@/components/marketing/landing-interactive-demo"
import { TrendingUp, Shield, Zap, BarChart3, Sparkles, Lock, ExternalLink, ArrowDownRight } from "lucide-react"
import { BRAND } from "@/lib/brand"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const getTransitionDelay = (index: number, baseDelay: number) => `${baseDelay + index * 0.05}s`

  return (
    <div className="relative min-h-screen overflow-hidden">
        <FinanceBackground />
        <SkipLink />
        <LandingHeader />
        <BackToTopButton />

        <main id="main-content" className="relative">
          <LandingInteractiveDemo />

          <section aria-labelledby="feature-highlights" className="relative px-6 pb-24 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-24">
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
                  className="grid items-center gap-8 rounded-3xl border border-border/30 bg-card/80 p-8 shadow-[var(--shadow-soft)] lg:grid-cols-[1.2fr_1fr] scroll-mt-20"
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
                  Get Started
                </Link>
              </Button>
            </div>
          </section>
        </main>

        <footer className="relative border-t border-border/20 bg-background/40 backdrop-blur-xl">
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
    snapshot: (
      <>
        <p className="font-medium text-foreground">Portfolio allocation</p>
        <p className="mt-2">
          Track asset allocation across all accounts with real-time rebalancing suggestions.
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
