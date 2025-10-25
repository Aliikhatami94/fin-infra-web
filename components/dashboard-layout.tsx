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
      <div className="flex min-h-screen flex-col bg-card md:flex-row">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
          collapsed={isSidebarCollapsed}
          onCollapsedChange={setIsSidebarCollapsed}
        />

        <div className="flex min-h-screen w-full flex-1 flex-col">
          <div
            className={cn(
              "flex flex-1 flex-col transition-[padding] duration-300",
              isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64",
            )}
          >
            <OfflineBanner />

            <main
              id="main-content"
              className="flex-1 overflow-x-hidden bg-background pb-24 pt-4 md:pb-10 md:pt-6 rounded-xl md:rounded-2xl"
            >
              <div className="mx-auto min-h-full w-full max-w-[1680px] px-4 sm:px-6 lg:px-10">
                {/* Embedded top navigation inside content container */}
                <div className="mb-4 md:mb-6">
                  <TopBar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
                </div>
                {children}
              </div>
            </main>

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
