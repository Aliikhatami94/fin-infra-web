"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { isActiveRoute } from "@/lib/navigation"
import { prefetchAppRoute, getBadgeTooltipCopy } from "@/lib/linking"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DASHBOARD_NAVIGATION } from "@/lib/navigation/routes"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}



export function Sidebar({
  mobileOpen = false,
  onMobileClose,
  collapsed: collapsedProp,
  onCollapsedChange,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const collapsed = collapsedProp ?? internalCollapsed

  const toggleCollapsed = () => {
    const nextCollapsed = !collapsed

    if (collapsedProp === undefined) {
      setInternalCollapsed(nextCollapsed)
    }

    onCollapsedChange?.(nextCollapsed)
  }
  const pathname = usePathname()
  const router = useRouter()
  const prefetchedRoutes = useRef(new Set<string>())

  const handlePrefetch = (href: string) => {
    if (prefetchedRoutes.current.has(href)) {
      return
    }

    prefetchedRoutes.current.add(href)
    void prefetchAppRoute(router, href).then((success) => {
      if (!success) {
        prefetchedRoutes.current.delete(href)
      }
    })
  }

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
    <TooltipProvider delayDuration={200}>
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
          "fixed left-0 top-0 z-50 h-screen border-r bg-card transition-all duration-300 ease-in-out",
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
          {/* Brand header */}
          <div className="flex items-center justify-between border-b p-4">
            {!collapsed ? (
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tracking-tight">ClarityLedger</span>
                <Badge variant="outline" className="font-mono text-[10px] leading-none">Live</Badge>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">CL</span>
              </div>
            )}
            {/* Close button on mobile */}
            <div className="lg:hidden">
              <Button variant="ghost" size="icon" onClick={onMobileClose} aria-label="Close navigation">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {DASHBOARD_NAVIGATION.map((item) => {
                const active = isActiveRoute(pathname, item.href, { exact: item.exact })
                const badgeTooltip = getBadgeTooltipCopy(item.name, item.badge, item.badgeTooltip)
                const fallbackTooltip = badgeTooltip ?? `${item.badge} updates pending in ${item.name}`
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onMobileClose}
                    onMouseEnter={() => handlePrefetch(item.href)}
                    onFocus={() => handlePrefetch(item.href)}
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
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="destructive"
                                className="h-5 min-w-5 px-1 text-xs"
                                aria-label={fallbackTooltip}
                              >
                                {item.badge}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p>{fallbackTooltip}</p>
                            </TooltipContent>
                          </Tooltip>
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
                onClick={toggleCollapsed}
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
    </TooltipProvider>
  )
}
