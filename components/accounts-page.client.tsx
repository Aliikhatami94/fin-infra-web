"use client"

import dynamic from "next/dynamic"

import {
  AccountsKPICardsSkeleton,
  AccountsTableSkeleton,
  AIInsightsBannerSkeleton,
} from "@/components/dashboard-skeletons"

const AccountsKPICards = dynamic(
  () => import("@/components/accounts-kpi-cards").then((mod) => mod.AccountsKPICards),
  {
    ssr: false,
    loading: () => <AccountsKPICardsSkeleton />,
  },
)

const AIInsightsBanner = dynamic(
  () => import("@/components/ai-insights-banner").then((mod) => mod.AIInsightsBanner),
  {
    ssr: false,
    loading: () => <AIInsightsBannerSkeleton />,
  },
)

const AccountsTable = dynamic(
  () => import("@/components/accounts-table").then((mod) => mod.AccountsTable),
  {
    ssr: false,
    loading: () => <AccountsTableSkeleton />,
  },
)

export default function AccountsPageClient(props: {
  totalCash: number
  totalCreditDebt: number
  totalInvestments: number
}) {
  const { totalCash, totalCreditDebt, totalInvestments } = props
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 page-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display font-semibold text-foreground">Accounts</h1>
          <p className="text-body text-muted-foreground mt-1">Manage your linked bank accounts and credit cards</p>
        </div>
      </div>

      <AccountsKPICards totalCash={totalCash} totalCreditDebt={totalCreditDebt} totalInvestments={totalInvestments} />

      <AIInsightsBanner />

      <AccountsTable />
    </div>
  )
}
