"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const AccountsKPICards = dynamic(
  () => import("@/components/accounts-kpi-cards").then((m) => m.AccountsKPICards),
  { ssr: false },
)
const AccountsCallouts = dynamic(
  () => import("@/components/accounts-callouts").then((m) => m.AccountsCallouts),
  { ssr: false },
)
const AIInsightsBanner = dynamic(
  () => import("@/components/ai-insights-banner").then((m) => m.AIInsightsBanner),
  { ssr: false },
)
const AccountsTable = dynamic(() => import("@/components/accounts-table").then((m) => m.AccountsTable), {
  ssr: false,
})
const PlaidLinkDialog = dynamic(
  () => import("@/components/plaid-link-dialog").then((m) => m.PlaidLinkDialog),
  { ssr: false },
)

export default function AccountsPageClient(props: {
  totalCash: number
  totalCreditDebt: number
  totalInvestments: number
}) {
  const { totalCash, totalCreditDebt, totalInvestments } = props
  const [isPlaidOpen, setIsPlaidOpen] = useState(false)
  const [isLinking, setIsLinking] = useState(false)
  const [linkingInstitution, setLinkingInstitution] = useState<string | null>(null)

  const handleRequestLink = () => {
    setIsPlaidOpen(true)
  }

  const handlePlaidOpenChange = (open: boolean) => {
    if (!open) {
      setIsLinking(false)
      setLinkingInstitution(null)
    }
    setIsPlaidOpen(open)
  }

  const handleLinkStart = (institution: string | null) => {
    setIsLinking(true)
    setLinkingInstitution(institution)
  }

  const handleLinkSuccess = (institution: string | null) => {
    setIsLinking(false)
    setLinkingInstitution(null)
    toast.success("Account linked", {
      description: institution
        ? `${institution} is now connected and syncing.`
        : "Your account is now connected and syncing.",
    })
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 page-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-display font-semibold text-foreground">Accounts</h1>
            <p className="text-body text-muted-foreground mt-1">Manage your linked bank accounts and credit cards</p>
          </div>
          {isLinking && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status" aria-live="polite">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>
                Linking {linkingInstitution ? `${linkingInstitution}` : "account"}
                &hellip;
              </span>
            </div>
          )}
        </div>
        <Button
          variant="cta"
          size="lg"
          className="w-full sm:w-auto"
          onClick={handleRequestLink}
          disabled={isLinking}
        >
          {isLinking ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              Linking…
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" aria-hidden="true" />
              Link accounts
            </>
          )}
        </Button>
      </div>

      <AccountsKPICards totalCash={totalCash} totalCreditDebt={totalCreditDebt} totalInvestments={totalInvestments} />

      <AccountsCallouts />

      <AIInsightsBanner />

      <AccountsTable
        onRequestLink={handleRequestLink}
        isLinking={isLinking}
        linkingInstitution={linkingInstitution}
      />

      <PlaidLinkDialog
        open={isPlaidOpen}
        onOpenChange={handlePlaidOpenChange}
        onLinkStart={handleLinkStart}
        onLinkSuccess={handleLinkSuccess}
      />
    </div>
  )
}
