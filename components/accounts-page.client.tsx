"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CollapsibleSection } from "@/components/collapsible-section"

const AccountsKPICards = dynamic(() => import("@/components/accounts-kpi-cards").then((m) => m.AccountsKPICards), {
  ssr: false,
})

const AccountsCallouts = dynamic(() => import("@/components/accounts-callouts").then((m) => m.AccountsCallouts), {
  ssr: false,
})

const AIInsightsBanner = dynamic(() => import("@/components/ai-insights-banner").then((m) => m.AIInsightsBanner), {
  ssr: false,
})

const AccountsTable = dynamic(() => import("@/components/accounts-table").then((m) => m.AccountsTable), { ssr: false })

const PlaidLinkDialog = dynamic(() => import("@/components/plaid-link-dialog").then((m) => m.PlaidLinkDialog), {
  ssr: false,
})

interface AccountsPageClientProps {
  totalCash: number
  totalCreditDebt: number
  totalInvestments: number
}

export function AccountsPageClient({ totalCash, totalCreditDebt, totalInvestments }: AccountsPageClientProps) {
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
    <>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-foreground">Accounts</h1>
              <p className="text-sm text-muted-foreground">Manage your linked bank accounts and credit cards</p>
            </div>
            <div className="flex items-center">
              <Button
                variant="cta"
                size="sm"
                className="gap-2"
                onClick={handleRequestLink}
                disabled={isLinking}
              >
                {isLinking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Linking…
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Link accounts
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10 space-y-6 py-6"
      >
        {isLinking && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status" aria-live="polite">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>
              Linking {linkingInstitution ? `${linkingInstitution}` : "account"}
              &hellip;
            </span>
          </div>
        )}
        <AccountsKPICards totalCash={totalCash} totalCreditDebt={totalCreditDebt} totalInvestments={totalInvestments} />

        <CollapsibleSection
          title="Financial Health"
          storageKey="accounts-callouts-expanded"
          defaultExpanded={false}
        >
          <AccountsCallouts />
        </CollapsibleSection>

        <CollapsibleSection
          title="AI Insights"
          storageKey="accounts-ai-insights-expanded"
          defaultExpanded={false}
        >
          <AIInsightsBanner />
        </CollapsibleSection>

        <CollapsibleSection
          title="All Accounts"
          storageKey="accounts-table-expanded"
          defaultExpanded={true}
        >
          <AccountsTable onRequestLink={handleRequestLink} isLinking={isLinking} linkingInstitution={linkingInstitution} />
        </CollapsibleSection>

        <PlaidLinkDialog
          open={isPlaidOpen}
          onOpenChange={handlePlaidOpenChange}
          onLinkStart={handleLinkStart}
          onLinkSuccess={handleLinkSuccess}
        />
      </motion.div>
    </>
  )
}

export default AccountsPageClient
