import { MaskableValue } from "@/components/privacy-provider"

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
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col className="w-[38%]" />
              <col className="w-[12%]" />
              <col className="w-[16%]" />
              <col className="w-[14%]" />
              <col className="w-[12%]" />
              <col className="w-[8%]" />
              <col className="w-[0%] sm:w-[4%]" />
            </colgroup>
            <thead>
              <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-3 px-3 text-left">Account</th>
                <th className="py-3 px-3 text-left">Type</th>
                <th className="py-3 px-3 text-right">Balance</th>
                <th className="py-3 px-3 text-right">Change</th>
                <th className="py-3 px-3 text-left">Last Sync</th>
                <th className="py-3 px-3 text-left">Status</th>
                <th className="py-3 px-1 text-right" aria-hidden />
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-3 align-middle">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{account.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{account.institution}</p>
                    </div>
                  </td>
                  <td className="py-3 px-3 align-middle">
                    <Badge variant="outline" className="whitespace-nowrap">{account.type}</Badge>
                  </td>
                  <td className="py-3 px-3 text-right align-middle">
                    <p className="text-sm font-semibold tabular-nums font-mono text-foreground whitespace-nowrap">
                      <MaskableValue
                        value={`$${Math.abs(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                        srLabel={`${account.name} balance`}
                      />
                    </p>
                  </td>
                  <td className="py-3 px-3 text-right align-middle">
                    <div className="inline-flex items-center justify-end gap-1 whitespace-nowrap">
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
                  <td className="py-3 px-3 align-middle">
                    <p className="text-sm text-muted-foreground whitespace-nowrap">{account.lastSync}</p>
                  </td>
                  <td className="py-3 px-3 align-middle">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 whitespace-nowrap">
                      Active
                    </Badge>
                  </td>
                  <td className="py-3 px-1 text-right align-middle">
                    <Button variant="ghost" size="icon" aria-label={`More actions for ${account.name}`}>
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
