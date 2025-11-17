"use client"

import type React from "react"

import { useEffect, useState, Suspense } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { OfflineBanner } from "@/components/offline-banner"
import { ConnectivityProvider, useConnectivity } from "@/components/connectivity-provider"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { DashboardBackToTop } from "@/components/dashboard-back-to-top"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useOnboardingState } from "@/hooks/use-onboarding-state"
import { useAuth } from "@/lib/auth/context"
import { isMarketingMode, parseMarketingOptions } from "@/lib/marketingMode"
import { getMarketingChatPreset } from "@/lib/marketingPresets"
import type { AIChatMessage } from "@/components/ai-chat-sidebar"

// Module-level helpers for marketing transcript persistence
const marketingKeyFor = (scenario?: string | null) => `marketing::chat::${(scenario ?? 'default').toLowerCase()}`
type StoredMsg = { id: string; role: 'user' | 'assistant'; content: string; timestamp: string }
function loadStoredTranscript(scenario?: string | null): AIChatMessage[] | undefined {
  try {
    if (typeof window === 'undefined') return undefined
    const raw = window.localStorage.getItem(marketingKeyFor(scenario))
    if (!raw) return undefined
    const parsed = JSON.parse(raw) as StoredMsg[]
    return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }))
  } catch {
    return undefined
  }
}
function saveStoredTranscript(messages: AIChatMessage[], scenario?: string | null) {
  try {
    if (typeof window === 'undefined') return
    const toStore: StoredMsg[] = messages.map((m) => ({ ...m, timestamp: m.timestamp.toISOString() }))
    window.localStorage.setItem(marketingKeyFor(scenario), JSON.stringify(toStore))
  } catch {
    // ignore write errors
  }
}

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
  const [marketingScenario, setMarketingScenario] = useState<string | null>(null)
  const [marketingAutoplay, setMarketingAutoplay] = useState<boolean>(false)
  const [marketingPrefill, setMarketingPrefill] = useState<string | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { state, hydrated } = useOnboardingState()
  const { user } = useAuth()
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

  // Route gate: redirect to welcome if onboarding not completed (server-side check)
  useEffect(() => {
    // Skip auth checks in marketing mode
    if (inMarketingMode) return
    
    // Wait for user data to load
    if (!user) return
    
    // Allow onboarding, welcome page, auth, and demo pages
    const allowPrefixes = ["/onboarding", "/welcome", "/auth", "/demo"]
    const allowed = allowPrefixes.some((p) => pathname?.startsWith(p))
    
    // Redirect to welcome if onboarding not completed (server-side flag is source of truth)
    if (!user.onboarding_completed && !allowed) {
      router.replace("/welcome")
    }
  }, [user, pathname, router, inMarketingMode])

  // Marketing helpers: optionally auto-open chat and preload a transcript
  useEffect(() => {
    const { enabled, chatOpen, scenario, chatInput, autoplay } = parseMarketingOptions(searchParams)
    if (!enabled) return
    setMarketingScenario(scenario ?? 'default')
    setMarketingPrefill(chatInput ?? null)
    // Load from storage if present; otherwise use presets
    const stored = loadStoredTranscript(scenario)
    const hasStored = !!stored && stored.length > 0
    if (chatOpen) {
      setIsChatOpen(true)
      setMarketingInitialChat(hasStored ? stored : getMarketingChatPreset(scenario))
      setMarketingAutoplay(!!autoplay && !hasStored)
    }
  }, [searchParams])
  
  return (
    <ConnectivityProvider>
      <div className="fixed inset-0 flex overflow-hidden flex-col lg:flex-row">
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
              {/* Desktop: Header outside main content */}
              <header className="hidden lg:block">
                <TopBar
                  onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  sidebarCollapsed={isSidebarCollapsed}
                />
              </header>

              <main
                id="main-content"
                className="relative flex-1 overflow-auto lg:rounded-xl bg-card lg:mr-2 lg:mb-2 border border-border/70 lg:mt-14"
              >
                {/* Mobile: TopBar inside main content for sticky behavior */}
                <div className="lg:hidden">
                  <TopBar
                    onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    sidebarCollapsed={isSidebarCollapsed}
                  />
                </div>

                <DashboardContent>{children}</DashboardContent>
              </main>
            </div>

            {/* Mobile: Back to top button */}
            <DashboardBackToTop />

            {/* Global AI chat trigger and sidebar */}
            <Button
              onClick={() => setIsChatOpen((v) => !v)}
              className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-[110]"
              size="icon"
              aria-label="Open chat"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
            <AIChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} initialMessages={marketingInitialChat}
              // Marketing/demo props
              marketingMode={inMarketingMode}
              currentScenario={marketingScenario}
              prefillInput={marketingPrefill}
              autoplay={marketingAutoplay}
              onScenarioChange={(s) => {
                setMarketingScenario(s)
                const stored = loadStoredTranscript(s)
                const hasStored = !!stored && stored.length > 0
                setMarketingInitialChat(hasStored ? stored : getMarketingChatPreset(s))
                setMarketingAutoplay(!hasStored)
              }}
              onMessagesChange={(msgs) => {
                if (!inMarketingMode) return
                saveStoredTranscript(msgs, marketingScenario)
              }}
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
