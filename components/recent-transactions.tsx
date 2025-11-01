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
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Recent Transactions</CardTitle>
          {(selectedCategory || selectedMonth) && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {selectedCategory && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                  {selectedCategory}
                </Badge>
              )}
              {selectedMonth && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                  {selectedMonth}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3 pt-0">
        <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1 -mr-1 scrollbar-thin">
          {filteredTransactions.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">No transactions match the selected filters</p>
          ) : (
            filteredTransactions.map((transaction, index) => {
              const Icon = transaction.icon
              return (
                <div
                  key={index}
                  className="py-2 px-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer overflow-hidden"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        transaction.type === "income" ? "bg-emerald-500/10" : "bg-orange-500/10"
                      }`}
                    >
                      <Icon
                        className={`h-3.5 w-3.5 ${transaction.type === "income" ? "text-emerald-500" : "text-orange-500"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <p className="text-xs font-medium text-foreground truncate flex-1">{transaction.merchant}</p>
                        <p
                          className={`text-xs font-semibold tabular-nums flex-shrink-0 ${
                            transaction.type === "income" ? "text-emerald-500" : "text-foreground"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground">{transaction.date}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                          {transaction.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
