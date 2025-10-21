"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { CryptoKPIs } from "@/components/crypto-kpis"
import { CryptoChart } from "@/components/crypto-chart"
import { CryptoTable } from "@/components/crypto-table"

export default function CryptoPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />

      <main className="ml-64 mt-16 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <h1 className="text-2xl font-semibold text-foreground">Crypto</h1>

          <CryptoKPIs />
          <CryptoChart />
          <CryptoTable />
        </div>
      </main>
    </div>
  )
}
