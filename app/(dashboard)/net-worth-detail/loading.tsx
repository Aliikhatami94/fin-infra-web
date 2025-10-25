import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function NetWorthDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6" aria-busy>
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="card-standard card-lift">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-2">
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-12 w-12" rounded="full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="card-standard">
        <CardHeader>
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[360px] w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  )
}
