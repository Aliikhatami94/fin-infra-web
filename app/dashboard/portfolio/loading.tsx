import { ChartCardSkeleton } from "@/components/chart-skeleton"
import {
  AllocationGridSkeleton,
  HoldingsTableSkeleton,
  PortfolioAIInsightsSkeleton,
  PortfolioKPIsSkeleton,
  RebalancingPreviewSkeleton,
} from "@/components/dashboard-skeletons"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function PortfolioLoading() {
  return (
    <>
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-3">
          <Skeleton className="h-7 w-32" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1200px] space-y-6 px-4 py-6 sm:px-6 lg:px-10" aria-busy>
        <PortfolioKPIsSkeleton />

        <PortfolioAIInsightsSkeleton />

        <Card className="card-standard">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8" rounded="lg" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-6 w-24" rounded="full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="mt-2 h-3 w-32" />
                  <Skeleton className="mt-2 h-3 w-24" />
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10" rounded="lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-56" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                    <Skeleton className="h-7 w-24" rounded="full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <RebalancingPreviewSkeleton />

        <ChartCardSkeleton title="" contentHeight="h-[400px]" />
        <AllocationGridSkeleton />
        <HoldingsTableSkeleton />
      </div>

      <Skeleton className="fixed bottom-6 right-6 h-14 w-14 rounded-full md:hidden" />
    </>
  )
}
