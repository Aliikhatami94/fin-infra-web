import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6" aria-busy>
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      <Card className="card-standard">
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-9 w-40" rounded="full" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
          <div className="flex justify-end gap-3">
            <Skeleton className="h-9 w-24" rounded="full" />
            <Skeleton className="h-9 w-32" rounded="full" />
          </div>
        </CardContent>
      </Card>

      <Card className="card-standard">
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-8 w-24" rounded="full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
