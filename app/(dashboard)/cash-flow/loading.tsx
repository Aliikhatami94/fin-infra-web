import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CashFlowLoading() {
  return (
    <div className="space-y-6" aria-busy>
      <Skeleton className="h-8 w-48" />

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="card-standard">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-6" rounded="full" />
              </div>
              <Skeleton className="h-9 w-40" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-2 w-full" rounded="full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="card-standard">
        <CardHeader>
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-8 w-28" rounded="full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="card-standard">
        <CardHeader>
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full rounded-lg" />
        </CardContent>
      </Card>

      <Card className="card-standard">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-4 w-48" />
            <div className="flex flex-wrap items-center gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-24" rounded="full" />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-80 w-full rounded-lg" />
          <div className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-2 h-3 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="card-standard">
        <CardHeader>
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-2 h-3 w-32" />
              </div>
            ))}
          </div>
          <Skeleton className="h-4 w-36" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="card-standard">
          <CardHeader>
            <Skeleton className="h-4 w-40" />
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
          <CardHeader>
            <Skeleton className="h-4 w-44" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-dashed border-border/40 p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <Skeleton className="h-4 w-20" />
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
  )
}
