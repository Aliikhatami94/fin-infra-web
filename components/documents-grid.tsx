"use client"

import { DocumentCard } from "@/components/document-card"
import { DocumentSkeleton } from "@/components/document-skeleton"
import { FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useMemo } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { getDocuments } from "@/lib/services/documents"

interface DocumentsGridProps {
  isLoading?: boolean
  searchQuery?: string
  selectedTypes?: string[]
  sortBy?: "date" | "name" | "size"
  selectedDocuments?: number[]
  onSelectionChange?: (selected: number[]) => void
}

export function DocumentsGrid({
  isLoading = false,
  searchQuery = "",
  selectedTypes = [],
  sortBy = "date",
  selectedDocuments = [],
  onSelectionChange,
}: DocumentsGridProps) {
  const documentsData = useMemo(() => getDocuments(), [])

  const filteredAndSortedDocuments = useMemo(() => {
    const filtered = documentsData.filter((doc) => {
      const matchesSearch =
        searchQuery === "" ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.institution.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(doc.type)

      return matchesSearch && matchesType
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
  }, [documentsData, searchQuery, selectedTypes, sortBy])

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
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
        <FolderOpen className="h-12 w-12 mb-4 opacity-60" />
        <p className="text-sm mb-2">
          {searchQuery || selectedTypes.length > 0 ? "No documents found" : "No documents yet"}
        </p>
        <p className="text-xs mb-4">
          {searchQuery || selectedTypes.length > 0
            ? "Try adjusting your search or filters"
            : "Upload your first document to get started"}
        </p>
        {!searchQuery && selectedTypes.length === 0 && (
          <Button>
            <Upload className="mr-2 h-4 w-4" /> Upload Document
          </Button>
        )}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
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
