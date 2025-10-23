import { cn } from "@/lib/utils"

function Placeholder({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted/70", className)} />
}

export default function TransactionsLoading() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6" aria-busy>
      <div className="flex items-center justify-between">
        <Placeholder className="h-6 w-40" />
        <Placeholder className="h-10 w-32" />
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="card-standard space-y-4">
          <div className="space-y-3">
            <Placeholder className="h-4 w-48" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Placeholder key={index} className="h-9 w-28" />
              ))}
            </div>
            <Placeholder className="h-10 w-full" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Placeholder key={index} className="h-8 w-24" />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Placeholder key={index} className="h-16 w-full" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card-standard space-y-3">
            <Placeholder className="h-4 w-36" />
            <Placeholder className="h-24 w-full" />
            <Placeholder className="h-4 w-28" />
          </div>
          <div className="card-standard space-y-3">
            <Placeholder className="h-4 w-24" />
            {Array.from({ length: 4 }).map((_, index) => (
              <Placeholder key={index} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
