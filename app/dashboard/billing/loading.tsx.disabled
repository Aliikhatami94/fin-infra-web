import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function BillingLoading() {
  return (
    <>
      <div className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <div className="space-y-1">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-6 w-24" rounded="full" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1200px] space-y-6 px-4 py-6 sm:px-6 lg:px-10" aria-busy>
        <Card className="card-standard">
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 rounded-lg border border-dashed border-border/40 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-16" rounded="full" />
                </div>
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-44" />
              </div>
              <Skeleton className="h-10 w-32" rounded="full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-40" />
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" rounded="full" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-standard">
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 rounded-lg border border-dashed border-border/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12" rounded="lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-9 w-24" rounded="full" />
            </div>
            <Skeleton className="h-10 w-full" rounded="md" />
          </CardContent>
        </Card>

        <Card className="card-standard">
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 rounded-lg border border-dashed border-border/40 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-7 w-20" rounded="full" />
                  <Skeleton className="h-9 w-9" rounded="full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
