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
