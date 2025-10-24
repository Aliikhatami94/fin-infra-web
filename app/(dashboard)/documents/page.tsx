"use client"

import { DocumentsGrid } from "@/components/documents-grid"
import { DocumentsAIInsights } from "@/components/documents-ai-insights"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Upload,
  Search,
  Filter,
  Download,
  Trash2,
  ArrowUpDown,
  X,
  FileText,
  FileSpreadsheet,
  FileBarChart,
  FileCheck2,
  ReceiptText,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState, useId } from "react"
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
import { useDocumentFilters } from "@/lib/hooks"
import { getDocuments } from "@/lib/services/documents"
import type { Document } from "@/types/domain"
import { DocumentUploadZone } from "@/components/document-upload-zone"
import { toast } from "@/components/ui/sonner"
import { SuccessCelebrationDialog } from "@/components/success-celebration-dialog"
import { AccountabilityChecklist } from "@/components/accountability-checklist"
import Link from "next/link"
import { cn } from "@/lib/utils"

const resolveDocumentTypeIcon = (type: string) => {
  const normalized = type.toLowerCase()
  if (normalized.includes("tax") || normalized.includes("1099") || normalized.includes("form")) return FileSpreadsheet
  if (normalized.includes("statement")) return FileText
  if (normalized.includes("report")) return FileBarChart
  if (normalized.includes("confirmation")) return FileCheck2
  if (normalized.includes("receipt")) return ReceiptText
  return FileText
}

