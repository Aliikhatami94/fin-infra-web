"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LandingHeader } from "@/components/landing-header"
import { Home, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="sticky top-0 z-20">
        <LandingHeader />
      </div>

      <main className="relative">
        <section className="relative grid min-h-[90vh] place-items-center px-6 py-20 lg:px-8">
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-b from-background/90 via-background/80 to-background/95"
            aria-hidden="true"
          />

          <div className={cn("relative z-10 mx-auto max-w-3xl text-center")}> 
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span>404</span>
              <span className="text-primary/70">Page not found</span>
            </div>
            <h1 className="mt-6 text-[clamp(2.25rem,5vw,3.5rem)] font-semibold tracking-tight text-foreground">
              Oops—this page seems to be missing
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
              The link may be broken or the page may have moved. You can head back home or watch a quick product tour.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-11 rounded-full px-6">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  <span>Back to home</span>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 rounded-full px-6">
                <Link href="/demo">
                  <ExternalLink className="h-4 w-4" />
                  <span>Watch demo</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
