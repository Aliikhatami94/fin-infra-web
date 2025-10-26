import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TransactionsLoading() {
  return (
    <>
      {/* Sticky compact Header */}
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-3">
          <Skeleton className="h-7 w-32" />
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10 py-6 space-y-6" aria-busy>
        <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-32" rounded="full" />
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <Card className="card-standard">
          <CardContent className="space-y-4 p-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-48" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-9 w-28" rounded="full" />
                ))}
              </div>
              <Skeleton className="h-10 w-full rounded-md" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-24" rounded="full" />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card className="card-standard">
            <CardContent className="space-y-3 p-5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-4 w-28" />
            </CardContent>
          </Card>
          <Card className="card-standard">
            <CardContent className="space-y-3 p-5">
              <Skeleton className="h-4 w-24" />
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full rounded-md" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </>
  )
}
