import { AIInsightsBannerSkeleton, AccountsKPICardsSkeleton, AccountsTableSkeleton } from "@/components/dashboard-skeletons"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AccountsLoading() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6" aria-busy>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" rounded="full" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-12 w-48" rounded="full" />
      </div>

      <AccountsKPICardsSkeleton />

      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="card-standard border-dashed border-border/40">
            <CardContent className="flex gap-4 p-5">
              <Skeleton className="h-10 w-10" rounded="lg" />
              <div className="flex-1 space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex flex-wrap gap-4">
                  {Array.from({ length: 2 }).map((_, metricIndex) => (
                    <div key={metricIndex} className="space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-24" rounded="full" />
                      </div>
                    </div>
                  ))}
                </div>
                <Skeleton className="h-8 w-40" rounded="full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AIInsightsBannerSkeleton />

      <AccountsTableSkeleton />
    </div>
  )
}
