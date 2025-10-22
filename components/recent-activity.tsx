"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, RefreshCw, ShoppingCart } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const activities = [
  {
    id: 1,
    type: "transaction",
    category: "investment",
    description: "Purchased 10 shares of AAPL",
    amount: -1850.0,
    date: "2 hours ago",
    dateGroup: "Today",
    icon: ArrowDownRight,
    color: "blue",
    actions: [
      { label: "View Details", variant: "default" as const },
      { label: "Sell", variant: "outline" as const },
    ],
  },
  {
    id: 2,
    type: "sync",
    category: "sync",
    description: "Chase Checking synced",
    amount: null,
    date: "5 hours ago",
    dateGroup: "Today",
    icon: RefreshCw,
    color: "gray",
    actions: [{ label: "Refresh Now", variant: "outline" as const }],
  },
  {
    id: 3,
    type: "transaction",
    category: "income",
    description: "Dividend received from MSFT",
    amount: 45.32,
    date: "1 day ago",
    dateGroup: "Yesterday",
    icon: ArrowUpRight,
    color: "green",
    actions: [{ label: "Reinvest", variant: "default" as const }],
  },
  {
    id: 4,
    type: "subscription",
    category: "expense",
    description: "Netflix subscription renewed",
    amount: -15.99,
    date: "2 days ago",
    dateGroup: "This Week",
    icon: ShoppingCart,
    color: "red",
    actions: [
      { label: "View Details", variant: "outline" as const },
      { label: "Cancel Subscription", variant: "destructive" as const },
    ],
  },
  {
    id: 5,
    type: "transaction",
    category: "investment",
    description: "Sold 5 shares of TSLA",
    amount: 1275.5,
    date: "3 days ago",
    dateGroup: "This Week",
    icon: ArrowUpRight,
    color: "green",
    actions: [{ label: "View Tax Impact", variant: "outline" as const }],
  },
]

export function RecentActivity() {
  const [selectedActivity, setSelectedActivity] = useState<(typeof activities)[0] | null>(null)

  const groupedActivities = activities.reduce(
    (acc, activity) => {
      if (!acc[activity.dateGroup]) {
        acc[activity.dateGroup] = []
      }
      acc[activity.dateGroup].push(activity)
      return acc
    },
    {} as Record<string, typeof activities>,
  )

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedActivities).map(([dateGroup, groupActivities]) => (
              <div key={dateGroup} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{dateGroup}</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="relative space-y-4">
                  {/* Timeline line */}
                  <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-border" />

                  {groupActivities.map((activity) => (
                    <div
                      key={activity.id}
                      onClick={() => setSelectedActivity(activity)}
                      className="relative flex items-start gap-4 cursor-pointer hover:bg-muted/50 -mx-2 px-2 py-2 rounded-lg transition-colors group"
                    >
                      {/* Timeline dot with icon */}
                      <div
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          activity.type === "sync"
                            ? "bg-gray-100 dark:bg-gray-800"
                            : activity.amount && activity.amount > 0
                              ? "bg-green-100 dark:bg-green-900/30"
                              : "bg-red-100 dark:bg-red-900/30"
                        }`}
                      >
                        <activity.icon
                          className={`h-5 w-5 ${
                            activity.type === "sync"
                              ? "text-gray-500"
                              : activity.amount && activity.amount > 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {activity.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{activity.date}</p>
                            <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {activity.actions.map((action, idx) => (
                                <Button
                                  key={idx}
                                  size="sm"
                                  variant={action.variant}
                                  className="h-7 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    console.log(`[v0] Action clicked: ${action.label}`)
                                  }}
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                          {activity.amount !== null && (
                            <p
                              className={`text-sm font-semibold tabular-nums shrink-0 ${
                                activity.amount > 0
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {activity.amount > 0 ? "+" : ""}$
                              {Math.abs(activity.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedActivity} onOpenChange={(open) => !open && setSelectedActivity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    selectedActivity.type === "sync"
                      ? "bg-blue-500/10"
                      : selectedActivity.amount && selectedActivity.amount > 0
                        ? "bg-green-500/10"
                        : "bg-red-500/10"
                  }`}
                >
                  <selectedActivity.icon
                    className={`h-6 w-6 ${
                      selectedActivity.type === "sync"
                        ? "text-blue-500"
                        : selectedActivity.amount && selectedActivity.amount > 0
                          ? "text-green-500"
                          : "text-red-500"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedActivity.description}</p>
                  <p className="text-sm text-muted-foreground">{selectedActivity.date}</p>
                </div>
              </div>

              {selectedActivity.amount !== null && (
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span
                      className={`text-lg font-semibold ${
                        selectedActivity.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {selectedActivity.amount > 0 ? "+" : ""}$
                      {Math.abs(selectedActivity.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <span className="text-sm font-medium capitalize">{selectedActivity.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="text-sm font-medium text-green-600">Completed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Transaction ID</span>
                    <span className="text-sm font-mono">TXN-{selectedActivity.id.toString().padStart(6, "0")}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
