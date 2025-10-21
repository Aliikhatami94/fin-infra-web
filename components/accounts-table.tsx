"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react"

const accounts = [
  {
    id: 1,
    name: "Chase Total Checking",
    type: "Checking",
    institution: "Chase",
    balance: 12450.32,
    change: 2.3,
    lastSync: "2 hours ago",
    status: "active",
  },
  {
    id: 2,
    name: "Chase Savings",
    type: "Savings",
    institution: "Chase",
    balance: 45230.0,
    change: 1.2,
    lastSync: "2 hours ago",
    status: "active",
  },
  {
    id: 3,
    name: "Fidelity Brokerage",
    type: "Investment",
    institution: "Fidelity",
    balance: 187650.45,
    change: 5.7,
    lastSync: "1 hour ago",
    status: "active",
  },
  {
    id: 4,
    name: "Sapphire Reserve",
    type: "Credit Card",
    institution: "Chase",
    balance: -2340.12,
    change: -15.2,
    lastSync: "5 hours ago",
    status: "active",
  },
]

export function AccountsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">Account Name</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium text-right">Balance</th>
                <th className="pb-3 font-medium text-right">Change</th>
                <th className="pb-3 font-medium">Last Sync</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{account.name}</p>
                      <p className="text-xs text-muted-foreground">{account.institution}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <Badge variant="outline">{account.type}</Badge>
                  </td>
                  <td className="py-4 text-right">
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                      ${Math.abs(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {account.change > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                      )}
                      <span
                        className={`text-sm font-medium tabular-nums ${
                          account.change > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {account.change > 0 ? "+" : ""}
                        {account.change}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="text-sm text-muted-foreground">{account.lastSync}</p>
                  </td>
                  <td className="py-4">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                      Active
                    </Badge>
                  </td>
                  <td className="py-4">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
