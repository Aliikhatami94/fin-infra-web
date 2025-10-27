import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CashFlowLoading() {
  return (
    <>
      <div className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur-md">
        <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6 lg:px-10">
          <Skeleton className="h-7 w-32" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1200px] space-y-6 px-4 py-6 sm:px-6 lg:px-10" aria-busy>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="card-standard">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-6" rounded="full" />
                </div>
                <Skeleton className="h-9 w-36" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 w-full" rounded="full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="card-standard">
          <CardHeader className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-64" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-9 w-9" rounded="lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                  <Skeleton className="h-7 w-20" rounded="full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-standard">
          <CardHeader className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-8 w-28" rounded="full" />
              <Skeleton className="h-8 w-28" rounded="full" />
              <Skeleton className="h-8 w-28" rounded="full" />
              <Skeleton className="h-8 w-8" rounded="md" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-[350px] w-full rounded-lg" />
            <div className="grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-lg border border-dashed border-border/40 p-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-2 h-2 w-full" rounded="full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-standard">
          <CardHeader className="space-y-2">
            <Skeleton className="h-4 w-44" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-28" rounded="full" />
              <Skeleton className="h-8 w-28" rounded="full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
              <Skeleton className="h-5 w-5" rounded="full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-60" />
              </div>
              <Skeleton className="h-5 w-5" rounded="full" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="space-y-2 rounded-lg border border-dashed border-border/40 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-standard">
          <CardHeader className="space-y-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-52" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="mt-3 h-3 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="card-standard">
            <CardHeader className="space-y-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="mt-2 h-3 w-40" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="card-standard">
            <CardHeader className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-60" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10" rounded="lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Skeleton className="h-6 w-20" rounded="full" />
                    <Skeleton className="h-6 w-24" rounded="full" />
                    <Skeleton className="h-6 w-16" rounded="full" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