export default function DocumentsPage() {
  const [scrolled, setScrolled] = useState(false)
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date")
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const [celebration, setCelebration] = useState<{ count: number; firstName: string } | null>(null)
  const [celebrationOpen, setCelebrationOpen] = useState(false)
  const fetchTimer = useRef<NodeJS.Timeout | null>(null)
  const {
    isUpdating,
    searchQuery,
    setSearchQuery,
    selectedTypes,
    toggleType,
    selectedAccounts,
    toggleAccount,
    selectedYears,
    toggleYear,
    clearAll,
  } = useDocumentFilters()
  const chipListLabelId = useId()

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

  const isLoading = status === "loading" || isUpdating

  const loadDocuments = useCallback(() => {
    if (fetchTimer.current) {
      clearTimeout(fetchTimer.current)
    }

    setStatus("loading")
    setError(null)

    fetchTimer.current = setTimeout(() => {
      try {
        const payload = getDocuments()
        setDocuments(payload)
        setStatus("success")
        setError(null)
      } catch (err) {
        setError("Please refresh to try fetching your documents again.")
        setStatus("error")
      } finally {
        fetchTimer.current = null
      }
    }, 450)
  }, [])

  useEffect(() => {
    loadDocuments()
    return () => {
      if (fetchTimer.current) {
        clearTimeout(fetchTimer.current)
      }
    }
  }, [loadDocuments])

  const fileTypes = useMemo(
    () => Array.from(new Set(documents.map((doc) => doc.type))).sort(),
    [documents],
  )

  const accounts = useMemo(
    () => Array.from(new Set(documents.map((doc) => doc.account))).sort(),
    [documents],
  )

  const years = useMemo(
    () =>
      Array.from(new Set(documents.map((doc) => doc.year)))
        .sort((a, b) => b - a)
        .map((year) => String(year)),
    [documents],
  )

  const clearFilters = useCallback(() => {
    clearAll()
  }, [clearAll])

  const describeActiveFilters = useMemo(() => {
    const segments: string[] = []
    if (searchQuery) segments.push(`matching “${searchQuery}”`)
    if (selectedTypes.length) segments.push(`${selectedTypes.length} types`)
    if (selectedAccounts.length) segments.push(`${selectedAccounts.length} accounts`)
    if (selectedYears.length) segments.push(`${selectedYears.length} years`)
    if (segments.length === 0) return "All documents"
    return `Filtered documents ${segments.join(", ")}`
  }, [searchQuery, selectedAccounts, selectedTypes, selectedYears])

  const formatFileSize = useCallback((size: number) => {
    if (size >= 1024 * 1024) {
      return `${(size / 1024 / 1024).toFixed(1)} MB`
    }
    if (size >= 1024) {
      return `${(size / 1024).toFixed(1)} KB`
    }
    return `${size} B`
  }, [])

  const handleUploadComplete = useCallback(
    (files: File[]) => {
      if (!files.length) return

      const now = new Date()
      const uploadedDocs = files.map((file) => {
        const extension = file.name.split(".").pop()?.toLowerCase() ?? "pdf"
        const typeLabel =
          extension === "csv"
            ? "Report"
            : extension === "jpg" || extension === "png"
              ? "Receipt"
              : extension === "pdf"
                ? "Statement"
                : "Document"

        return {
          id: Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
          name: file.name,
          institution: "Manual Upload",
          type: typeLabel,
          account: selectedAccounts[0] ?? "Uncategorized",
          date: now.toLocaleDateString(),
          dateValue: now,
          size: formatFileSize(file.size),
          sizeValue: Number((file.size / 1024 / 1024).toFixed(2)),
          year: now.getFullYear(),
        } satisfies Document
      })

      setDocuments((prev) => [...uploadedDocs, ...prev])
      setCelebration({ count: files.length, firstName: files[0]?.name ?? "document" })
      setCelebrationOpen(true)
      if (files.length > 1) {
        toast.success(`${files.length} documents staged for review`, {
          description: "New files appear at the top of your library.",
        })
      }
    },
    [formatFileSize, selectedAccounts],
  )

  const handleUploadButtonClick = useCallback(() => {
    const zone = document.getElementById("document-upload")
    zone?.scrollIntoView({ behavior: "smooth", block: "start" })
    zone?.focus?.()
  }, [])

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
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-foreground">Documents</h1>
              <p className="text-xs text-muted-foreground" aria-live="polite">
                {describeActiveFilters}
              </p>
            </div>
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
              <Button size="sm" className="gap-2" onClick={handleUploadButtonClick}>
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload</span>
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-3">
            <div className="flex flex-wrap items-center gap-2">
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
              {selectedAccounts.map((account) => (
                <Badge key={account} variant="secondary" className="gap-1">
                  {account}
                  <button onClick={() => toggleAccount(account)} className="ml-1 hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedYears.map((year) => (
                <Badge key={year} variant="secondary" className="gap-1">
                  {year}
                  <button onClick={() => toggleYear(year)} className="ml-1 hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {(searchQuery || selectedTypes.length || selectedAccounts.length || selectedYears.length) && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 text-xs">
                  Clear all
                </Button>
              )}
            </div>

            <div className="relative -mx-2">
              <span id={chipListLabelId} className="sr-only">
                Filter documents by type, account, or year
              </span>
              <div
                className="flex items-center gap-2 overflow-x-auto px-2 pb-2 text-xs sm:text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{ msOverflowStyle: "none" }}
                role="listbox"
                aria-labelledby={chipListLabelId}
                aria-multiselectable="true"
              >
                {fileTypes.map((type) => {
                  const selected = selectedTypes.includes(type)
                  const TypeIcon = resolveDocumentTypeIcon(type)
                  return (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      type="button"
                      role="option"
                      aria-selected={selected}
                      data-selected={selected}
                      className={cn(
                        "h-8 rounded-full border border-border/60 bg-background px-3 font-medium transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                        selected
                          ? "border-primary bg-primary/10 text-primary shadow-[var(--shadow-soft)]"
                          : "text-muted-foreground hover:border-primary/50 hover:text-foreground",
                      )}
                      onClick={() => toggleType(type)}
                    >
                      <TypeIcon
                        className={cn(
                          "mr-2 h-3.5 w-3.5",
                          selected ? "text-primary" : "text-muted-foreground",
                        )}
                        aria-hidden
                      />
                      {type}
                    </Button>
                  )
                })}
                {accounts.map((account) => {
                  const selected = selectedAccounts.includes(account)
                  return (
                    <Button
                      key={account}
                      variant="outline"
                      size="sm"
                      type="button"
                      role="option"
                      aria-selected={selected}
                      data-selected={selected}
                      className={cn(
                        "h-8 rounded-full border border-border/60 bg-background px-3 font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                        selected
                          ? "border-primary bg-primary/10 text-primary shadow-[var(--shadow-soft)]"
                          : "text-muted-foreground hover:border-primary/50 hover:text-foreground",
                      )}
                      onClick={() => toggleAccount(account)}
                    >
                      {account}
                    </Button>
                  )
                })}
                {years.map((year) => {
                  const selected = selectedYears.includes(year)
                  return (
                    <Button
                      key={year}
                      variant="outline"
                      size="sm"
                      type="button"
                      role="option"
                      aria-selected={selected}
                      data-selected={selected}
                      className={cn(
                        "h-8 rounded-full border border-border/60 bg-background px-3 font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                        selected
                          ? "border-primary bg-primary/10 text-primary shadow-[var(--shadow-soft)]"
                          : "text-muted-foreground hover:border-primary/50 hover:text-foreground",
                      )}
                      onClick={() => toggleYear(year)}
                    >
                      {year}
                    </Button>
                  )
                })}
              </div>
              <span className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background via-background to-transparent" aria-hidden />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>Filters follow your workspace—shared collaborators see the same context.</span>
              <Button asChild variant="link" size="sm" className="h-auto px-0 text-xs font-semibold">
                <Link href="/taxes" className="flex items-center gap-1">
                  Review missing tax docs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] p-4 md:p-8 space-y-6">
        <AccountabilityChecklist surface="documents" />
        <DocumentUploadZone id="document-upload" onUploadComplete={handleUploadComplete} />
        <ErrorBoundary feature="Document insights">
          <DocumentsAIInsights />
        </ErrorBoundary>
        <DocumentsGrid
          documents={documents}
          searchQuery={searchQuery}
          selectedTypes={selectedTypes}
          selectedAccounts={selectedAccounts}
          selectedYears={selectedYears}
          sortBy={sortBy}
          selectedDocuments={selectedDocuments}
          onSelectionChange={setSelectedDocuments}
          isLoading={isLoading}
          error={error}
          onRetry={loadDocuments}
          onClearFilters={clearFilters}
          onStartUpload={handleUploadButtonClick}
        />
      </div>
      <SuccessCelebrationDialog
        open={celebrationOpen && Boolean(celebration)}
        onOpenChange={setCelebrationOpen}
        title="Vault updated"
        description={celebration?.count === 1 ? "Your latest document is encrypted and ready to tag." : `${celebration?.count ?? 0} new documents are secured and waiting in your vault.`}
        detail={celebration ? `Latest upload: ${celebration.firstName}` : undefined}
        actionLabel="Review uploads"
        onAction={handleUploadButtonClick}
      />
    </>
  )
}
