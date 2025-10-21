"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { ConnectedAccounts } from "@/components/connected-accounts"
import { AccountsTable } from "@/components/accounts-table"

export default function AccountsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />

  <main id="main-content" className="ml-64 mt-16 p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-foreground">Accounts</h1>
          </div>

          <ConnectedAccounts />
          <AccountsTable />
        </div>
      </main>
    </div>
  )
}
