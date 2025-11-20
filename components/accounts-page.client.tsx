"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CollapsibleSection } from "@/components/collapsible-section"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { isMarketingMode } from "@/lib/marketingMode"
import { listLinkableInstitutions, simulateInstitutionLink } from "@/lib/services"
import type { Account, LinkedInstitution, InstitutionConnectionStatus } from "@/types/domain"

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

const PlaidLinkButton = dynamic(() => import("@/components/plaid-link-button").then((m) => m.PlaidLinkButton), {
  ssr: false,
})

interface AccountsPageClientProps {
  accounts: Account[]
  totalCash: number
  totalCreditDebt: number
  totalInvestments: number
}

export function AccountsPageClient({ accounts, totalCash, totalCreditDebt, totalInvestments }: AccountsPageClientProps) {
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false)
  const [institutionToDisconnect, setInstitutionToDisconnect] = useState<string | null>(null)
  const [linkModalOpen, setLinkModalOpen] = useState(false)
  const [linkingInstitution, setLinkingInstitution] = useState<string | null>(null)
  const [linkErrors, setLinkErrors] = useState<Record<string, string>>({})
  const inMarketingMode = isMarketingMode()
  const institutions = useMemo(() => listLinkableInstitutions(), [])

  const handleRequestLink = () => {
    setLinkModalOpen(true)
  }

  const handlePlaidSuccess = async (accessToken: string, itemId: string, institutionName: string) => {
    toast.success(`${institutionName} connected`, {
      description: "Fetching your accounts...",
    })
    // Reload page to fetch new accounts
    window.location.reload()
  }

  const handleDisconnect = (institution: string) => {
    setInstitutionToDisconnect(institution)
    setDisconnectDialogOpen(true)
  }

  const handleLinkInstitution = async (institutionId: string) => {
    const definition = institutions.find((inst) => inst.id === institutionId)
    if (!definition) return

    setLinkingInstitution(institutionId)
    setLinkErrors((prev) => ({ ...prev, [institutionId]: "" }))

    try {
      const result = await simulateInstitutionLink(definition.id)
      setLinkModalOpen(false)
      toast.success(`${definition.name} connected`, {
        description: "Demo institution connected successfully.",
      })
      // Reload to show new accounts
      window.location.reload()
    } catch (error) {
      const message = error instanceof Error ? error.message : "We couldn't connect this institution."
      setLinkErrors((prev) => ({ ...prev, [institutionId]: message }))
      toast.error(`Couldn't connect to ${definition.name}`, {
        description: message,
      })
    } finally {
      setLinkingInstitution(null)
    }
  }

  const confirmDisconnect = async () => {
    if (!institutionToDisconnect) return

    try {
      const token = localStorage.getItem("auth_token")
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      
      // Default to plaid provider (could be enhanced to detect provider from institution)
      const provider = "plaid"
      
      const response = await fetch(`${API_URL}/v0/banking-connection/${provider}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        toast.success(`${institutionToDisconnect} disconnected`, {
          description: "All accounts from this institution have been removed.",
        })
        setDisconnectDialogOpen(false)
        setInstitutionToDisconnect(null)
        // Reload page to refresh accounts
        window.location.reload()
      } else {
        const errorText = await response.text()
        toast.error("Failed to disconnect", {
          description: errorText || "Unable to disconnect institution. Please try again.",
        })
      }
    } catch (error) {
      console.error("Error disconnecting institution:", error)
      toast.error("Failed to disconnect", {
        description: "An unexpected error occurred.",
      })
    }
  }

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-foreground">Accounts</h1>
              <p className="text-sm text-muted-foreground">Manage all your connected accounts and financial institutions</p>
            </div>
            <div className="flex items-center">
              {inMarketingMode ? (
                <Button
                  variant="cta"
                  size="sm"
                  className="gap-2"
                  onClick={handleRequestLink}
                  disabled={linkingInstitution !== null}
                >
                  {linkingInstitution ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Linking…
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Link accounts (Demo)
                    </>
                  )}
                </Button>
              ) : (
                <PlaidLinkButton onSuccess={handlePlaidSuccess}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Link accounts
                </PlaidLinkButton>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="w-full px-4 sm:px-6 lg:px-8 space-y-6 py-6"
      >
        {linkingInstitution && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status" aria-live="polite">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>
              Linking {linkingInstitution}
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
          storageKey="banking-ai-insights-expanded"
          defaultExpanded={false}
        >
          <AIInsightsBanner />
        </CollapsibleSection>

        <CollapsibleSection
          title="All Accounts"
          storageKey="accounts-table-expanded"
          defaultExpanded={true}
        >
          <AccountsTable
            accounts={accounts}
            onRequestLink={handleRequestLink}
            onDisconnect={handleDisconnect}
            isLinking={linkingInstitution !== null}
            linkingInstitution={linkingInstitution}
          />
        </CollapsibleSection>

        <ConfirmDialog
          open={disconnectDialogOpen}
          onOpenChange={setDisconnectDialogOpen}
          title="Disconnect Institution?"
          description={`Are you sure you want to disconnect ${institutionToDisconnect}? All accounts from this institution will be removed from your dashboard.`}
          confirmLabel="Disconnect"
          confirmVariant="destructive"
          onConfirm={confirmDisconnect}
        />

        <Dialog open={linkModalOpen} onOpenChange={setLinkModalOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Select an institution</DialogTitle>
              <DialogDescription>Choose an institution to simulate a secure OAuth-style connection.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              {institutions.map((institution) => (
                <button
                  key={institution.id}
                  type="button"
                  className="rounded-lg border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary border-border hover:border-primary/60"
                  onClick={() => handleLinkInstitution(institution.id)}
                  disabled={linkingInstitution === institution.id}
                  aria-busy={linkingInstitution === institution.id}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{institution.name}</p>
                      <p className="text-xs text-muted-foreground">{institution.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {linkingInstitution === institution.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
                          <span className="text-xs text-muted-foreground">Connecting…</span>
                        </>
                      ) : (
                        <span className={`rounded-full px-2 py-1 text-xs ${institution.color}`}>OAuth mock</span>
                      )}
                    </div>
                  </div>
                  {linkErrors[institution.id] ? (
                    <p className="mt-2 text-xs text-destructive">{linkErrors[institution.id]}</p>
                  ) : null}
                  {linkingInstitution === institution.id ? (
                    <span className="sr-only" aria-live="polite">
                      Connecting to {institution.name}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </>
  )
}

export default AccountsPageClient
