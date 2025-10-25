import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function InsightsLoading() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6" aria-busy>
      <div className="sticky top-0 -mx-4 mb-6 border-b border-border/20 bg-background/90 px-4 py-4 backdrop-blur-md sm:-mx-6 lg:-mx-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="relative flex-1 sm:w-64">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <Skeleton className="h-9 w-32" rounded="md" />
            <Skeleton className="h-9 w-40" rounded="full" />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto rounded-full bg-muted/30 p-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-40" rounded="full" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="card-standard">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10" rounded="lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <Skeleton className="h-6 w-20" rounded="full" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {Array.from({ length: 3 }).map((_, chipIndex) => (
                  <Skeleton key={chipIndex} className="h-7 w-24" rounded="full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
