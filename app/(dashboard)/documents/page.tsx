"use client"

import { DocumentsGrid } from "@/components/documents-grid"
import { DocumentsAIInsights } from "@/components/documents-ai-insights"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Search, Filter, Download, Trash2, ArrowUpDown, X } from "lucide-react"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ErrorBoundary } from "@/components/error-boundary"

export default function DocumentsPage() {
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date")
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])

  const isSortOption = (value: string): value is typeof sortBy => {
    return value === "date" || value === "name" || value === "size"
  }

  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.getElementById("main-content")
      if (mainContent) {
        setScrolled(mainContent.scrollTop > 10)
      }
    }

    const mainContent = document.getElementById("main-content")
    mainContent?.addEventListener("scroll", handleScroll)
    return () => mainContent?.removeEventListener("scroll", handleScroll)
  }, [])

  const fileTypes = ["Statement", "Tax Document", "Report", "Confirmation"]

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const clearFilters = () => {
    setSelectedTypes([])
    setSearchQuery("")
  }

  const handleBulkDownload = () => {
    console.log("[v0] Bulk downloading documents:", selectedDocuments)
    // Implement bulk download logic
    setSelectedDocuments([])
  }

  const handleBulkDelete = () => {
    console.log("[v0] Bulk deleting documents:", selectedDocuments)
    // Implement bulk delete logic
    setSelectedDocuments([])
  }

  return (
    <>
      <div
        className={`sticky top-16 z-20 bg-background/90 backdrop-blur-md border-b border-border/20 transition-shadow duration-300 ${
          scrolled ? "shadow-lg" : "shadow-sm"
        }`}
      >
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-lg md:text-xl font-semibold text-foreground">Documents</h1>
            <div className="flex gap-2 items-center w-full sm:w-auto">
              {selectedDocuments.length > 0 && (
                <>
                  <Badge variant="secondary" className="mr-2">
                    {selectedDocuments.length} selected
                  </Badge>
                  <Button variant="outline" size="sm" onClick={handleBulkDownload} className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="gap-2 bg-transparent text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </>
              )}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="w-full sm:w-64 pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <ArrowUpDown className="h-4 w-4" />
                    <span className="hidden sm:inline">Sort</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={sortBy}
                    onValueChange={(value) => {
                      if (isSortOption(value)) {
                        setSortBy(value)
                      }
                    }}
                  >
                    <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="size">Size</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                    {selectedTypes.length > 0 && (
                      <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs">
                        {selectedTypes.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>File Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {fileTypes.map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={() => toggleType(type)}
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload</span>
              </Button>
            </div>
          </div>
          {(selectedTypes.length > 0 || searchQuery) && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedTypes.map((type) => (
                <Badge key={type} variant="secondary" className="gap-1">
                  {type}
                  <button onClick={() => toggleType(type)} className="ml-1 hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 text-xs">
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] p-4 md:p-8 space-y-6">
        <ErrorBoundary feature="Document insights">
          <DocumentsAIInsights />
        </ErrorBoundary>
        <DocumentsGrid
          searchQuery={searchQuery}
          selectedTypes={selectedTypes}
          sortBy={sortBy}
          selectedDocuments={selectedDocuments}
          onSelectionChange={setSelectedDocuments}
        />
      </div>
    </>
  )
}
