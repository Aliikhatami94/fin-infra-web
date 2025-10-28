import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
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
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-36" rounded="full" />
      </div>

      {Array.from({ length: 5 }).map((_, sectionIndex) => (
        <Card key={sectionIndex} className="card-standard">
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 border-b border-border/40 pb-4 last:border-0 last:pb-0 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-72" />
                </div>
                <Skeleton className="h-9 w-24" rounded="full" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Card className="card-standard">
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-64" rounded="md" />
          <div className="flex flex-wrap items-center gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-28" rounded="full" />
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </>
  )
}
