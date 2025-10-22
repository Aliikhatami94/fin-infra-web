export function DocumentSkeleton() {
  return (
    <div className="p-6 border border-border/30 rounded-xl bg-card shadow-sm animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="h-10 w-10 rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-5 bg-muted rounded w-24" />
        <div className="flex items-center gap-3">
          <div className="h-3 bg-muted rounded w-16" />
          <div className="h-4 w-4 bg-muted rounded" />
          <div className="h-4 w-4 bg-muted rounded" />
          <div className="h-3 bg-muted rounded w-12" />
        </div>
      </div>
    </div>
  )
}
