"use client"

import { DocumentsGrid } from "@/components/documents-grid"
import { DocumentsAIInsights } from "@/components/documents-ai-insights"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Saved filter sets for quick access
const SAVED_FILTER_SETS = [
  {
    id: "tax-docs",
    name: "Tax Docs",
    icon: FileSpreadsheet,
    description: "Tax forms and related documents",
    types: ["Tax Form", "1099", "W-2"],
    accounts: [],
    years: [],
  },
  {
    id: "statements",
    name: "Statements",
    icon: FileText,
    description: "Account statements and summaries",
    types: ["Statement", "Account Summary"],
    accounts: [],
    years: [],
  },
  {
    id: "reports",
    name: "Reports",
    icon: FileBarChart,
    description: "Financial reports and analytics",
    types: ["Report", "Performance Report"],
    accounts: [],
    years: [],
  },
  {
    id: "receipts",
    name: "Receipts",
    icon: ReceiptText,
    description: "Transaction receipts and confirmations",
    types: ["Receipt", "Confirmation"],
    accounts: [],
    years: [],
  },
  {
    id: "current-year",
    name: "This Year",
    icon: FileCheck2,
    description: "Documents from current year",
    types: [],
    accounts: [],
    years: [new Date().getFullYear().toString()],
  },
] as const

