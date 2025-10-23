import { ChartCardSkeleton } from "@/components/chart-skeleton"
import {
  AIInsightsListSkeleton,
  PortfolioSkeleton,
  RecentActivitySkeleton,
} from "@/components/dashboard-skeletons"
import { cn } from "@/lib/utils"

function Placeholder({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted/70", className)} />
}

export default function OverviewLoading() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6" aria-busy>
      <section className="space-y-4">
        <Placeholder className="h-5 w-28" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card-standard space-y-3">
              <Placeholder className="h-3 w-20" />
              <Placeholder className="h-8 w-28" />
              <Placeholder className="h-4 w-full" />
              <Placeholder className="h-8 w-full" />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Placeholder className="h-5 w-44" />
        <div className="card-standard space-y-3">
          <Placeholder className="h-3 w-36" />
          <Placeholder className="h-12 w-full" />
          <Placeholder className="h-12 w-full" />
        </div>
      </section>

      <section className="space-y-4">
        <Placeholder className="h-5 w-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCardSkeleton title="" contentHeight="h-72" className="h-full" />
          <ChartCardSkeleton title="" contentHeight="h-72" className="h-full" />
        </div>
      </section>

      <section className="space-y-4">
        <Placeholder className="h-5 w-52" />
        <ChartCardSkeleton title="" contentHeight="h-72" />
      </section>

      <section className="space-y-4">
        <Placeholder className="h-5 w-36" />
        <PortfolioSkeleton />
      </section>

      <section className="space-y-4">
        <Placeholder className="h-5 w-40" />
        <RecentActivitySkeleton />
      </section>

      <section className="space-y-4">
        <Placeholder className="h-5 w-32" />
        <AIInsightsListSkeleton />
      </section>
    </div>
  )
}
