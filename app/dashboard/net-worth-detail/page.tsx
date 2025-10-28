"use client"

import dynamic from "next/dynamic"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Wallet, Home, CreditCard } from "lucide-react"
import { ChartAreaSkeleton } from "@/components/chart-skeleton"
import type { NetWorthPoint } from "@/components/net-worth-history-chart"

const NetWorthHistoryChart = dynamic(
  () => import("@/components/net-worth-history-chart").then((mod) => mod.NetWorthHistoryChart),
  {
    ssr: false,
    loading: () => <ChartAreaSkeleton className="h-96" />,
  },
)

const netWorthHistory: NetWorthPoint[] = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(2024, 0, i + 1).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  netWorth: 400000 + i * 200 + Math.random() * 5000,
  assets: 500000 + i * 250 + Math.random() * 6000,
  liabilities: 100000 - i * 50 + Math.random() * 1000,
}))

const breakdown = [
  { category: "Investment Accounts", value: 324891, icon: Wallet, color: "hsl(210, 100%, 60%)" },
  { category: "Cash & Savings", value: 52180, icon: DollarSign, color: "hsl(142, 76%, 45%)" },
  { category: "Real Estate", value: 250000, icon: Home, color: "hsl(24, 95%, 53%)" },
  { category: "Debt", value: -18500, icon: CreditCard, color: "hsl(0, 84%, 60%)" },
]

export default function NetWorthDetailPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Net Worth Details</h1>
          <p className="text-muted-foreground mt-1">Comprehensive breakdown of your financial position</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {breakdown.map((item) => (
            <Card key={item.category} className="card-standard card-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: item.value < 0 ? "hsl(0, 84%, 60%)" : undefined }}
                    >
                      ${Math.abs(item.value).toLocaleString()}
                    </p>
                  </div>
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <item.icon className="h-6 w-6" style={{ color: item.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="card-standard">
          <CardHeader>
            <CardTitle>Net Worth Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <NetWorthHistoryChart data={netWorthHistory} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