export default function DocumentsPage() {
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date")
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const [celebration, setCelebration] = useState<{ count: number; firstName: string } | null>(null)
  const [celebrationOpen, setCelebrationOpen] = useState(false)
  const [activeFilterSet, setActiveFilterSet] = useState<string | null>(null)
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

  const isSortOption = (value: string): value is typeof sortBy => {
    return value === "date" || value === "name" || value === "size"
  }

  const isLoading = status === "loading" || isUpdating

  const loadDocuments = useCallback(() => {
    if (fetchTimer.current) clearTimeout(fetchTimer.current)
    setStatus("loading")
    setError(null)
    fetchTimer.current = setTimeout(async () => {
      try {
        const data = await getDocuments()
        setDocuments(data)
        setStatus("success")
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
      if (fetchTimer.current) clearTimeout(fetchTimer.current)
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
    setActiveFilterSet(null)
  }, [clearAll])

  const applySavedFilterSet = useCallback((filterId: string) => {
    const filterSet = SAVED_FILTER_SETS.find(f => f.id === filterId)
    if (!filterSet) return

    // Clear existing filters first
    clearAll()

    // Apply the saved filter set
    filterSet.types.forEach(type => {
      if (fileTypes.includes(type) && !selectedTypes.includes(type)) {
        toggleType(type)
      }
    })
    filterSet.accounts.forEach(account => {
      if (accounts.includes(account) && !selectedAccounts.includes(account)) {
        toggleAccount(account)
      }
    })
    filterSet.years.forEach(year => {
      if (years.includes(year) && !selectedYears.includes(year)) {
        toggleYear(year)
      }
    })

    setActiveFilterSet(filterId)
    toast.success(`Applied "${filterSet.name}" filter`)
  }, [fileTypes, accounts, years, selectedTypes, selectedAccounts, selectedYears, toggleType, toggleAccount, toggleYear, clearAll])

  // Check if current filters match a saved filter set
  const checkActiveFilterSet = useCallback(() => {
    for (const filterSet of SAVED_FILTER_SETS) {
      const typesMatch = filterSet.types.length === selectedTypes.length && 
        filterSet.types.every(t => selectedTypes.includes(t as string))
      const accountsMatch = filterSet.accounts.length === selectedAccounts.length && 
        filterSet.accounts.every(a => selectedAccounts.includes(a as string))
      const yearsMatch = filterSet.years.length === selectedYears.length && 
        filterSet.years.every(y => selectedYears.includes(y as string))
      
      if (typesMatch && accountsMatch && yearsMatch) {
        setActiveFilterSet(filterSet.id)
        return
      }
    }
    setActiveFilterSet(null)
  }, [selectedTypes, selectedAccounts, selectedYears])

  useEffect(() => {
    checkActiveFilterSet()
  }, [checkActiveFilterSet])

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
    if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`
    if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`
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
      const first = uploadedDocs[0]?.name ?? "document"
      setCelebration({ count: uploadedDocs.length, firstName: first })
      setCelebrationOpen(true)
      toast.success(
        uploadedDocs.length === 1
          ? `Uploaded ${first}`
          : `Uploaded ${uploadedDocs.length} documents`,
      )
    },
    [formatFileSize, selectedAccounts],
  )

  const handleUploadButtonClick = useCallback(() => {
    const el = document.getElementById("document-upload")
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  const handleBulkDownload = useCallback(() => {
    if (!selectedDocuments.length) return
    toast.info(`Preparing ${selectedDocuments.length} documents for download...`)
  }, [selectedDocuments])

  const handleBulkDelete = useCallback(() => {
    if (!selectedDocuments.length) return
    setDocuments((prev) => prev.filter((d) => !selectedDocuments.includes(d.id)))
    setSelectedDocuments([])
    toast.success("Selected documents deleted")
  }, [selectedDocuments])

  return (
    <>
      {/* Sticky, compact header */}
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-foreground">Documents</h1>
              <p className="text-xs text-muted-foreground" aria-live="polite">{describeActiveFilters}</p>
            </div>
            <div className="flex gap-2 items-center w-full sm:w-auto">
              {selectedDocuments.length > 0 && (
                <>
                  <Badge variant="secondary" className="mr-2">
                    {selectedDocuments.length} selected
                  </Badge>
                  <Button variant="outline" size="sm" onClick={handleBulkDownload} className="gap-2">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="gap-2 text-destructive hover:text-destructive"
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
                  className="w-full sm:w-64 pl-9 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
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
                      if (isSortOption(value)) setSortBy(value)
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
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                    {(selectedTypes.length > 0 || activeFilterSet) && (
                      <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs">
                        {activeFilterSet ? '✓' : selectedTypes.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  {/* Quick Filters Section */}
                  <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Quick Filters
                  </DropdownMenuLabel>
                  <div className="px-2 py-2 space-y-1">
                    {SAVED_FILTER_SETS.map((filterSet) => {
                      const isActive = activeFilterSet === filterSet.id
                      const FilterIcon = filterSet.icon
                      return (
                        <button
                          key={filterSet.id}
                          onClick={() => applySavedFilterSet(filterSet.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                            isActive 
                              ? "bg-primary text-primary-foreground" 
                              : "hover:bg-muted"
                          )}
                        >
                          <FilterIcon className="h-4 w-4 shrink-0" />
                          <div className="flex-1 text-left min-w-0">
                            <div className="font-medium">{filterSet.name}</div>
                            <div className={cn(
                              "text-xs truncate",
                              isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                            )}>
                              {filterSet.description}
                            </div>
                          </div>
                          {isActive && <Badge variant="secondary" className="shrink-0 bg-primary-foreground/20 text-primary-foreground">Active</Badge>}
                        </button>
                      )
                    })}
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  {/* Manual Filter Options */}
                  <DropdownMenuLabel>File Type</DropdownMenuLabel>
                  {fileTypes.map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={() => toggleType(type)}
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                  
                  {(selectedTypes.length > 0 || selectedAccounts.length > 0 || selectedYears.length > 0 || activeFilterSet) && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearFilters}
                          className="w-full justify-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4" />
                          Clear All Filters
                        </Button>
                      </div>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-block">
                      <Button size="sm" className="gap-2" disabled onClick={handleUploadButtonClick}>
                        <Upload className="h-4 w-4" />
                        <span className="hidden sm:inline">Upload</span>
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs px-1.5 py-1">
                    <p className="text-xs">Document uploads will be available once secure file storage is configured for your environment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-6 space-y-6">
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
      </motion.div>

      <SuccessCelebrationDialog
        open={celebrationOpen && Boolean(celebration)}
        onOpenChange={setCelebrationOpen}
        title="Vault updated"
        description={
          celebration?.count === 1
            ? "Your latest document is encrypted and ready to tag."
            : `${celebration?.count ?? 0} new documents are secured and waiting in your vault.`
        }
        detail={celebration ? `Latest upload: ${celebration.firstName}` : undefined}
        actionLabel="Review uploads"
        onAction={handleUploadButtonClick}
      />
    </>
  )
}
