"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "transaction",
    description: "Purchased 10 shares of AAPL",
    amount: -1850.0,
    date: "2 hours ago",
    icon: ArrowDownRight,
  },
  {
    id: 2,
    type: "sync",
    description: "Chase Checking synced",
    amount: null,
    date: "5 hours ago",
    icon: RefreshCw,
  },
  {
    id: 3,
    type: "transaction",
    description: "Dividend received from MSFT",
    amount: 45.32,
    date: "1 day ago",
    icon: ArrowUpRight,
  },
  {
    id: 4,
    type: "transaction",
    description: "Sold 5 shares of TSLA",
    amount: 1275.5,
    date: "2 days ago",
    icon: ArrowUpRight,
  },
  {
    id: 5,
    type: "sync",
    description: "Bank of America Credit Card synced",
    amount: null,
    date: "3 days ago",
    icon: RefreshCw,
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    activity.type === "sync"
                      ? "bg-blue-500/10"
                      : activity.amount && activity.amount > 0
                        ? "bg-green-500/10"
                        : "bg-red-500/10"
                  }`}
                >
                  <activity.icon
                    className={`h-5 w-5 ${
                      activity.type === "sync"
                        ? "text-blue-500"
                        : activity.amount && activity.amount > 0
                          ? "text-green-500"
                          : "text-red-500"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              </div>
              {activity.amount !== null && (
                <p
                  className={`text-sm font-semibold tabular-nums ${
                    activity.amount > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {activity.amount > 0 ? "+" : ""}$
                  {Math.abs(activity.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
