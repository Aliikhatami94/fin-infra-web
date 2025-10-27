import { ChartCardSkeleton } from "@/components/chart-skeleton"
import {
  AIInsightsListSkeleton,
  PortfolioSkeleton,
  RecentActivitySkeleton,
} from "@/components/dashboard-skeletons"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function OverviewLoading() {
  return (
    <>
      <div className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur-md">
        <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6 lg:px-10">
          <Skeleton className="h-7 w-32" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1200px] space-y-6 px-4 py-6 sm:px-6 lg:px-10" aria-busy>
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="card-standard card-lift">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-6" rounded="full" />
                  </div>
                  <Skeleton className="h-8 w-32" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5" rounded="full" />
            <Skeleton className="h-5 w-44" />
          </div>
          <Card className="card-standard">
            <CardContent className="space-y-4 p-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-dashed border-border/40 bg-muted/20 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-56" />
                      <div className="flex items-center gap-2 text-xs">
                        <Skeleton className="h-4 w-4" rounded="full" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Skeleton className="h-8 w-24" rounded="full" />
                      <Skeleton className="h-8 w-24" rounded="full" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCardSkeleton title="" contentHeight="h-72" className="h-full" />
            <ChartCardSkeleton title="" contentHeight="h-72" className="h-full" />
          </div>
        </section>

        <section className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <ChartCardSkeleton title="" contentHeight="h-72" />
        </section>

        <section className="space-y-4">
          <Skeleton className="h-6 w-44" />
          <PortfolioSkeleton />
        </section>

        <section className="space-y-4">
          <Skeleton className="h-6 w-36" />
          <RecentActivitySkeleton />
        </section>

        <section className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <AIInsightsListSkeleton />
        </section>
      </div>
    </>
  )
}
