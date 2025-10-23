"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UtensilsCrossed, Car, Tv, ShoppingBag, Coffee, DollarSign, Home, Zap } from "lucide-react"

const transactions = [
  {
    date: "Jan 12",
    month: "Jan",
    merchant: "Whole Foods",
    category: "Food",
    amount: -127.45,
    type: "expense",
    icon: UtensilsCrossed,
    account: "Sapphire Reserve",
  },
  {
    date: "Jan 11",
    month: "Jan",
    merchant: "Shell Gas Station",
    category: "Transportation",
    amount: -52.3,
    type: "expense",
    icon: Car,
    account: "Sapphire Reserve",
  },
  {
    date: "Jan 10",
    month: "Jan",
    merchant: "Salary Deposit",
    category: "Income",
    amount: 7500.0,
    type: "income",
    icon: DollarSign,
    account: "Chase Total Checking",
  },
  {
    date: "Jan 9",
    month: "Jan",
    merchant: "Netflix",
    category: "Entertainment",
    amount: -15.99,
    type: "expense",
    icon: Tv,
    account: "Chase Total Checking",
  },
  {
    date: "Jan 8",
    month: "Jan",
    merchant: "Amazon",
    category: "Shopping",
    amount: -89.99,
    type: "expense",
    icon: ShoppingBag,
    account: "Sapphire Reserve",
  },
  {
    date: "Jan 7",
    month: "Jan",
    merchant: "Starbucks",
    category: "Food",
    amount: -6.75,
    type: "expense",
    icon: Coffee,
    account: "Chase Total Checking",
  },
  {
    date: "Jan 6",
    month: "Jan",
    merchant: "Uber",
    category: "Transportation",
    amount: -24.5,
    type: "expense",
    icon: Car,
    account: "Chase Total Checking",
  },
  {
    date: "Jan 5",
    month: "Jan",
    merchant: "Rent Payment",
    category: "Housing",
    amount: -2200.0,
    type: "expense",
    icon: Home,
    account: "Chase Total Checking",
  },
  {
    date: "Jan 4",
    month: "Jan",
    merchant: "Electric Bill",
    category: "Utilities",
    amount: -120.0,
    type: "expense",
    icon: Zap,
    account: "Chase Total Checking",
  },
]

interface RecentTransactionsProps {
  selectedCategory?: string | null
  selectedMonth?: string | null
}

export function RecentTransactions({ selectedCategory, selectedMonth }: RecentTransactionsProps) {
  const filteredTransactions = transactions.filter((t) => {
    const matchesCategory = !selectedCategory || t.category === selectedCategory
    const matchesMonth = !selectedMonth || t.month === selectedMonth
    return matchesCategory && matchesMonth
  })

  return (
    <Card className="card-standard">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        {(selectedCategory || selectedMonth) && (
          <div className="flex items-center gap-2 mt-1">
            {selectedCategory && (
              <Badge variant="secondary" className="text-xs">
                Category: {selectedCategory}
              </Badge>
            )}
            {selectedMonth && (
              <Badge variant="secondary" className="text-xs">
                Month: {selectedMonth}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-0.5">
          {filteredTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No transactions match the selected filters</p>
          ) : (
            filteredTransactions.map((transaction, index) => {
              const Icon = transaction.icon
              return (
                <div
                  key={index}
                  className="grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center py-2.5 px-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      transaction.type === "income" ? "bg-emerald-500/10" : "bg-orange-500/10"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${transaction.type === "income" ? "text-emerald-500" : "text-orange-500"}`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{transaction.merchant}</p>
                    <span className="text-xs text-muted-foreground">{transaction.date}</span>
                  </div>
                  <Badge variant="outline" className="text-xs px-2 py-0 whitespace-nowrap">
                    {transaction.category}
                  </Badge>
                  <p
                    className={`text-sm font-semibold tabular-nums text-right ${
                      transaction.type === "income" ? "text-emerald-500" : "text-foreground"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
