"use client"

import { DocumentCard } from "@/components/document-card"
import { DocumentSkeleton } from "@/components/document-skeleton"
import { FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useMemo } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import type { Document } from "@/types/domain"

interface DocumentsGridProps {
  documents: Document[]
  isLoading?: boolean
  searchQuery?: string
  selectedTypes?: string[]
  selectedAccounts?: string[]
  selectedYears?: string[]
  sortBy?: "date" | "name" | "size"
  selectedDocuments?: number[]
  onSelectionChange?: (selected: number[]) => void
  error?: string | null
  onRetry?: () => void
  onStartUpload?: () => void
  onClearFilters?: () => void
}

export function DocumentsGrid({
  documents,
  isLoading = false,
  searchQuery = "",
  selectedTypes = [],
  selectedAccounts = [],
  selectedYears = [],
  sortBy = "date",
  selectedDocuments = [],
  onSelectionChange,
  error = null,
  onRetry,
  onStartUpload,
  onClearFilters,
}: DocumentsGridProps) {
  const filteredAndSortedDocuments = useMemo(() => {
    const filtered = documents.filter((doc) => {
      const matchesSearch =
        searchQuery === "" ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.account.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(doc.type)
      const matchesAccount = selectedAccounts.length === 0 || selectedAccounts.includes(doc.account)
      const matchesYear =
        selectedYears.length === 0 || selectedYears.includes(String(doc.year)) || selectedYears.includes(`${doc.year}`)

      return matchesSearch && matchesType && matchesAccount && matchesYear
    })

    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return b.dateValue.getTime() - a.dateValue.getTime()
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "size") {
        return b.sizeValue - a.sizeValue
      }
      return 0
    })

    return filtered
  }, [documents, searchQuery, selectedTypes, selectedAccounts, selectedYears, sortBy])

  const allSelected =
    filteredAndSortedDocuments.length > 0 && selectedDocuments.length === filteredAndSortedDocuments.length
  const someSelected = selectedDocuments.length > 0 && selectedDocuments.length < filteredAndSortedDocuments.length

  const toggleSelectAll = () => {
    if (allSelected) {
      onSelectionChange?.([])
    } else {
      onSelectionChange?.(filteredAndSortedDocuments.map((doc) => doc.id))
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/50 bg-muted/20 p-10 text-center">
        <p className="text-sm font-semibold text-foreground">We couldn’t load your documents</p>
        <p className="text-xs text-muted-foreground">{error}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <DocumentSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (filteredAndSortedDocuments.length === 0) {
    const isFiltered = Boolean(searchQuery || selectedTypes.length || selectedAccounts.length || selectedYears.length)

    return (
      <div className="relative overflow-hidden rounded-3xl border border-dashed border-border/50 bg-card p-12 text-center shadow-[var(--shadow-soft)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(94,114,255,0.15),transparent_55%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.12),transparent_45%)]" aria-hidden />
        <div className="relative z-10 flex flex-col items-center gap-4 text-muted-foreground">
          <FolderOpen className="h-14 w-14 text-primary" aria-hidden="true" />
          <div className="space-y-2 max-w-xl">
            <p className="text-lg font-semibold text-foreground">
              {isFiltered ? "We couldn’t find documents that match those filters" : "Your vault is ready for its first upload"}
            </p>
            <p className="text-sm">
              {isFiltered
                ? "Adjust filters or clear the search to rediscover archived statements."
                : "Securely store statements, receipts, and planning docs—Fin-Infra redacts account numbers and tracks access."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">Encrypted at rest</span>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600">Shareable audit trail</span>
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-600">Auto-reminders before tax time</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            {isFiltered ? (
              <Button variant="outline" onClick={onClearFilters ?? onRetry}>
                Clear filters
              </Button>
            ) : (
              <Button className="rounded-full px-6" onClick={onStartUpload}>
                <Upload className="mr-2 h-4 w-4" aria-hidden /> Stage my first upload
              </Button>
            )}
            <Button asChild variant="link" size="sm" className="text-xs">
              <Link href="/dashboard/taxes" className="inline-flex items-center gap-1">
                Missing a 1099? Go to Taxes
              </Link>
            </Button>
            <p className="text-[0.7rem] text-muted-foreground">
              Need help? Visit the Security Center to review who can access shared vaults.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-2">
        <Checkbox
          checked={allSelected}
          onCheckedChange={toggleSelectAll}
          className={someSelected ? "data-[state=checked]:bg-primary/50" : ""}
        />
        <span className="text-sm text-muted-foreground">
          {allSelected ? "Deselect all" : someSelected ? `${selectedDocuments.length} selected` : "Select all"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {filteredAndSortedDocuments.map((doc, index) => (
          <DocumentCard
            key={doc.id}
            {...doc}
            index={index}
            isSelected={selectedDocuments.includes(doc.id)}
            onSelectionChange={(selected) => {
              if (selected) {
                onSelectionChange?.([...selectedDocuments, doc.id])
              } else {
                onSelectionChange?.(selectedDocuments.filter((id) => id !== doc.id))
              }
            }}
          />
        ))}
      </div>
    </div>
  )
}
