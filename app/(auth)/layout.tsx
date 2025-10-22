import type React from "react"
import type { Metadata } from "next"
import { BRAND } from "@/lib/brand"

export const metadata: Metadata = {
  title: `Sign In - ${BRAND.name}`,
  description: `Sign in to your ${BRAND.name} dashboard`,
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-background">{children}</div>
}
