import type React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { WorkspaceProvider } from "@/components/workspace-provider"

export default function DashboardLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <WorkspaceProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </WorkspaceProvider>
  )
}
