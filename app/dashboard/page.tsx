"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { useAuth } from "@/lib/auth/context"
// Heavy widgets are dynamically loaded client-side with skeletons
import { OverviewKPIs } from "@/components/overview-kpis"
import { ChartCardSkeleton } from "@/components/chart-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  AIInsightsListSkeleton,
  RecentActivitySkeleton,
} from "@/components/dashboard-skeletons"
import { AccountabilityChecklist } from "@/components/accountability-checklist"
import { DashboardShell } from "@/components/dashboard/shell"

const NetWorthTimeline = dynamic(
  () => import("@/components/net-worth-timeline").then((mod) => mod.NetWorthTimeline),
  {
    ssr: false,
    loading: () => null, // Don't show skeleton - component handles its own visibility
  },
)

const CashFlow = dynamic(
  () => import("@/components/cash-flow").then((mod) => mod.CashFlow),
  {
    ssr: false,
    loading: () => (
      <ChartCardSkeleton
        title="Cash Flow"
        description="Income vs expenses with net cash flow trend"
        contentHeight="h-72"
      />
    ),
  },
)

const RecentActivity = dynamic(
  () => import("@/components/recent-activity").then((mod) => mod.RecentActivity),
  {
    ssr: false,
    loading: () => <RecentActivitySkeleton />,
  },
)

const AIInsights = dynamic(
  () => import("@/components/ai-insights").then((mod) => mod.AIInsights),
  {
    ssr: false,
    loading: () => <AIInsightsListSkeleton />,
  },
)

// AI chat is now global in the dashboard layout

export default function OverviewPage() {
  const { user } = useAuth()

  // Test unified activity feed with logging
  useEffect(() => {
    async function testActivityFeed() {
      if (!user?.id) {
        console.log('[Activity Feed] User not authenticated, skipping test')
        return
      }

      try {
        console.log('[Activity Feed] Testing unified activity feed endpoint...')
        
        // Import the API function dynamically to avoid SSR issues
        const { fetchRecentActivity, fetchActivityFeed } = await import('@/lib/api/client')
        
        // Test 1: Recent activity (last 20 items)
        console.log('[Activity Feed] Fetching recent activity (limit: 20)...')
        const recentResult = await fetchRecentActivity(20)
        console.log('[Activity Feed] ✅ Recent activity fetched:', {
          totalCount: recentResult.total_count,
          dateRange: recentResult.date_range,
          activities: recentResult.activities.length,
          firstActivity: recentResult.activities[0],
        })
        
        // Log activity breakdown by type
        const bankingCount = recentResult.activities.filter(a => a.type === 'banking').length
        const investmentCount = recentResult.activities.filter(a => a.type === 'investment').length
        console.log('[Activity Feed] Activity breakdown:', {
          banking: bankingCount,
          investment: investmentCount,
          total: recentResult.activities.length,
        })

        // Test 2: Full feed (last 30 days, all types)
        console.log('[Activity Feed] Fetching full activity feed (30 days, all types)...')
        const feedResult = await fetchActivityFeed(30)
        console.log('[Activity Feed] ✅ Full feed fetched:', {
          totalCount: feedResult.total_count,
          dateRange: feedResult.date_range,
          activities: feedResult.activities.length,
        })

        // Test 3: Banking only
        console.log('[Activity Feed] Fetching banking transactions only...')
        const bankingResult = await fetchActivityFeed(30, 'banking')
        console.log('[Activity Feed] ✅ Banking only:', {
          totalCount: bankingResult.total_count,
          activities: bankingResult.activities.length,
        })

        // Test 4: Investment only
        console.log('[Activity Feed] Fetching investment transactions only...')
        const investmentResult = await fetchActivityFeed(30, 'investment')
        console.log('[Activity Feed] ✅ Investment only:', {
          totalCount: investmentResult.total_count,
          activities: investmentResult.activities.length,
        })

        console.log('[Activity Feed] All tests completed successfully! 🎉')
      } catch (error) {
        console.error('[Activity Feed] ❌ Error testing activity feed:', error)
      }
    }

    testActivityFeed()
  }, [user])

  const bands = [
    {
      content: (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
        >
          <NetWorthTimeline />
        </motion.div>
      ),
      span: "full" as const,
    },
    {
      content: (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, delay: 0.05 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-foreground">Cash &amp; Liabilities</h2>
          <CashFlow />
        </motion.div>
      ),
      span: "full" as const,
    },
    {
      content: (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          <RecentActivity />
        </motion.div>
      ),
      span: "half" as const,
    },
    {
      content: (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, delay: 0.15 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-foreground">Accountability</h2>
          <AccountabilityChecklist surface="overview" />
        </motion.div>
      ),
      span: "half" as const,
    },
  ]

  const insights = (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: 0.2 }}
      className="space-y-4"
    >
      <h2 className="text-lg font-semibold text-foreground">Insights</h2>
      <ErrorBoundary feature="AI Insights">
        <AIInsights />
      </ErrorBoundary>
    </motion.div>
  )

  return (
    <DashboardShell
      title="Overview"
      kpis={
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
        >
          <OverviewKPIs />
        </motion.div>
      }
      bands={bands}
      insights={insights}
    />
  )
}
