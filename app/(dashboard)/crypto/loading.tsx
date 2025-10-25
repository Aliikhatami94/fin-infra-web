import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CryptoLoading() {
  return (
    <div className="space-y-6" aria-busy>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-32" />
        <div className="flex flex-wrap items-center gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-28" rounded="full" />
          ))}
          <Skeleton className="h-8 w-28" rounded="full" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3" role="toolbar">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-40" rounded="full" />
        ))}
        <Skeleton className="h-10 w-48" rounded="full" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="card-standard card-lift">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-6" rounded="full" />
              </div>
              <Skeleton className="h-8 w-36" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-24" />
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
        <CardHeader>
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full rounded-lg" />
        </CardContent>
      </Card>

      <Card className="card-standard">
        <CardHeader className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-2 h-3 w-24" />
              </div>
            ))}
          </div>
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>

      <Card className="card-standard">
        <CardHeader className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-28" rounded="full" />
            ))}
          </div>
          <div className="overflow-hidden rounded-lg border border-border/40">
            <div className="grid grid-cols-7 gap-3 border-b border-border/40 bg-muted/30 px-4 py-3 text-xs">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton key={index} className="h-3" />
              ))}
            </div>
            <div className="divide-y divide-border/40">
              {Array.from({ length: 6 }).map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-7 gap-3 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9" rounded="lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
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

      <Card className="card-standard">
        <CardHeader className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-72" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-52" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-7 w-24" rounded="full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Skeleton className="fixed bottom-6 right-6 h-14 w-14 rounded-full md:hidden" />
    </div>
  )
}
