import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function GrowthLoading() {
  return (
    <div className="space-y-8" aria-busy>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Skeleton className="h-10 w-56" rounded="md" />
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-9 w-32" rounded="full" />
            <Skeleton className="h-9 w-32" rounded="full" />
            <Skeleton className="h-9 w-40" rounded="full" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="card-standard xl:col-span-2">
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
            <Skeleton className="h-[320px] w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card className="card-standard">
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="mt-2 h-3 w-28" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="card-standard">
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {Array.from({ length: 3 }).map((_, chipIndex) => (
                  <Skeleton key={chipIndex} className="h-8 w-28" rounded="full" />
                ))}
              </div>
              <Skeleton className="h-[280px] w-full rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
