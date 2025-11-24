"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, X, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { isActiveRoute } from "@/lib/navigation"
import { prefetchAppRoute, getBadgeTooltipCopy } from "@/lib/linking"
import { DASHBOARD_NAVIGATION } from "@/lib/navigation/routes"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BRAND } from "@/lib/brand"
import { isMarketingMode } from "@/lib/marketingMode"

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
  const searchParams = useSearchParams()
  const isMarketing = isMarketingMode(searchParams)
  const prefetchedRoutes = useRef(new Set<string>())
  const [envBadge, setEnvBadge] = useState<string>("Live")

  useEffect(() => {
    const fetchEnv = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v0/status`)
        if (res.ok) {
          const data = await res.json()
          const envMap: Record<string, string> = {
            local: "Local",
            dev: "Dev",
            test: "Test",
            prod: "Live"
          }
          if (data.env && envMap[data.env]) {
            setEnvBadge(envMap[data.env])
          }
        }
      } catch (e) {
        // Ignore errors, default to Live
      }
    }
    fetchEnv()
  }, [])

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
        {/* Mobile backdrop with blur and darken effect */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
            aria-hidden="true"
          />
        )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-background transition-all duration-300 ease-in-out overflow-hidden",
          // Desktop: always visible with proper width
          "lg:translate-x-0",
          // Mobile: slide in/out, full width on very small screens (sm), partial on larger mobile
          mobileOpen ? "translate-x-0 w-full sm:w-80" : "-translate-x-full w-full sm:w-80",
          // Desktop collapsed state
          collapsed && "lg:w-16",
          !collapsed && "lg:w-64",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Brand header */}
          <div className="flex items-center justify-between p-4">
            {!collapsed ? (
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tracking-tight">{BRAND.name}</span>
                <Badge variant="outline" className="font-mono text-[10px] leading-none">{envBadge}</Badge>
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
              {/* Main Navigation Section */}
              {!collapsed && (
                <div className="px-3 py-1.5 text-[10px] font-normal text-muted-foreground/50 uppercase tracking-wide">
                  Main
                </div>
              )}
              {DASHBOARD_NAVIGATION.filter((item) => 
                !["Profile", "Billing", "Settings", "Security Center"].includes(item.name)
              ).map((item) => {
                const active = isActiveRoute(pathname, item.href, { exact: item.exact })
                const badgeTooltip = getBadgeTooltipCopy(item.name, item.badge, item.badgeTooltip)
                const fallbackTooltip = badgeTooltip ?? `${item.badge} updates pending in ${item.name}`
                const linkClasses = cn(
                  "group flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm font-normal transition-colors",
                  active ? "bg-accent-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )

                // Check if this is a coming soon item (check before collapsed rendering)
                const isComingSoon = item.comingSoon && !isMarketing

                // On mobile (when mobileOpen is true), always show expanded view
                // On desktop (lg), respect collapsed state
                if (collapsed && !mobileOpen) {
                  if (isComingSoon) {
                    return (
                      <Tooltip key={item.name}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              linkClasses,
                              "cursor-not-allowed opacity-50 justify-center"
                            )}
                            aria-disabled="true"
                          >
                            <item.icon className="h-5 w-5 shrink-0" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Coming soon</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  }
                  
                  return (
                    <Tooltip key={item.name}>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          onClick={onMobileClose}
                          onMouseEnter={() => handlePrefetch(item.href)}
                          onFocus={() => handlePrefetch(item.href)}
                          className={cn(linkClasses, "justify-center")}
                          aria-current={active ? "page" : undefined}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                }
                
                if (isComingSoon) {
                  return (
                    <div
                      key={item.name}
                      className={cn(
                        linkClasses,
                        "cursor-not-allowed opacity-50"
                      )}
                      aria-disabled="true"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="flex-1">{item.name}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">Soon</Badge>
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onMobileClose}
                    onMouseEnter={() => handlePrefetch(item.href)}
                    onFocus={() => handlePrefetch(item.href)}
                    className={linkClasses}
                    aria-current={active ? "page" : undefined}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
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
                  </Link>
                )
              })}

              {/* User Settings Section */}
              <div className={cn("mt-4", collapsed && !mobileOpen && "mt-2")}>
                {!collapsed && (
                  <div className="px-3 py-1.5 text-[10px] font-normal text-muted-foreground/50 uppercase tracking-wide">
                    Account
                  </div>
                )}
                {DASHBOARD_NAVIGATION.filter((item) => 
                  ["Profile", "Billing", "Settings", "Security Center"].includes(item.name)
                ).map((item) => {
                  const active = isActiveRoute(pathname, item.href, { exact: item.exact })
                  const badgeTooltip = getBadgeTooltipCopy(item.name, item.badge, item.badgeTooltip)
                  const fallbackTooltip = badgeTooltip ?? `${item.badge} updates pending in ${item.name}`
                  const linkClasses = cn(
                    "group flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm font-normal transition-colors",
                    active ? "bg-accent-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )

                  // Check if this is a coming soon item
                  const isComingSoon = item.comingSoon && !isMarketing

                  // Collapsed view for user settings
                  if (collapsed && !mobileOpen) {
                    if (isComingSoon) {
                      return (
                        <Tooltip key={item.name}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                linkClasses,
                                "cursor-not-allowed opacity-50 justify-center"
                              )}
                              aria-disabled="true"
                            >
                              <item.icon className="h-5 w-5 shrink-0" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>Coming soon</p>
                          </TooltipContent>
                        </Tooltip>
                      )
                    }
                    
                    return (
                      <Tooltip key={item.name}>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            onClick={onMobileClose}
                            onMouseEnter={() => handlePrefetch(item.href)}
                            onFocus={() => handlePrefetch(item.href)}
                            className={cn(linkClasses, "justify-center")}
                            aria-current={active ? "page" : undefined}
                          >
                            <item.icon className="h-5 w-5 shrink-0" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  }
                  
                  // Expanded view
                  if (isComingSoon) {
                    return (
                      <div
                        key={item.name}
                        className={cn(
                          linkClasses,
                          "cursor-not-allowed opacity-50"
                        )}
                        aria-disabled="true"
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className="flex-1">{item.name}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">Soon</Badge>
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onMobileClose}
                      onMouseEnter={() => handlePrefetch(item.href)}
                      onFocus={() => handlePrefetch(item.href)}
                      className={linkClasses}
                      aria-current={active ? "page" : undefined}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
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
                    </Link>
                  )
                })}
              </div>
            </nav>
          </div>

          <div className="border-t">
            <div className="p-2">
              {/* On mobile, always show expanded button. On desktop, respect collapsed state */}
              {collapsed && !mobileOpen ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="group flex items-center justify-center gap-2.5 rounded-md px-3 py-1.5 text-sm font-normal transition-colors text-muted-foreground hover:bg-muted hover:text-foreground w-full"
                      onClick={() => {
                        window.dispatchEvent(new Event('openFeedbackDialog'))
                      }}
                      aria-label="Give feedback"
                    >
                      <HelpCircle className="h-5 w-5 shrink-0" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Give feedback</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <button
                  className="group flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm font-normal transition-colors text-muted-foreground hover:bg-muted hover:text-foreground w-full"
                  onClick={() => {
                    window.dispatchEvent(new Event('openFeedbackDialog'))
                  }}
                >
                  <HelpCircle className="h-5 w-5 shrink-0" />
                  <span className="flex-1 text-left">Give feedback</span>
                </button>
              )}
            </div>
            <div className="p-2 hidden lg:block">
              <button
                onClick={toggleCollapsed}
                className="group flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm font-normal transition-colors text-muted-foreground hover:bg-muted hover:text-foreground w-full"
                aria-pressed={collapsed}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <ChevronLeft className={cn("h-5 w-5 shrink-0 transition-transform", collapsed && "rotate-180")} />
                {!collapsed && <span className="flex-1 text-left">Collapse</span>}
              </button>
            </div>
          </div>
        </div>
      </aside>
      </>
    </TooltipProvider>
  )
}
