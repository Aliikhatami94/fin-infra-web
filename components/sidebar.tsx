"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
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

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground pl-2"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.02]",
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
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
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">john@example.com</p>
              </div>
            </div>
          )}
          <div className="p-2">
            <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="w-full justify-start">
              <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
              {!collapsed && <span className="ml-2">Collapse</span>}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
