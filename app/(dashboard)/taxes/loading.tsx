import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TaxesLoading() {
  return (
  <div className="mx-auto w-full max-w-[1200px] space-y-8" aria-busy>
      <div className="sticky top-0 -mx-4 mb-6 border-b border-border/20 bg-card/90 px-4 py-4 backdrop-blur-sm sm:-mx-6 lg:-mx-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-10 w-52" rounded="md" />
          </div>
          <Skeleton className="h-10 w-56" rounded="full" />
        </div>
      </div>

      <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20">
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-96" />
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-orange-200/70 bg-white/80 px-4 py-3 dark:border-orange-900/60 dark:bg-orange-950/40">
              <Skeleton className="h-10 w-10" rounded="full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-orange-200/60 bg-white/80 p-4 dark:border-orange-900/60 dark:bg-orange-950/40">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="mt-2 h-3 w-32" />
                <Skeleton className="mt-3 h-8 w-28" rounded="full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="card-standard">
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="space-y-2 rounded-lg border border-dashed border-border/40 p-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
                <Skeleton className="h-[220px] w-full rounded-lg" />
              </div>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-7 w-24" rounded="full" />
                </div>
                <Skeleton className="mt-2 h-3 w-64" />
                <div className="mt-4 space-y-2">
                  {Array.from({ length: 3 }).map((_, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between rounded-md border border-border/30 px-4 py-3">
                      <Skeleton className="h-3 w-40" />
                      <Skeleton className="h-3 w-20" />
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
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-64" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="mt-2 h-3 w-56" />
                <Skeleton className="mt-2 h-3 w-36" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="card-standard">
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-72" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-3 w-60" />
                  </div>
                  <Skeleton className="h-6 w-20" rounded="full" />
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, chipIndex) => (
                    <Skeleton key={chipIndex} className="h-8 w-full" rounded="md" />
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
