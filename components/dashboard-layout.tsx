"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { MobileNav } from "@/components/mobile-nav"
import { OfflineBanner } from "@/components/offline-banner"
import { ConnectivityProvider } from "@/components/connectivity-provider"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import dynamic from "next/dynamic"

const AIChatSidebar = dynamic(() => import("@/components/ai-chat-sidebar").then((m) => m.AIChatSidebar), {
  ssr: false,
})

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <ConnectivityProvider>
      <div className="flex min-h-screen flex-col bg-background md:flex-row">
        <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

        <div className="flex min-h-screen w-full flex-1 flex-col">
          <TopBar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <div className="flex flex-1 flex-col pt-16 lg:pl-64">
            <OfflineBanner />

            <main
              id="main-content"
              className="flex-1 overflow-x-hidden bg-background pb-24 pt-4 md:pb-10 md:pt-6"
            >
              <div className="mx-auto min-h-full w-full max-w-[1680px] px-4 sm:px-6 lg:px-10">{children}</div>
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

        <MobileNav />
      </div>
    </ConnectivityProvider>
  )
}

export default DashboardLayout
