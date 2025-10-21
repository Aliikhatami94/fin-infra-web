"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Wallet, DollarSign, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react"

const accountData = [
  {
    name: "Net Worth",
    value: "$287,450.23",
    change: "+2.95%",
    changeValue: "+$8,234",
    isPositive: true,
    icon: Wallet,
  },
  {
    name: "Investment Portfolio",
    value: "$124,583.45",
    change: "+2.68%",
    changeValue: "+$3,251",
    isPositive: true,
    icon: TrendingUp,
  },
  {
    name: "Total Cash",
    value: "$89,450.78",
    change: "+1.2%",
    changeValue: "+$1,058",
    isPositive: true,
    icon: DollarSign,
  },
  {
    name: "Monthly Savings",
    value: "$4,250.00",
    change: "+11.8%",
    changeValue: "+$448",
    isPositive: true,
    icon: PiggyBank,
  },
]

export function MarketOverview() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {accountData.map((account) => {
        const Icon = account.icon
        const ChangeIcon = account.isPositive ? ArrowUpRight : ArrowDownRight
        return (
          <Card key={account.name} className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${
                    account.isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  }`}
                >
                  <ChangeIcon className="h-3 w-3" />
                  {account.change}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{account.name}</p>
                <p className="text-2xl font-bold tracking-tight font-mono">{account.value}</p>
                <p className="text-xs text-muted-foreground">{account.changeValue} this month</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
