"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { DocumentsGrid } from "@/components/documents-grid"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />

      <main className="ml-64 mt-16 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-foreground">Documents</h1>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>

          <DocumentsGrid />
        </div>
      </main>
    </div>
  )
}
