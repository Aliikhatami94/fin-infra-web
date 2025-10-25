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
    <div className="space-y-6" aria-busy>
      <Skeleton className="h-8 w-32" />

      <PortfolioKPIsSkeleton />

      <PortfolioAIInsightsSkeleton />

      <Card className="card-standard">
        <CardHeader>
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-8 w-8" rounded="lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-3 w-72" />
                </div>
                <Skeleton className="h-7 w-20" rounded="full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <RebalancingPreviewSkeleton />

      <ChartCardSkeleton title="" contentHeight="h-[400px]" />
      <AllocationGridSkeleton />
      <HoldingsTableSkeleton />

      <Skeleton className="fixed bottom-6 right-6 h-14 w-14 rounded-full md:hidden" />
    </div>
  )
}
