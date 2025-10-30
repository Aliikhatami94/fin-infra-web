import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function BudgetLoading() {
  return (
    <>
      <div className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur-md">
        <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <Skeleton className="h-6 w-28 md:h-7 md:w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-6 sm:px-6 lg:px-10 md:space-y-8" aria-busy>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Select budget month">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-32 rounded-md" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
            <Skeleton className="h-8 w-32 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="card-standard card-lift">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-9 w-9" rounded="lg" />
                </div>
                <Skeleton className="h-8 w-36" />
                <div className="space-y-2">
                  <Skeleton className="h-2 w-full" rounded="full" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="card-standard">
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-80" />
              </div>
              <div className="w-full max-w-md space-y-3">
                <Skeleton className="h-2 w-full" rounded="full" />
                <Skeleton className="h-2 w-full" rounded="full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-8" />
                </div>
              </div>
            </div>
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>

        <Card className="card-standard">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8" rounded="lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-60" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-3 w-72" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Skeleton className="h-7 w-24" rounded="full" />
                    <Skeleton className="h-7 w-20" rounded="full" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-standard">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10" rounded="lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
            <Skeleton className="h-6 w-28" rounded="full" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-xl border border-border/40 bg-muted/20 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                    <Skeleton className="h-5 w-16" rounded="full" />
                  </div>
                  <Skeleton className="mt-3 h-3 w-24" />
                  <Skeleton className="mt-2 h-3 w-32" />
                </div>
              ))}
            </div>
            <div className="space-y-5">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, metricIndex) => (
                      <div key={metricIndex} className="rounded-lg border border-dashed border-border/40 p-3">
                        <Skeleton className="h-3 w-28" />
                        <Skeleton className="mt-2 h-2 w-full" rounded="full" />
                        <Skeleton className="mt-2 h-3 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="card-standard">
            <CardHeader className="space-y-3">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-40" />
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-8 w-28" rounded="full" />
                <Skeleton className="h-8 w-28" rounded="full" />
                <Skeleton className="h-8 w-28" rounded="full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="overflow-hidden rounded-lg border border-border/30">
                <div className="grid grid-cols-4 gap-3 border-b border-border/30 bg-muted/20 px-4 py-3 text-xs">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-3" />
                  ))}
                </div>
                <div className="divide-y divide-border/30">
                  {Array.from({ length: 5 }).map((_, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-4 gap-3 px-4 py-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-standard">
            <CardHeader className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-28" rounded="full" />
                <Skeleton className="h-8 w-28" rounded="full" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[320px] w-full rounded-lg" />
            </CardContent>
          </Card>
        </div>

  {/* Floating add button skeleton removed */}
      </div>
    </>
  )
}
