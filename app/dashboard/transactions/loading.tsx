import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TransactionsLoading() {
  return (
    <>
      <div className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur-md">
        <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6 lg:px-10">
          <Skeleton className="h-7 w-36" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1200px] space-y-6 px-4 py-6 sm:px-6 lg:px-10" aria-busy>
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="card-standard card-lift">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10" rounded="lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-52" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                  <Skeleton className="h-6 w-20" rounded="full" />
                </div>
                <div className="space-y-2 text-xs">
                  {Array.from({ length: 3 }).map((_, metricIndex) => (
                    <div key={metricIndex} className="flex items-center gap-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {Array.from({ length: 3 }).map((_, chipIndex) => (
                    <Skeleton key={chipIndex} className="h-7 w-24" rounded="full" />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-32" rounded="full" />
                  <Skeleton className="h-9 w-24" rounded="full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="card-standard">
          <CardHeader className="space-y-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-9 w-60" rounded="md" />
                <Skeleton className="h-9 w-40" rounded="md" />
                <Skeleton className="h-9 w-36" rounded="md" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-28" rounded="full" />
                <Skeleton className="h-9 w-28" rounded="full" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-28" rounded="full" />
              ))}
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <Skeleton className="h-3 w-64" />
                <Skeleton className="h-3 w-40" />
              </div>
              <div className="rounded-xl border border-border/40">
                <div className="flex items-center gap-2 border-b border-border/40 bg-muted/30 px-4 py-3">
                  <Skeleton className="h-8 w-28" rounded="full" />
                  <Skeleton className="h-8 w-28" rounded="full" />
                  <Skeleton className="h-8 w-28" rounded="full" />
                </div>
                <div className="divide-y divide-border/30">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between gap-3 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10" rounded="lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-36" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-20" rounded="full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="border border-border/40">
                <CardContent className="space-y-3 p-5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
              <Card className="border border-border/40">
                <CardContent className="space-y-3 p-5">
                  <Skeleton className="h-4 w-36" />
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-lg border border-dashed border-border/40 p-3">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="mt-2 h-3 w-40" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
