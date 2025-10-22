"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, TrendingUp, TrendingDown } from "lucide-react"
import { MaskableValue } from "@/components/privacy-provider"

// Mock transaction data
const transactions = [
  { id: 1, date: "2024-01-15", description: "Amazon Purchase", amount: -89.99, category: "Shopping" },
  { id: 2, date: "2024-01-14", description: "Salary Deposit", amount: 5000.0, category: "Income" },
  { id: 3, date: "2024-01-13", description: "Starbucks", amount: -6.5, category: "Food & Dining" },
  { id: 4, date: "2024-01-12", description: "Gas Station", amount: -45.0, category: "Transportation" },
  { id: 5, date: "2024-01-11", description: "Netflix Subscription", amount: -15.99, category: "Entertainment" },
  { id: 6, date: "2024-01-10", description: "Grocery Store", amount: -125.43, category: "Food & Dining" },
  { id: 7, date: "2024-01-09", description: "Electric Bill", amount: -87.32, category: "Utilities" },
  { id: 8, date: "2024-01-08", description: "Restaurant", amount: -67.89, category: "Food & Dining" },
]

export default function AccountDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Mock account data - in real app, fetch based on params.id
  const account = {
    name: "Chase Total Checking",
    institution: "Chase",
    type: "Checking",
    balance: 12450.32,
    change: 2.3,
    accountNumber: "****1234",
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar onMenuClick={() => setMobileMenuOpen(true)} />
      <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      <main id="main-content" className="lg:ml-64 mt-16 p-4 md:p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-foreground">{account.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {account.institution} • {account.type} • {account.accountNumber}
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
                <p className="text-3xl font-semibold tabular-nums font-mono">
                  <MaskableValue
                    value={`$${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                    srLabel="Current balance"
                  />
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">30-Day Change</p>
                <div className="flex items-center gap-2">
                  {account.change > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                  <p
                    className={`text-3xl font-semibold tabular-nums ${
                      account.change > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {account.change > 0 ? "+" : ""}
                    {account.change}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Account Type</p>
                <Badge variant="outline" className="text-base px-3 py-1">
                  {account.type}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category}
                        </Badge>
                      </div>
                    </div>
                    <p
                      className={`text-sm font-semibold tabular-nums font-mono ${
                        transaction.amount > 0 ? "text-green-600 dark:text-green-400" : "text-foreground"
                      }`}
                    >
                      <MaskableValue
                        value={`${transaction.amount > 0 ? "+" : ""}$${Math.abs(transaction.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                        srLabel={`${transaction.description} amount`}
                      />
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
