"use client"

import { Bell, Search, Calendar, Menu, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor, UserCircle, SettingsIcon, CreditCard, LogOut, SlidersHorizontal } from "lucide-react"
import { useMaskToggleDetails } from "@/components/privacy-provider"
import { CommandMenu } from "@/components/command-menu"
import { useEffect, useState } from "react"
import { useDateRange } from "@/components/date-range-provider"
// Brand title lives in the Sidebar header now; TopBar is embedded inside the content area.
import { useWorkspace } from "@/components/workspace-provider"
import { NotificationCenter } from "@/components/notification-center"
import { useDensity } from "@/app/providers/density-provider"

import { cn } from "@/lib/utils"

export function TopBar({ 
  onMenuClick, 
  sidebarCollapsed: _sidebarCollapsed,
}: { 
  onMenuClick?: () => void; 
  sidebarCollapsed?: boolean;
}) {
  const { setTheme, theme } = useTheme()
  const { masked, toggleMasked, label: maskLabel, Icon: MaskIcon } = useMaskToggleDetails()
  const { dateRange, setDateRange } = useDateRange()
  const [mounted, setMounted] = useState(false)
  const [commandMenuOpen, setCommandMenuOpen] = useState(false)
  const { activeWorkspace, workspaces, selectWorkspace, unreadCount, activeMember } = useWorkspace()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { density, setDensity } = useDensity()

  const isDateRangeValue = (value: string): value is typeof dateRange => {
    return ["1D", "5D", "1M", "6M", "YTD", "1Y", "ALL"].includes(value)
  }

  const handleDateRangeChange = (value: string) => {
    if (isDateRangeValue(value)) {
      setDateRange(value)
    }
  }

  const handleDensityChange = (value: string) => {
    if (value === "comfortable" || value === "compact") {
      setDensity(value)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className={cn(
        // Mobile: sticky top bar that stays with scroll
        "sticky md:fixed top-0 z-40 backdrop-blur-md transition-all duration-300 ease-in-out",
        // Mobile: full width
        "left-0 w-auto",
        // Desktop: shift right based on sidebar state
        _sidebarCollapsed ? "md:left-16" : "md:left-64",
        "right-0",
        // Background with glass effect
        "bg-background/80",
      )}
    >
      {/* Inner container: constrain width and center horizontally to match page content width */}
      <div className={cn(
        "mx-auto flex w-full max-w-[1200px] items-center justify-between gap-2 transition-all duration-300 sm:gap-3",
        // Compact height on mobile for space efficiency
        "h-11 md:h-12 lg:h-14",
        // Padding - no left padding on mobile/tablet for burger, right padding always, desktop padding
        "pr-3 sm:pr-4 lg:px-10",
      )}>
        {/* Left section: Menu + Search */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Mobile hamburger menu */}
          <div className="lg:hidden shrink-0">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMenuClick} 
              aria-label="Open menu"
              className="h-8 w-8"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Search bar - adaptive width */}
          <div className="flex-1 min-w-0 max-w-md">
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-muted-foreground hover:text-foreground transition-all",
                "h-8 md:h-9 text-xs md:text-sm",
                // More compact on mobile
                "px-2 md:px-3",
              )}
              onClick={() => setCommandMenuOpen(true)}
            >
              <Search className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
              <span className="ml-1.5 md:ml-2 truncate">Search…</span>
              <kbd className="ml-auto hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>
        </div>

        {/* Right section: Actions + Profile - Progressive disclosure on mobile */}
        <div className="flex items-center gap-0.5 md:gap-1 shrink-0">
          {/* Workspace badge - desktop only */}
          <Badge variant="secondary" className="hidden xl:flex items-center gap-1 rounded-full px-2 py-0.5">
            <Building2 className="h-3 w-3" />
            <span className="text-[10px] font-medium">{activeWorkspace.name}</span>
          </Badge>

          {/* Privacy toggle - tablet+ */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-pressed={!masked}
                  aria-label={maskLabel}
                  onClick={toggleMasked}
                  className="hidden md:flex h-8 w-8"
                >
                  <MaskIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">{masked ? "Amounts hidden" : "Amounts visible"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Date range selector - tablet+ */}
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger 
              className="w-[6.5rem] md:w-28 lg:w-32 rounded-full hidden md:flex h-8 text-xs" 
              title={`Date range: ${dateRange}`}
            >
              <Calendar className="mr-1.5 h-3.5 w-3.5 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1D">1 Day</SelectItem>
              <SelectItem value="5D">5 Days</SelectItem>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="YTD">YTD</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
              <SelectItem value="ALL">All Time</SelectItem>
            </SelectContent>
          </Select>

          {/* Notifications - always visible */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8"
            aria-label={unreadCount ? `${unreadCount} unread notifications` : "Notifications"}
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 px-0.5 text-[10px] bg-primary text-primary-foreground border-2 border-background">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>

          {/* User profile dropdown - always visible */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open account menu" className="h-8 w-8">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={undefined} alt={activeMember.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                    {activeMember.avatarFallback}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium truncate">{activeMember.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{activeMember.email}</p>
                </div>
              </DropdownMenuLabel>
              <div className="px-2 pb-2">
                <div className="inline-flex rounded-md bg-muted p-0.5" role="group" aria-label="Theme selection">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={cn(
                      "inline-flex items-center justify-center rounded px-2.5 py-1.5 text-sm font-medium transition-all duration-200",
                      mounted && theme === "light"
                        ? "bg-background text-foreground shadow-sm scale-105"
                        : "text-muted-foreground hover:text-foreground hover:scale-105"
                    )}
                    aria-pressed={mounted && theme === "light"}
                    aria-label="Light theme"
                  >
                    <Sun className="h-3.5 w-3.5 transition-transform duration-200" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "inline-flex items-center justify-center rounded px-2.5 py-1.5 text-sm font-medium transition-all duration-200",
                      mounted && theme === "dark"
                        ? "bg-background text-foreground shadow-sm scale-105"
                        : "text-muted-foreground hover:text-foreground hover:scale-105"
                    )}
                    aria-pressed={mounted && theme === "dark"}
                    aria-label="Dark theme"
                  >
                    <Moon className="h-3.5 w-3.5 transition-transform duration-200" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("system")}
                    className={cn(
                      "inline-flex items-center justify-center rounded px-2.5 py-1.5 text-sm font-medium transition-all duration-200",
                      mounted && theme === "system"
                        ? "bg-background text-foreground shadow-sm scale-105"
                        : "text-muted-foreground hover:text-foreground hover:scale-105"
                    )}
                    aria-pressed={mounted && theme === "system"}
                    aria-label="System theme"
                  >
                    <Monitor className="h-3.5 w-3.5 transition-transform duration-200" />
                  </button>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Density</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuRadioGroup value={density} onValueChange={handleDensityChange}>
                  <DropdownMenuRadioItem value="comfortable" className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                    Comfortable
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="compact" className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                    Compact
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Workspace</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuRadioGroup value={activeWorkspace.id} onValueChange={selectWorkspace}>
                  {workspaces.map((workspace) => (
                    <DropdownMenuRadioItem key={workspace.id} value={workspace.id} className="flex items-center gap-2">
                      <span className="text-sm font-medium">{workspace.name}</span>
                      <Badge variant="secondary" className="ml-auto rounded-full text-[10px] uppercase tracking-wide">
                        {workspace.role}
                      </Badge>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CommandMenu open={commandMenuOpen} onOpenChange={setCommandMenuOpen} />
      <NotificationCenter open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </div>
  )
}
