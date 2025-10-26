"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { OfflineBanner } from "@/components/offline-banner"
import { ConnectivityProvider } from "@/components/connectivity-provider"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"

const AIChatSidebar = dynamic(() => import("@/components/ai-chat-sidebar").then((m) => m.AIChatSidebar), {
  ssr: false,
})

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
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
                className="flex-1 overflow-x-hidden overflow-y-auto rounded-xl bg-card border mr-2 mb-2"
              >
                <div className="mx-auto min-h-full w-full">
                  {children}
                </div>
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
            <AIChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          </div>
        </div>

      </div>
    </ConnectivityProvider>
  )
}

export default DashboardLayout
