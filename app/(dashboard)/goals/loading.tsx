import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function GoalsLoading() {
  return (
  <div className="mx-auto w-full max-w-[1200px] space-y-6" aria-busy>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-32" rounded="full" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="card-standard">
            <CardContent className="space-y-3 p-5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="card-standard">
        <CardContent className="space-y-4 p-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-4 w-24" />
        </CardContent>
      </Card>

      <Card className="card-standard">
        <CardContent className="space-y-3 p-5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </CardContent>
      </Card>

      <Card className="card-standard">
        <CardContent className="space-y-4 p-5">
          <Skeleton className="h-4 w-28" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
