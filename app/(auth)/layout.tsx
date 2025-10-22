import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In - Wealth Dashboard",
  description: "Sign in to your wealth management dashboard",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-background">{children}</div>
}
