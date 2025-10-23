import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ChartCardSkeletonProps {
  title: string
  description?: string
  className?: string
  contentHeight?: string
}

export function ChartCardSkeleton({
  title,
  description,
  className,
  contentHeight = "h-64",
}: ChartCardSkeletonProps) {
  return (
    <Card className={cn("border-dashed", className)} aria-busy>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {description ? <p className="text-xs text-muted-foreground/80">{description}</p> : null}
      </CardHeader>
      <CardContent>
        <div className={cn("w-full rounded-lg bg-muted/60 animate-pulse", contentHeight)} />
      </CardContent>
    </Card>
  )
}

export function ChartAreaSkeleton({ className }: { className?: string }) {
  return <div className={cn("w-full rounded-lg bg-muted/60 animate-pulse", className)} aria-busy />
}
