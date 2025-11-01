import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LandingHeader } from "@/components/landing-header"
import { BackToTopButton } from "@/components/back-to-top-button"
import { 
  BarChart3, 
  Lock, 
  Zap, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  ArrowRight,
  Check,
  TrendingUpIcon
} from "lucide-react"
import { BRAND } from "@/lib/brand"
import { cn } from "@/lib/utils"

type FeatureSlug = "analytics" | "security" | "automation" | "insights" | "portfolio" | "cashflow"

interface FeatureContent {
  slug: FeatureSlug
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  benefits: string[]
  capabilities: {
    title: string
    description: string
  }[]
  ctaText: string
}

const featureContent: Record<FeatureSlug, FeatureContent> = {
  analytics: {
    slug: "analytics",
    title: "Real-time Analytics",
    subtitle: "Make data-driven decisions with live insights",
    description: "Track your portfolio performance, market movements, and financial metrics with comprehensive real-time analytics. Stay ahead with instant updates and intelligent visualizations that surface the insights that matter most.",
    icon: <BarChart3 className="h-12 w-12" />,
    benefits: [
      "Live data synchronization across all accounts",
      "Customizable dashboards with drag-and-drop widgets",
      "Benchmark performance against major indices",
      "Export reports in multiple formats (PDF, CSV, Excel)",
      "Advanced filtering and time-range comparisons",
      "Mobile-optimized charts and tables"
    ],
    capabilities: [
      {
        title: "Performance Tracking",
        description: "Monitor returns, volatility, and risk metrics across your entire portfolio with granular time-series analysis."
      },
      {
        title: "Custom KPIs",
        description: "Define and track the metrics that matter to your strategy, with alerts when thresholds are reached."
      },
      {
        title: "Attribution Analysis",
        description: "Understand what's driving performance with detailed attribution by asset class, sector, and security."
      }
    ],
    ctaText: "Start Analyzing Your Portfolio"
  },
  security: {
    slug: "security",
    title: "Secure & Reliable",
    subtitle: "Bank-level security you can trust",
    description: "Your financial data deserves the highest level of protection. We employ enterprise-grade security measures, including end-to-end encryption, multi-factor authentication, and continuous monitoring to keep your information safe.",
    icon: <Lock className="h-12 w-12" />,
    benefits: [
      "256-bit AES encryption for data at rest",
      "TLS 1.3 encryption for data in transit",
      "Multi-factor authentication (MFA) with hardware key support",
      "SOC 2 Type II certified infrastructure",
      "Regular third-party security audits",
      "Granular permission controls for team access"
    ],
    capabilities: [
      {
        title: "Advanced Authentication",
        description: "Adaptive MFA that adjusts based on risk signals, with support for authenticator apps and hardware security keys."
      },
      {
        title: "Session Management",
        description: "Monitor active sessions across devices with one-click revoke capabilities and automatic timeout policies."
      },
      {
        title: "Audit Logging",
        description: "Complete audit trail of all access and changes, exportable for compliance and security reviews."
      }
    ],
    ctaText: "Secure Your Financial Data"
  },
  automation: {
    slug: "automation",
    title: "Integrated Workflows",
    subtitle: "Automate tedious tasks and save hours every week",
    description: "Eliminate manual data entry and repetitive tasks with powerful automation. From transaction categorization to report generation, let intelligent workflows handle the busy work while you focus on strategic decisions.",
    icon: <Zap className="h-12 w-12" />,
    benefits: [
      "Automatic transaction categorization with ML",
      "Scheduled report generation and distribution",
      "Smart alerts via email, Slack, or SMS",
      "API integrations with major accounting platforms",
      "CSV/Excel import and export automation",
      "Customizable approval workflows"
    ],
    capabilities: [
      {
        title: "Rule-Based Automation",
        description: "Create sophisticated rules to automatically tag, categorize, and route transactions based on your criteria."
      },
      {
        title: "Notification System",
        description: "Get instant alerts when thresholds are hit, anomalies are detected, or approvals are needed."
      },
      {
        title: "Data Sync",
        description: "Bi-directional sync with your existing tools via API, webhooks, or scheduled batch uploads."
      }
    ],
    ctaText: "Automate Your Workflow"
  },
  insights: {
    slug: "insights",
    title: "Smart Insights",
    subtitle: "AI-powered recommendations that drive results",
    description: "Our AI copilot analyzes your portfolio, cash flow, and market conditions to surface actionable opportunities. Get proactive suggestions for tax optimization, rebalancing, and risk management—all backed by sophisticated algorithms.",
    icon: <Sparkles className="h-12 w-12" />,
    benefits: [
      "Tax loss harvesting recommendations",
      "Portfolio rebalancing suggestions",
      "Cash flow anomaly detection",
      "Risk concentration alerts",
      "Opportunity scoring and prioritization",
      "Natural language explanations for every insight"
    ],
    capabilities: [
      {
        title: "Proactive Recommendations",
        description: "Receive daily digests highlighting the most impactful actions you can take, ranked by potential benefit."
      },
      {
        title: "Explainable AI",
        description: "Every insight includes a clear explanation of why it matters and how we calculated the impact."
      },
      {
        title: "Action Tracking",
        description: "Pin, dismiss, or resolve insights with full audit history so your team stays aligned on decisions."
      }
    ],
    ctaText: "Unlock AI-Powered Insights"
  },
  portfolio: {
    slug: "portfolio",
    title: "Portfolio Tracking",
    subtitle: "Unified view of all your investments",
    description: "Consolidate accounts from multiple brokerages, banks, and custodians into one comprehensive portfolio view. Track performance, analyze allocation, and model scenarios—all in real-time with institutional-grade accuracy.",
    icon: <TrendingUp className="h-12 w-12" />,
    benefits: [
      "Aggregate holdings from 10,000+ financial institutions",
      "Real-time pricing and valuation updates",
      "Asset allocation breakdown by class, sector, geography",
      "Performance attribution and factor analysis",
      "Tax lot tracking with FIFO/LIFO support",
      "Scenario modeling and what-if analysis"
    ],
    capabilities: [
      {
        title: "Multi-Account Aggregation",
        description: "Connect checking, savings, brokerage, crypto, and alternative investments in one unified dashboard."
      },
      {
        title: "Allocation Drift Visualization",
        description: "See at a glance how your current allocation compares to target, with suggested rebalancing trades."
      },
      {
        title: "Stakeholder Sharing",
        description: "Generate read-only snapshots for LPs, execs, or advisors without giving them full access to your accounts."
      }
    ],
    ctaText: "Track Your Portfolio"
  },
  cashflow: {
    slug: "cashflow",
    title: "Cash Flow Planning",
    subtitle: "Forecast liquidity with confidence",
    description: "Anticipate cash needs and runway opportunities with predictive cash flow projections. Overlay expected inflows with committed outflows to stay ahead of liquidity crunches and make informed capital allocation decisions.",
    icon: <Shield className="h-12 w-12" />,
    benefits: [
      "Rolling 12-month cash flow projections",
      "Scenario planning for fundraising and exits",
      "Inflow/outflow categorization and trends",
      "Runway calculations based on burn rate",
      "Integration with payroll and AP systems",
      "Board-ready summary exports"
    ],
    capabilities: [
      {
        title: "Predictive Forecasting",
        description: "Machine learning models analyze historical patterns to predict future cash positions with confidence intervals."
      },
      {
        title: "Scenario Modeling",
        description: "Model different outcomes around fundraising, capital calls, or major expenses to plan for uncertainty."
      },
      {
        title: "Liquidity Alerts",
        description: "Get early warnings when projected cash balance will drop below your threshold, giving you time to act."
      }
    ],
    ctaText: "Plan Your Cash Flow"
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const feature = featureContent[slug as FeatureSlug]

  if (!feature) {
    return {
      title: "Feature Not Found",
      description: "The requested feature page could not be found."
    }
  }

  return {
    title: `${feature.title} - ${BRAND.name}`,
    description: feature.description,
    openGraph: {
      title: `${feature.title} - ${BRAND.name}`,
      description: feature.description,
      type: "website",
    },
  }
}

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const feature = featureContent[slug as FeatureSlug]

  if (!feature) {
    notFound()
  }

  return (
    <div className="relative min-h-screen">
      <LandingHeader />
      <BackToTopButton />

      <main id="main-content" className="pt-16">
        {/* Hero Section */}
        <section className="relative px-6 pt-24 pb-16 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              {/* Icon */}
              <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-primary/10 p-6 text-primary">
                {feature.icon}
              </div>

              {/* Title */}
              <h1 className="mb-4 text-foreground text-[clamp(2.5rem,5.5vw,4rem)] font-bold tracking-tight leading-[1.1]">
                {feature.title}
              </h1>

              {/* Subtitle */}
              <p className="mb-6 text-xl font-medium text-foreground/80 lg:text-2xl">
                {feature.subtitle}
              </p>

              {/* Description */}
              <p className="mx-auto mb-10 max-w-3xl text-base leading-relaxed text-muted-foreground lg:text-lg">
                {feature.description}
              </p>

              {/* CTA */}
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full px-8 text-base font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  <Link href="/sign-up" aria-label={`Get started with ${feature.title}`}>
                    {feature.ctaText}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full px-8 text-base font-medium"
                >
                  <Link href="/" aria-label="Return to home page">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="relative px-6 py-16 lg:px-8 bg-muted/30">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-8 text-center text-3xl font-semibold tracking-tight text-foreground">
              Key Benefits
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {feature.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 rounded-lg border border-border/40 bg-card/80 p-4 shadow-sm"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="relative px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight text-foreground">
              Powerful Capabilities
            </h2>
            <div className="space-y-8">
              {feature.capabilities.map((capability, index) => (
                <div
                  key={capability.title}
                  className={cn(
                    "grid gap-8 rounded-2xl border border-border/30 bg-card/80 p-8 shadow-sm lg:grid-cols-[1fr_2fr]",
                    index % 2 === 1 && "lg:grid-cols-[2fr_1fr]"
                  )}
                >
                  <div className={cn("space-y-3", index % 2 === 1 && "lg:order-2")}>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {capability.title}
                    </h3>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {capability.description}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-xl bg-muted/50 p-8",
                      index % 2 === 1 && "lg:order-1"
                    )}
                  >
                    <div className="text-center text-sm text-muted-foreground">
                      <TrendingUpIcon className="mx-auto h-16 w-16 mb-3 text-primary/40" aria-hidden="true" />
                      <p className="font-medium">Visual Demo</p>
                      <p className="text-xs mt-1">Coming Soon</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight">
              Ready to get started?
            </h2>
            <p className="mb-10 text-xl text-muted-foreground">
              Join leading finance teams using {BRAND.name} to streamline their operations
            </p>
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full px-8 text-base font-medium shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Link href="/sign-up" aria-label={`Sign up for ${BRAND.name} to use ${feature.title}`}>
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/20 bg-background/40 backdrop-blur-xl px-6 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium text-muted-foreground">{BRAND.name}</span>
            </div>
            <p className="text-xs font-light text-muted-foreground">© 2025 {BRAND.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
