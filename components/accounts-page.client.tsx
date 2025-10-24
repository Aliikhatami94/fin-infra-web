"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Plus, ShieldCheck, Zap } from "lucide-react"

import {
  AccountsKPICardsSkeleton,
  AccountsTableSkeleton,
  AIInsightsBannerSkeleton,
} from "@/components/dashboard-skeletons"
import { AccountsCallouts } from "@/components/accounts-callouts"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

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
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)

  const handleLinkAccount = () => {
    setLinkDialogOpen(true)
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 page-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-display font-semibold text-foreground">Accounts</h1>
          <p className="text-body text-muted-foreground mt-1">Manage your linked bank accounts and credit cards</p>
        </div>
        <div className="hidden shrink-0 md:flex md:items-center md:gap-3">
          <Button
            size="lg"
            className="h-11 gap-2 px-5 text-sm font-semibold shadow-sm"
            onClick={handleLinkAccount}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Link account
          </Button>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleLinkAccount}
        className="fixed bottom-24 right-5 z-30 flex h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold shadow-lg shadow-primary/30 md:hidden"
        aria-label="Link a new financial account"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        <span>Link account</span>
      </Button>

      <AccountsKPICards totalCash={totalCash} totalCreditDebt={totalCreditDebt} totalInvestments={totalInvestments} />

      <AccountsCallouts />

      <AIInsightsBanner />

      <AccountsTable />

      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground">Link a new account</DialogTitle>
            <DialogDescription>
              Securely connect your bank, brokerage, or credit card to keep balances and activity up to date.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg border border-dashed bg-muted/40 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-foreground">Bank-grade security</p>
                  <p className="text-muted-foreground">
                    Connections run through Plaid with encryption and read-only access. We cannot move money.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Popular providers</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { label: "Bank or credit union", description: "Chase, Wells Fargo, Ally" },
                  { label: "Brokerage", description: "Fidelity, Vanguard, Robinhood" },
                  { label: "Credit card", description: "Amex, Capital One" },
                  { label: "Other financial", description: "401(k), HSA, mortgage" },
                ].map((option) => (
                  <Button
                    key={option.label}
                    type="button"
                    variant="outline"
                    className="h-auto justify-start gap-2 py-3 text-left"
                    onClick={() => setLinkDialogOpen(false)}
                  >
                    <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
                    <div className="flex flex-col text-sm">
                      <span className="font-semibold text-foreground">{option.label}</span>
                      <span className="text-muted-foreground">{option.description}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            <Separator />
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Need to add a manual account? You can enter a balance snapshot and update it anytime.</p>
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" type="button" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => setLinkDialogOpen(false)} className="gap-2">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Continue to Plaid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
