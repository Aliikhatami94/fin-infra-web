import { cn } from "@/lib/utils"

function Placeholder({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted/70", className)} />
}

export default function GoalsLoading() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6" aria-busy>
      <div className="flex items-center justify-between">
        <Placeholder className="h-6 w-48" />
        <Placeholder className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="card-standard space-y-3">
            <Placeholder className="h-4 w-28" />
            <Placeholder className="h-8 w-32" />
            <Placeholder className="h-3 w-20" />
            <Placeholder className="h-3 w-24" />
          </div>
        ))}
      </div>

      <div className="card-standard space-y-4">
        <Placeholder className="h-5 w-40" />
        <Placeholder className="h-16 w-full" />
        <Placeholder className="h-4 w-24" />
      </div>

      <div className="card-standard space-y-4">
        <Placeholder className="h-4 w-32" />
        <Placeholder className="h-32 w-full" />
      </div>

      <div className="card-standard space-y-3">
        <Placeholder className="h-4 w-28" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Placeholder key={index} className="h-32 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
