import type React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { WorkspaceProvider } from "@/components/workspace-provider"
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProtectedRoute>
      <WorkspaceProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </WorkspaceProvider>
    </ProtectedRoute>
  )
}
