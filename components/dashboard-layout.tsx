"use client"

import type React from "react"

import { useEffect, useState, Suspense } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { OfflineBanner } from "@/components/offline-banner"
import { ConnectivityProvider, useConnectivity } from "@/components/connectivity-provider"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useOnboardingState } from "@/hooks/use-onboarding-state"
import { isMarketingMode, parseMarketingOptions } from "@/lib/marketingMode"
import { getMarketingChatPreset } from "@/lib/marketingPresets"
import type { AIChatMessage } from "@/components/ai-chat-sidebar"

const AIChatSidebar = dynamic(() => import("@/components/ai-chat-sidebar").then((m) => m.AIChatSidebar), {
  ssr: false,
})

function DashboardLoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  )
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { status } = useConnectivity()
  
  return (
    <div className="relative min-h-full w-full">
      {status === "initializing" && <DashboardLoadingOverlay />}
      {children}
    </div>
  )
}

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [marketingInitialChat, setMarketingInitialChat] = useState<AIChatMessage[] | undefined>(undefined)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { state, hydrated } = useOnboardingState()
  const SIDEBAR_STORAGE_KEY = "ui::sidebar-collapsed"

  // Check if in marketing mode
  const inMarketingMode = isMarketingMode(searchParams)

  // Load persisted sidebar state
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(SIDEBAR_STORAGE_KEY) : null
      if (raw != null) {
        const parsed = JSON.parse(raw)
        if (typeof parsed === "boolean") {
          setIsSidebarCollapsed(parsed)
        }
      }
    } catch {
      // ignore storage parsing errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist sidebar collapse state
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(isSidebarCollapsed))
      }
    } catch {
      // ignore storage write errors
    }
  }, [isSidebarCollapsed])

  // Route gate: if no connected institutions, send users to the welcome screen before dashboard
  useEffect(() => {
    // Skip auth checks in marketing mode
    if (inMarketingMode) return
    
    if (!hydrated) return
    const hasConnected = state.linkedInstitutions.some((i) => i.status === "connected")
    // Allow onboarding and the welcome page itself; everything else under the dashboard is gated
  const allowPrefixes = ["/onboarding", "/welcome", "/auth", "/demo"]
    const allowed = allowPrefixes.some((p) => pathname?.startsWith(p))
    if (!hasConnected && !allowed) {
      router.replace("/welcome")
    }
  }, [hydrated, pathname, router, state.linkedInstitutions, inMarketingMode])

  // Marketing helpers: optionally auto-open chat and preload a transcript
  useEffect(() => {
    const { enabled, chatOpen, scenario } = parseMarketingOptions(searchParams)
    if (!enabled) return
    if (chatOpen) {
      setIsChatOpen(true)
      setMarketingInitialChat(getMarketingChatPreset(scenario))
    }
  }, [searchParams])
  
  return (
    <ConnectivityProvider>
      <div className="fixed inset-0 flex overflow-hidden flex-col md:flex-row">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
          collapsed={isSidebarCollapsed}
          onCollapsedChange={setIsSidebarCollapsed}
        />

        <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col overflow-hidden transition-[padding] duration-300",
              isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64",
            )}
          >
            <OfflineBanner />
            
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
              <header className="sticky inset-x-0 top-0 z-40 h-12 md:h-14">
                <TopBar
                  onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  sidebarCollapsed={isSidebarCollapsed}
                />
              </header>

              <main
                id="main-content"
                className="relative flex-1 overflow-hidden lg:rounded-xl bg-card lg:mr-2 lg:mb-2 border border-border/70"
                style={{ overflow: 'auto', overflowX: 'hidden' }}
              >
                <DashboardContent>{children}</DashboardContent>
              </main>
            </div>

            {/* Global AI chat trigger and sidebar */}
            <Button
              onClick={() => setIsChatOpen((v) => !v)}
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-[60]"
              size="icon"
              aria-label="Open AI assistant"
            >
              <Bot className="h-6 w-6" />
            </Button>
            <AIChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} initialMessages={marketingInitialChat}
            />
          </div>
        </div>

      </div>
    </ConnectivityProvider>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<DashboardLoadingOverlay />}>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </Suspense>
  )
}

export default DashboardLayout
