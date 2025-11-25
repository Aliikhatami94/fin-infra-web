"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { getRecentActivities } from "@/lib/services"
import { formatCurrency } from "@/lib/format"
import { fetchRecentActivity } from "@/lib/api/client"
import { isMarketingMode } from "@/lib/marketingMode"
import { useAuth } from "@/lib/auth/context"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Home, Zap, CreditCard } from "lucide-react"

type Activity = {
  id: string | number
  description: string
  date: string
  dateGroup: string
  amount: number | null
  type: string
  activityType?: 'banking' | 'investment'
  icon: any
  actions: Array<{ label: string; variant: any }>
}

export function RecentActivity() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [showAll, setShowAll] = useState(false)
  
  const displayLimit = 5 // Show first 5 activities by default
  const displayActivities = showAll ? activities : activities.slice(0, displayLimit)
  const hasMore = activities.length > displayLimit

  // Fetch unified activity feed (banking + investment transactions)
  useEffect(() => {
    async function loadActivities() {
      // Marketing mode: use mock data
      if (isMarketingMode(searchParams)) {
        const mockActivities = getRecentActivities()
        setActivities(mockActivities)
        setIsLoading(false)
        return
      }

      // Not authenticated: show empty state
      if (!user?.id) {
        setActivities([])
        setIsLoading(false)
        return
      }

      try {
        // Fetch unified activity feed (last 30 days, all types)
        const result = await fetchRecentActivity(50) // Get more than needed for grouping
        
        // Transform to activity format
        const transformedActivities: Activity[] = result.activities.map((activity) => {
          const date = new Date(activity.date)
          const today = new Date()
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          
          let dateGroup = 'Earlier'
          if (date.toDateString() === today.toDateString()) {
            dateGroup = 'Today'
          } else if (date.toDateString() === yesterday.toDateString()) {
            dateGroup = 'Yesterday'
          } else if (date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
            dateGroup = 'This Week'
          }

          // Determine icon and description based on activity type
          let icon = CreditCard
          let description = activity.description
          let amount = activity.amount

          if (activity.type === 'investment') {
            // Investment transaction
            const transactionType = activity.transaction_type
            const isDividend = transactionType === 'dividend' || transactionType === 'other'
            const isBuy = transactionType === 'buy'
            const isSell = transactionType === 'sell'
            
            icon = isDividend ? DollarSign : (isBuy ? TrendingDown : TrendingUp)
            
            // Format investment description
            if (activity.security_symbol) {
              if (isBuy) {
                description = `Bought ${activity.quantity?.toFixed(2) || ''} shares of ${activity.security_symbol}`
              } else if (isSell) {
                description = `Sold ${activity.quantity?.toFixed(2) || ''} shares of ${activity.security_symbol}`
              } else if (isDividend) {
                description = `${activity.security_symbol} dividend payment`
              }
            }

            // For dividends, show positive amount
            if (isDividend) {
              amount = Math.abs(amount)
            }
          } else {
            // Banking transaction
            // Determine icon based on category or merchant
            if (activity.category?.includes('Food') || activity.category?.includes('Restaurants')) {
              icon = ShoppingCart
            } else if (activity.category?.includes('Home') || activity.category?.includes('Rent')) {
              icon = Home
            } else if (activity.category?.includes('Utilities')) {
              icon = Zap
            }
          }

          return {
            id: activity.id,
            description,
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            dateGroup,
            amount,
            type: activity.transaction_type || 'transaction',
            activityType: activity.type,
            icon,
            actions: [],
          }
        })

        setActivities(transformedActivities)
      } catch (error) {
        console.error('Failed to fetch activity feed:', error)
        // Show empty state on error
        setActivities([])
      } finally {
        setIsLoading(false)
      }
    }

    loadActivities()
  }, [user])

  const groupedActivities = displayActivities.reduce(
    (acc, activity) => {
      if (!acc[activity.dateGroup]) {
        acc[activity.dateGroup] = []
      }
      acc[activity.dateGroup].push(activity)
      return acc
    },
    {} as Record<string, typeof displayActivities>,
  )

  return (
    <>
      <Card className="card-standard">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-muted-foreground">No recent activity</p>
              <p className="text-xs text-muted-foreground mt-1">Connect your accounts to see banking and investment transactions here</p>
            </div>
          ) : (
          <div className="space-y-6">
            {Object.entries(groupedActivities).map(([dateGroup, groupActivities]) => (
              <div key={dateGroup} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{dateGroup}</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="space-y-4">
                  {groupActivities.map((activity, idx) => (
                    <div
                      key={activity.id}
                      className="relative"
                    >
                      {/* Connecting line from center of this icon to center of next icon */}
                      {idx !== groupActivities.length - 1 && (
                        <div className="absolute left-[1.25rem] top-[2.5rem] bottom-0 w-px bg-border translate-y-4" />
                      )}
                      
                      <div
                        onClick={() => setSelectedActivity(activity)}
                        className="relative flex items-start gap-4 cursor-pointer hover:bg-muted/50 px-2 py-2 rounded-lg transition-colors group sm:-mx-2"
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
                                {formatCurrency(activity.amount, { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: "exceptZero" })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Show more button - navigate to transactions page */}
            {hasMore && !showAll && (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  asChild
                >
                  <a href="/dashboard/transactions">
                    Show {activities.length - displayLimit} more activities →
                  </a>
                </Button>
              </div>
            )}
          </div>
          )}
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
                      {formatCurrency(selectedActivity.amount, { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: "exceptZero" })}
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
