import { DocumentSkeleton } from "@/components/document-skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, Search } from "lucide-react"

export default function Loading() {
  return (
    <>
      {/* Sticky compact Header */}
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-3">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-lg font-semibold text-foreground md:text-xl">Documents</h1>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search documents..." className="w-64 pl-9" disabled />
              </div>
              <Button size="sm" className="gap-2" disabled>
                <Upload className="h-4 w-4" /> Upload
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10 py-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <DocumentSkeleton key={i} />
          ))}
        </div>
      </div>
    </>
  )
}
