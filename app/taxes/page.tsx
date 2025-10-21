"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { TaxSummary } from "@/components/tax-summary"
import { CapitalGainsTable } from "@/components/capital-gains-table"
import { TaxDocuments } from "@/components/tax-documents"

export default function TaxesPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />

      <main className="ml-64 mt-16 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <h1 className="text-2xl font-semibold text-foreground">Taxes</h1>

          <TaxSummary />
          <CapitalGainsTable />
          <TaxDocuments />
        </div>
      </main>
    </div>
  )
}
