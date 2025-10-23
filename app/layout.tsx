import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { PrivacyProvider } from "../components/privacy-provider"
import { DateRangeProvider } from "@/components/date-range-provider"
import { PersonaProvider } from "@/components/persona-provider"
import { BRAND } from "@/lib/brand"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

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
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-3 focus:py-2 focus:bg-primary focus:text-primary-foreground rounded"
        >
          Skip to main content
        </a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <PrivacyProvider>
            <PersonaProvider>
              <DateRangeProvider>{children}</DateRangeProvider>
            </PersonaProvider>
          </PrivacyProvider>
        </ThemeProvider>
        <Toaster richColors position="top-right" closeButton />
        <Analytics />
      </body>
    </html>
  )
}
