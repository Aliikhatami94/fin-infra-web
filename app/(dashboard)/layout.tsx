import type React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function DashboardLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <DashboardLayout>{children}</DashboardLayout>
}
