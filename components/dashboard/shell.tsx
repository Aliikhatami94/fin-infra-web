import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type BandConfig = {
  content: ReactNode
  span?: "half" | "full"
}

interface DashboardShellProps {
  title: string
  description?: ReactNode
  actions?: ReactNode
  kpis: ReactNode
  bands?: Array<ReactNode | BandConfig>
  insights?: ReactNode
  footer?: ReactNode
  className?: string
}

function resolveBand(band: ReactNode | BandConfig) {
  if (typeof band === "object" && band !== null && "content" in band) {
    return band as BandConfig
  }

  return { content: band, span: "half" as const }
}

export function DashboardShell({
  title,
  description,
  actions,
  kpis,
  bands = [],
  insights,
  footer,
  className,
}: DashboardShellProps) {
  const resolvedBands = bands.map(resolveBand)
  const hasBands = resolvedBands.length > 0

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-6 xl:max-w-[1440px] xl:px-10">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-foreground md:text-2xl">{title}</h1>
            {description ? (
              <div className="text-sm text-muted-foreground">{description}</div>
            ) : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      </header>

      <main className={cn("flex-1", className)}>
        <div className="mx-auto w-full max-w-[1280px] space-y-10 px-4 py-6 sm:px-6 xl:max-w-[1440px] xl:px-10">
          <section>{kpis}</section>

          {hasBands ? (
            <section
              className="grid min-w-0 gap-6 lg:grid-cols-12"
              style={{ gap: "var(--space-gap, 1.5rem)" }}
            >
              {resolvedBands.map(({ content, span = "half" }, index) => (
                <div
                  key={index}
                  className={cn("min-w-0 space-y-4", span === "full" ? "lg:col-span-12" : "lg:col-span-6")}
                >
                  {content}
                </div>
              ))}
            </section>
          ) : null}

          {insights ? <section>{insights}</section> : null}
        </div>
      </main>

      {footer ? (
        <div className="sticky bottom-0 z-10 border-t bg-background/95 px-4 py-3 shadow-lg backdrop-blur sm:px-6 xl:px-10">
          <div className="mx-auto w-full max-w-[1280px] xl:max-w-[1440px]">{footer}</div>
        </div>
      ) : null}
    </div>
  )
}
