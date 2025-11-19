import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { PrivacyProvider } from "../components/privacy-provider"
import { DateRangeProvider } from "@/components/date-range-provider"
import { PersonaProvider } from "@/components/persona-provider"
import { MarketingModeScript } from "@/components/marketing-mode-script"
import { BRAND } from "@/lib/brand"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import GlobalFeedbackTrigger from "@/components/global-feedback-trigger"
import { DensityProvider } from "@/app/providers/density-provider"
import { AppearanceProvider } from "@/components/appearance-provider"
import { AuthProvider } from "@/lib/auth/context"

const _inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: `${BRAND.name} - ${BRAND.tagline}`,
  description: BRAND.description,
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${_inter.className} ${_inter.variable} ${_jetbrainsMono.variable} font-sans antialiased`}>
        {/* Skip to content for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:text-sm focus:font-medium focus:border focus:border-border focus:rounded-md focus:shadow-md focus:outline-none"
        >
          Skip to main content
        </a>
        <AppearanceProvider>
          <DensityProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <AuthProvider>
                <PrivacyProvider>
                  <PersonaProvider>
                    <DateRangeProvider>
                      <MarketingModeScript />
                      {children}
                      {/* Global feedback button available on all pages */}
                      <GlobalFeedbackTrigger />
                    </DateRangeProvider>
                  </PersonaProvider>
                </PrivacyProvider>
              </AuthProvider>
            </ThemeProvider>
          </DensityProvider>
        </AppearanceProvider>
        <Toaster richColors position="top-right" closeButton />
        {/* Analytics: Only track in production to avoid polluting data with dev traffic */}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
