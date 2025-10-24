import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BRAND } from "@/lib/brand"
import { CheckCircle2, Compass, LineChart, ShieldCheck } from "lucide-react"

const highlights = [
  {
    icon: <LineChart className="h-5 w-5 text-primary" aria-hidden="true" />,
    title: "Performance visibility",
    description: "Track net worth, allocation drift, and tax impacts in one streamlined view.",
  },
  {
    icon: <Compass className="h-5 w-5 text-primary" aria-hidden="true" />,
    title: "Guided workflows",
    description: "Follow curated tasks that lead you from insight to action without context switching.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />,
    title: "Security that scales",
    description: "Granular controls, session insights, and secure document storage are built in.",
  },
]

export default function DemoPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <header className="border-b border-border/30 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span className="font-medium">{BRAND.name} Demo Tour</span>
          </div>
          <Button asChild variant="ghost" size="sm" className="focus-visible:ring-offset-2">
            <Link href="/" aria-label="Return to the landing page">
              Back to home
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              See {BRAND.name} in action
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Explore the guided walkthrough to understand how our platform centralizes portfolio oversight, automates
              insights, and keeps teams aligned on every decision.
            </p>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-3xl border border-border/30 bg-card shadow-[var(--shadow-soft)]">
                <div className="aspect-video bg-muted">
                  <video
                    controls
                    poster="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80"
                    className="h-full w-full"
                    aria-describedby="demo-video-description"
                  >
                    <source
                      src="https://cdn.coverr.co/videos/coverr-man-looking-at-stock-market-data-8809/1080p.mp4"
                      type="video/mp4"
                    />
                    <track
                      default
                      kind="captions"
                      src="/demo-captions.vtt"
                      srcLang="en"
                      label="English captions"
                    />
                    {`Your browser does not support the video tag.`}
                  </video>
                </div>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground" id="demo-video-description">
                <p>
                  This narrated walkthrough highlights how {BRAND.name} centralizes oversight, surfaces timely insights, and
                  keeps your team aligned. Captions are available through the player controls.
                </p>
                <p>
                  Prefer a personal walkthrough? Reach out to our team and we&apos;ll tailor the experience to your workflows. You
                  can also{' '}
                  <Link
                    href="/demo-transcript.txt"
                    className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
                  >
                    download the full transcript
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          <Card className="border-border/30 bg-card/80 shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">What you&apos;ll learn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {highlights.map((highlight) => (
                <div key={highlight.title} className="flex items-start gap-3">
                  {highlight.icon}
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{highlight.title}</p>
                    <p className="text-sm text-muted-foreground">{highlight.description}</p>
                  </div>
                </div>
              ))}
              <Separator className="bg-border/40" />
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Continue into the app to explore dashboards, collaborate with your advisor, and implement ideas in real
                  time.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="flex-1 focus-visible:ring-offset-2">
                    <Link href="/sign-in" aria-label={`Create your ${BRAND.name} account after watching the demo`}>
                      Get started
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 focus-visible:ring-offset-2">
                    <Link
                      href="/#product-highlights"
                      aria-label={`Browse ${BRAND.name} product highlights without leaving the landing page`}
                    >
                      Browse product
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
