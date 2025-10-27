import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CryptoLoading() {
  return (
    <>
      <div className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur-md">
        <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6 lg:px-10">
          <Skeleton className="h-7 w-32" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1200px] space-y-6 px-4 py-6 sm:px-6 lg:px-10" aria-busy>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-20" />
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-24" rounded="full" />
            ))}
          </div>
          <Skeleton className="h-9 w-40" rounded="full" />
        </div>

        <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Crypto grouping controls">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-11 w-48 rounded-full" />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="card-standard card-lift min-h-[280px]">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-8" rounded="lg" />
                </div>
                <Skeleton className="h-8 w-36" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-12 w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="card-standard">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8" rounded="lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
            <Skeleton className="h-3 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <Card key={index} className="card-standard card-lift">
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-56" />
                        <div className="space-y-1 text-xs">
                          {Array.from({ length: 3 }).map((_, weightIndex) => (
                            <div key={weightIndex} className="flex items-center gap-2">
                              <Skeleton className="h-2.5 w-2.5 rounded-full" />
                              <Skeleton className="h-3 w-24" />
                              <Skeleton className="h-3 w-12" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Skeleton className="h-8 w-28" rounded="full" />
                      <Skeleton className="h-8 w-32" rounded="full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/40 bg-muted/10 p-4">
              <div className="space-y-1">
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-8 w-32" rounded="full" />
            </div>
            <div className="grid gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-72" />
                    </div>
                    <Skeleton className="h-8 w-28" rounded="full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-standard">
          <CardHeader className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-8 w-24" rounded="full" />
              <Skeleton className="h-8 w-24" rounded="full" />
              <Skeleton className="h-8 w-24" rounded="full" />
              <Skeleton className="h-8 w-24" rounded="full" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full rounded-lg" />
          </CardContent>
        </Card>

        <Card className="card-standard">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-9 w-36" rounded="full" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="card-standard card-lift">
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                      <Skeleton className="h-6 w-20" rounded="full" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="flex items-center justify-between border-t border-border/30 pt-3">
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-12" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-3 w-3" rounded="full" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-4 w-10" />
                      </div>
                    </div>
                    <Skeleton className="h-9 w-full" rounded="full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-standard">
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-8 w-28" rounded="full" />
              <Skeleton className="h-8 w-28" rounded="full" />
              <Skeleton className="h-8 w-28" rounded="full" />
              <Skeleton className="h-8 w-28" rounded="full" />
            </div>
            <div className="grid grid-cols-7 gap-3 border-b border-border/40 bg-muted/30 px-4 py-3 text-xs">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton key={index} className="h-3" />
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-7 gap-3 px-4 py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10" rounded="lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
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
          </CardContent>
        </Card>

        <Card className="card-standard">
          <CardHeader className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-64" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-72" />
                  </div>
                  <Skeleton className="h-8 w-28" rounded="full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Skeleton className="fixed bottom-6 right-6 h-14 w-14 rounded-full md:hidden" />
      </div>
    </>
  )
}
