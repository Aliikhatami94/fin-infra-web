"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchInsightsSummary } from "@/lib/api/client"
import { useAuth } from "@/lib/auth/context"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, AlertTriangle, Info, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface InsightsSummary {
  by_priority: Record<string, number>
  by_category: Record<string, number>
  highlights: Array<{
    category: string
    count: number
    priority: string
  }>
  total_unread: number
}

export function QuickInsights() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<InsightsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return

    const loadSummary = async () => {
      try {
        setLoading(true)
        const data = await fetchInsightsSummary(user.id)
        setSummary(data)
        setError(null)
      } catch (err) {
        console.error("Failed to load insights summary:", err)
        setError("Unable to load insights")
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [user?.id])

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500" />
      case "medium":
        return <TrendingUp className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
      case "low":
        return <Info className="h-4 w-4 text-blue-600 dark:text-blue-500" />
      default:
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <Card className="flex-1">
        <CardContent className="pt-6 space-y-2">
          <Skeleton className="h-[72px] w-full rounded-lg" />
          <Skeleton className="h-[72px] w-full rounded-lg" />
          <Skeleton className="h-[72px] w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (error || !summary) {
    return (
      <Card className="flex-1">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Info className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {error || "No insights available"}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const highPriority = summary.by_priority.high || 0
  const mediumPriority = summary.by_priority.medium || 0
  const totalInsights = Object.values(summary.by_priority).reduce((a, b) => a + b, 0)

  return (
    <Card className="flex-1">
      <CardContent className="pt-6 space-y-2">
        {totalInsights === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">All Caught Up!</p>
            <p className="text-xs text-muted-foreground max-w-[200px]">
              No new insights at the moment. We'll notify you when there's something to review.
            </p>
          </div>
        ) : (
          <>
            {/* Priority breakdown */}
            {highPriority > 0 && (
              <Link 
                href="/dashboard/insights?priority=high"
                className="group flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    High Priority
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {highPriority} {highPriority === 1 ? "item" : "items"} need attention
                  </p>
                </div>
                <Badge variant="destructive" className="h-6 min-w-[24px] justify-center">
                  {highPriority}
                </Badge>
              </Link>
            )}

            {mediumPriority > 0 && (
              <Link 
                href="/dashboard/insights?priority=medium"
                className="group flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-2">
                  <TrendingUp className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                    Medium Priority
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {mediumPriority} {mediumPriority === 1 ? "item" : "items"} to review
                  </p>
                </div>
                <Badge variant="default" className="h-6 min-w-[24px] justify-center">
                  {mediumPriority}
                </Badge>
              </Link>
            )}

            {/* Category highlights */}
            {summary.highlights.slice(0, 1).map((highlight, idx) => (
              <Link
                key={idx}
                href={`/dashboard/insights?category=${highlight.category}`}
                className="group flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className={`rounded-full p-2 ${
                  highlight.priority.toLowerCase() === 'high' 
                    ? 'bg-red-100 dark:bg-red-900/20'
                    : highlight.priority.toLowerCase() === 'medium'
                    ? 'bg-yellow-100 dark:bg-yellow-900/20'
                    : 'bg-blue-100 dark:bg-blue-900/20'
                }`}>
                  {getPriorityIcon(highlight.priority)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground capitalize">
                    {highlight.category.replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {highlight.count} {highlight.count === 1 ? "insight" : "insights"}
                  </p>
                </div>
                <Badge variant="outline" className="h-6 px-2 text-xs capitalize">
                  {highlight.priority}
                </Badge>
              </Link>
            ))}

            {/* View all link */}
            <Link
              href="/dashboard/insights"
              className="block text-center text-xs font-medium text-primary hover:text-primary/80 hover:underline pt-1 transition-colors"
            >
              View all insights →
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  )
}
