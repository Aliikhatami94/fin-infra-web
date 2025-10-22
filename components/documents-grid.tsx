"use client"

import { DocumentCard } from "@/components/document-card"
import { DocumentSkeleton } from "@/components/document-skeleton"
import { FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useMemo } from "react"

const documents = [
  {
    name: "Chase Statement - December 2024",
    institution: "Chase",
    type: "Statement",
    date: "Dec 31, 2024",
    size: "1.2 MB",
  },
  {
    name: "Fidelity Tax Form 1099",
    institution: "Fidelity",
    type: "Tax Document",
    date: "Jan 15, 2025",
    size: "245 KB",
  },
  {
    name: "Annual Investment Report 2024",
    institution: "Fidelity",
    type: "Report",
    date: "Dec 31, 2024",
    size: "3.8 MB",
  },
  {
    name: "Chase Statement - November 2024",
    institution: "Chase",
    type: "Statement",
    date: "Nov 30, 2024",
    size: "1.1 MB",
  },
  {
    name: "Robinhood Trade Confirmation",
    institution: "Robinhood",
    type: "Confirmation",
    date: "Dec 15, 2024",
    size: "156 KB",
  },
  {
    name: "BofA Credit Card Statement",
    institution: "Bank of America",
    type: "Statement",
    date: "Dec 31, 2024",
    size: "890 KB",
  },
]

interface DocumentsGridProps {
  isLoading?: boolean
  searchQuery?: string
  selectedTypes?: string[]
}

export function DocumentsGrid({ isLoading = false, searchQuery = "", selectedTypes = [] }: DocumentsGridProps) {
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        searchQuery === "" ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.institution.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(doc.type)

      return matchesSearch && matchesType
    })
  }, [searchQuery, selectedTypes])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <DocumentSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (filteredDocuments.length === 0) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
      {filteredDocuments.map((doc, index) => (
        <DocumentCard key={index} {...doc} index={index} />
      ))}
    </div>
  )
}
