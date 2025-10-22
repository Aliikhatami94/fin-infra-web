import Link from "next/link"
import { Button } from "@/components/ui/button"
import { VantaBackground } from "@/components/vanta-background"
import { TrendingUp, Shield, Zap, BarChart3, Sparkles, Lock } from "lucide-react"
import { BRAND } from "@/lib/brand"

export default function LandingPage() {
  return (
    <>
      <VantaBackground />

      <div className="relative min-h-screen">
        <header>
          <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/20 bg-background/70 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="flex h-14 items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-foreground" />
                  <span className="text-lg font-semibold tracking-tight">{BRAND.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Link href="/sign-in">
                    <Button variant="ghost" size="sm" className="text-sm font-normal">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button size="sm" className="rounded-full text-sm font-medium">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </header>

        <main id="main-content">
          <section className="relative px-6 pt-40 pb-32 lg:px-8 lg:pt-48">
            <div className="mx-auto max-w-5xl">
              <div className="text-center">
                <h1 className="mb-7 text-6xl font-semibold tracking-tight text-foreground sm:text-7xl lg:text-8xl lg:leading-[1.1]">
                  Trading Made
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Simplified
                  </span>
                </h1>

                <p className="mx-auto mb-12 max-w-2xl text-xl font-light leading-relaxed text-muted-foreground lg:text-2xl">
                  Track your portfolio, analyze market trends, and make informed decisions with our comprehensive trading
                  platform.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link href="/sign-in">
                    <Button
                      size="lg"
                      className="h-12 rounded-full px-8 text-base font-medium shadow-lg transition-all hover:shadow-xl"
                    >
                      Start Trading
                    </Button>
                  </Link>
                  <Link href="/(dashboard)/overview">
                    <Button
                      size="lg"
                      variant="ghost"
                      className="h-12 rounded-full px-8 text-base font-normal text-foreground hover:bg-foreground/5"
                    >
                      Watch Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="relative px-6 py-32 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group rounded-3xl border border-border/20 bg-background/40 backdrop-blur-xl p-10 transition-all duration-300 hover:bg-background/60 hover:shadow-2xl hover:shadow-black/5"
                  >
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground/5 text-foreground transition-all duration-300 group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <h3 className="mb-3 text-xl font-semibold tracking-tight">{feature.title}</h3>
                    <p className="font-light leading-relaxed text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative px-6 py-32 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 text-5xl font-semibold tracking-tight lg:text-6xl">
                Ready to start
                <br />
                trading?
              </h2>
              <p className="mb-10 text-xl font-light text-muted-foreground lg:text-2xl">
                Join thousands of traders who trust {BRAND.name}
              </p>
              <Link href="/sign-in">
                <Button
                  size="lg"
                  className="h-12 rounded-full px-8 text-base font-medium shadow-lg transition-all hover:shadow-xl"
                >
                  Get Started Now
                </Button>
              </Link>
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
  },
  {
    icon: <Lock className="h-7 w-7" />,
    title: "Secure & Reliable",
    description: "Bank-level security with encrypted data storage and secure authentication.",
  },
  {
    icon: <Zap className="h-7 w-7" />,
    title: "Lightning Fast",
    description: "Execute trades instantly with our optimized platform and real-time data.",
  },
  {
    icon: <Sparkles className="h-7 w-7" />,
    title: "Smart Insights",
    description: "AI-powered insights help you make informed decisions and spot opportunities.",
  },
  {
    icon: <TrendingUp className="h-7 w-7" />,
    title: "Portfolio Tracking",
    description: "Monitor all your investments in one place with detailed performance metrics.",
  },
  {
    icon: <Shield className="h-7 w-7" />,
    title: "Risk Management",
    description: "Advanced tools to help you manage risk and protect your investments.",
  },
]
