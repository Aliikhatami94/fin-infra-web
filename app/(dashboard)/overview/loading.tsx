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
    <div className="mx-auto w-full max-w-[1600px] space-y-6" aria-busy>
      <section className="space-y-4">
        <Skeleton className="h-6 w-28" />
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
        <Skeleton className="h-6 w-40" />
        <Card className="card-standard">
          <CardContent className="space-y-3 p-5">
            <Skeleton className="h-4 w-48" />
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-md" />
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
  )
}
