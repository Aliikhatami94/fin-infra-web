import { DocumentSkeleton } from "@/components/document-skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DocumentsLoading() {
  return (
    <>
      <div className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur-md">
        <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <Skeleton className="h-6 w-20" rounded="full" />
              <Skeleton className="h-9 flex-1 min-w-[200px] rounded-md sm:flex-none sm:w-64" />
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-6 sm:px-6 lg:px-10" aria-busy>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-24 rounded-full" />
            ))}
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="relative -mx-2">
            <div className="flex items-center gap-2 overflow-x-auto px-2 pb-2 text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-28 rounded-full" />
              ))}
            </div>
            <span className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent" aria-hidden />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <Skeleton className="h-3 w-64" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>

        <Card className="card-standard">
          <CardContent className="space-y-4 p-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-dashed border-border/40 bg-muted/20 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-56" />
                    <div className="flex items-center gap-2 text-xs">
                      <Skeleton className="h-4 w-4" rounded="full" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-7 w-24" rounded="full" />
                    <Skeleton className="h-7 w-24" rounded="full" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <DocumentSkeleton key={i} />
          ))}
        </div>

        <Card className="card-standard">
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/50 bg-muted/10 p-6 text-center">
              <Skeleton className="h-10 w-10" rounded="lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Skeleton className="h-9 w-28" rounded="full" />
                <Skeleton className="h-9 w-36" rounded="full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-standard">
          <CardHeader className="space-y-2">
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
                    <Skeleton className="h-4 w-52" />
                    <Skeleton className="h-3 w-72" />
                  </div>
                  <Skeleton className="h-7 w-24" rounded="full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
