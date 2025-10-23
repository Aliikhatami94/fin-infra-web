import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />
}

export function AccountsKPICardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="card-standard">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-6 w-6 rounded-full" />
            </div>
            <SkeletonBlock className="h-8 w-32" />
            <SkeletonBlock className="h-16 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function AIInsightsBannerSkeleton() {
  return (
    <Card className="border-border/30 bg-gradient-to-r from-muted/60 to-muted">
      <CardContent className="p-4 space-y-3">
        <SkeletonBlock className="h-5 w-24" />
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-4 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function AccountsTableSkeleton() {
  return (
    <Card className="card-standard">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SkeletonBlock className="h-6 w-40" />
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-9 w-28" />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-12 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}

export function PortfolioSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-3 w-32" />
          </div>
          <div className="space-y-2 text-right">
            <SkeletonBlock className="h-8 w-32" />
            <SkeletonBlock className="h-4 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <SkeletonBlock className="h-10 w-48" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-10 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function RecentActivitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <SkeletonBlock className="h-5 w-40" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-14 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}

export function AIInsightsListSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="card-standard">
          <CardContent className="p-4 space-y-2">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function PortfolioKPIsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="card-standard">
          <CardContent className="p-6 space-y-3">
            <SkeletonBlock className="h-5 w-28" />
            <SkeletonBlock className="h-8 w-32" />
            <SkeletonBlock className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function PortfolioAIInsightsSkeleton() {
  return (
    <Card className="card-standard">
      <CardHeader>
        <SkeletonBlock className="h-5 w-40" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-4 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}

export function RebalancingPreviewSkeleton() {
  return (
    <Card className="card-standard">
      <CardHeader>
        <SkeletonBlock className="h-5 w-48" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-12 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}

export function AllocationGridSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <SkeletonBlock className="h-5 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SkeletonBlock className="h-10 w-full" />
        <SkeletonBlock className="h-72 w-full" />
      </CardContent>
    </Card>
  )
}

export function HoldingsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <SkeletonBlock className="h-5 w-40" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <SkeletonBlock className="h-9 w-56" />
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-12 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}
