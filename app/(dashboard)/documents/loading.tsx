import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { DocumentSkeleton } from "@/components/document-skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, Search } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />

      <main id="main-content" className="ml-64 mt-16">
        <div className="sticky top-16 z-20 bg-background/90 backdrop-blur-md border-b border-border/20 shadow-sm">
          <div className="mx-auto max-w-[1600px] px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-lg md:text-xl font-semibold text-foreground">Documents</h1>
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search documents..." className="w-64 pl-9" disabled />
                </div>
                <Button size="sm" className="gap-2" disabled>
                  <Upload className="h-4 w-4" /> Upload
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1600px] p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <DocumentSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
