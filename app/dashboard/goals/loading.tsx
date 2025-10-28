import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function GoalsLoading() {
  return (
    <>
      <div className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur-md">
        <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-9 w-32" rounded="full" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1200px] space-y-6 px-4 py-6 sm:px-6 lg:px-10" aria-busy>
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="card-standard card-lift">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8" rounded="lg" />
                </div>
                <Skeleton className="h-8 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-2 w-full" rounded="full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="card-standard">
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
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
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-3 w-56" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-72" />
                  </div>
                  <Skeleton className="h-7 w-24" rounded="full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-standard">
          <CardHeader className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="card-standard card-lift">
                  <CardContent className="space-y-3 p-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <div className="flex items-center gap-2 text-xs">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-28 rounded-full" />
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="card-standard">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-16" rounded="full" />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

  {/* Floating add goal skeleton removed */}
    </>
  )
}
