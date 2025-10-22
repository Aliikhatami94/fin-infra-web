"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Wallet,
  Bitcoin,
  TrendingUp,
  Target,
  Receipt,
  Lightbulb,
  FileText,
  Settings,
  ChevronLeft,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { isActiveRoute } from "@/lib/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigation = [
  { name: "Overview", href: "/overview", icon: LayoutDashboard },
  { name: "Accounts", href: "/accounts", icon: Building2, badge: 2 },
  { name: "Portfolio", href: "/portfolio", icon: Wallet },
  { name: "Crypto", href: "/crypto", icon: Bitcoin },
  { name: "Cash Flow", href: "/cash-flow", icon: TrendingUp },
  { name: "Budget", href: "/budget", icon: Receipt },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Taxes", href: "/taxes", icon: FileText },
  { name: "Insights", href: "/insights", icon: Lightbulb },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] border-r bg-card transition-all duration-300 ease-in-out",
          // Desktop: always visible with proper width
          "lg:translate-x-0",
          // Mobile: slide in/out, full width when open
          mobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64",
          // Desktop collapsed state
          collapsed && "lg:w-16",
          !collapsed && "lg:w-64",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4 lg:hidden">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button variant="ghost" size="icon" onClick={onMobileClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {navigation.map((item) => {
                const active = isActiveRoute(pathname, item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <Badge variant="destructive" className="h-5 min-w-5 px-1 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="border-t">
            {!collapsed && (
              <div className="flex items-center gap-3 p-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">John Doe</p>
                  <p className="text-xs text-muted-foreground truncate">john@example.com</p>
                </div>
              </div>
            )}
            <div className="p-2 hidden lg:block">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(!collapsed)}
                className="w-full justify-start"
                aria-pressed={collapsed}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
                {!collapsed && <span className="ml-2">Collapse</span>}
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
