import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AccountsKPICardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="card-standard card-lift">
          <CardContent className="flex h-full flex-col justify-between gap-4 p-6">
            <Skeleton className="h-4 w-28" rounded="full" />
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-10 w-10" rounded="lg" />
            </div>
            <div className="flex items-end justify-between gap-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-9 w-28" rounded="lg" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function AIInsightsBannerSkeleton() {
  return (
    <Card className="border-border/30 bg-gradient-to-r from-muted/60 to-muted">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-8 w-8" rounded="lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Skeleton className="h-5 w-5" rounded="lg" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AccountsTableSkeleton() {
  return (
    <Card className="card-standard">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-64" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-9 w-32" rounded="full" />
        </div>
        <div className="flex flex-col gap-3 border-t border-dashed border-border/40 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-8 w-32" rounded="full" />
            <Skeleton className="h-8 w-32" rounded="full" />
            <Skeleton className="h-8 w-32" rounded="full" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-24" rounded="full" />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-dashed border-border/40">
          <div className="grid grid-cols-2 gap-3 border-b border-border/40 px-4 py-3 text-sm md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-4" />
            ))}
          </div>
          <div className="space-y-3 px-4 py-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-lg border border-border/20 bg-muted/30 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10" rounded="lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-20" rounded="full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PortfolioSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="space-y-2 text-right">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-64 rounded-md" />
        <div className="overflow-hidden rounded-lg border border-border/40">
          <div className="grid grid-cols-7 gap-3 border-b border-border/40 bg-muted/40 px-4 py-3 text-xs md:text-sm">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="h-4" />
            ))}
          </div>
          <div className="divide-y divide-border/40">
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-7 gap-3 px-4 py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10" rounded="lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                {Array.from({ length: 6 }).map((_, cellIndex) => (
                  <div key={cellIndex} className="flex items-center justify-end">
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function RecentActivitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-40" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Array.from({ length: 3 }).map((_, groupIndex) => (
          <div key={groupIndex} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <Skeleton className="h-3 w-24" rounded="full" />
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="relative space-y-4 pl-12">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="relative flex items-start gap-4 rounded-lg border border-border/30 bg-muted/20 p-4"
                >
                  <Skeleton className="relative z-10 h-10 w-10" rounded="full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function AIInsightsListSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="card-standard">
          <CardContent className="space-y-3 p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-9 w-9" rounded="lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-7 w-24" rounded="full" />
              <Skeleton className="h-7 w-28" rounded="full" />
              <Skeleton className="h-7 w-24" rounded="full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function PortfolioKPIsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="card-standard card-lift">
          <CardContent className="flex h-full flex-col justify-between gap-4 p-6">
            <Skeleton className="h-4 w-20" rounded="full" />
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-10 w-10" rounded="lg" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function PortfolioAIInsightsSkeleton() {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start gap-3">
        <Skeleton className="h-8 w-8" rounded="lg" />
        <div className="min-w-[200px] flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-8 w-28" rounded="full" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="card-standard">
            <CardContent className="space-y-3 p-5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-full" />
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-7 w-24" rounded="full" />
                <Skeleton className="h-7 w-20" rounded="full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function RebalancingPreviewSkeleton() {
  return (
    <Card className="card-standard border-primary/20">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8" rounded="lg" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
          <Skeleton className="h-9 w-40" rounded="full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 rounded-lg border border-border/40 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-1 items-center gap-3">
              <Skeleton className="h-6 w-20" rounded="full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <div className="space-y-2 text-right">
              <Skeleton className="ml-auto h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-3 border-t border-dashed border-border/40 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-7 w-28" rounded="full" />
        </div>
      </CardContent>
    </Card>
  )
}

export function AllocationGridSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" rounded="full" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}

export function HoldingsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-40" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-10 w-64 rounded-md" />
          <Skeleton className="h-8 w-28" rounded="full" />
          <Skeleton className="h-8 w-28" rounded="full" />
        </div>
        <div className="overflow-hidden rounded-lg border border-border/40">
          <div className="grid grid-cols-7 gap-3 border-b border-border/40 bg-muted/40 px-4 py-3 text-xs md:text-sm">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="h-4" />
            ))}
          </div>
          <div className="divide-y divide-border/40">
            {Array.from({ length: 8 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-7 gap-3 px-4 py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10" rounded="lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                {Array.from({ length: 6 }).map((_, cellIndex) => (
                  <div key={cellIndex} className="flex items-center justify-end">
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
