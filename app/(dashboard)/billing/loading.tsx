import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function BillingLoading() {
  return (
    <>
      {/* Sticky compact Header */}
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-3">
          <Skeleton className="h-7 w-32" />
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-10 py-6 space-y-6" aria-busy>
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>

      <Card className="card-standard">
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 rounded-lg border border-dashed border-border/40 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-4 w-44" />
            </div>
            <Skeleton className="h-10 w-32" rounded="full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
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
                <Skeleton className="h-4 w-32" />
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
