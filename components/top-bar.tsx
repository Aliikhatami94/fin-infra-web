"use client"

import { Bell, Search, Calendar, Menu, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Moon, Sun, Monitor, UserCircle, SettingsIcon, CreditCard, LogOut } from "lucide-react"
import { useMaskToggleDetails } from "@/components/privacy-provider"
import { CommandMenu } from "@/components/command-menu"
import { useEffect, useState } from "react"
import { useDateRange } from "@/components/date-range-provider"
// Brand title lives in the Sidebar header now; TopBar is embedded inside the content area.
import { useWorkspace } from "@/components/workspace-provider"
import { NotificationCenter } from "@/components/notification-center"

import { cn } from "@/lib/utils"

export function TopBar({ onMenuClick, sidebarCollapsed }: { onMenuClick?: () => void; sidebarCollapsed?: boolean }) {
  const { setTheme, theme } = useTheme()
  const { masked, toggleMasked, label: maskLabel, Icon: MaskIcon } = useMaskToggleDetails()
  const { dateRange, setDateRange } = useDateRange()
  const [mounted, setMounted] = useState(false)
  const [commandMenuOpen, setCommandMenuOpen] = useState(false)
  const { activeWorkspace, workspaces, selectWorkspace, unreadCount, activeMember } = useWorkspace()
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const isDateRangeValue = (value: string): value is typeof dateRange => {
    return ["1D", "5D", "1M", "6M", "YTD", "1Y", "ALL"].includes(value)
  }

  const handleDateRangeChange = (value: string) => {
    if (isDateRangeValue(value)) {
      setDateRange(value)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className={cn(
        // Fixed top bar that adapts to sidebar width on large screens
        "fixed top-0 right-0 z-40 bg-background transition-[left,width] duration-300",
        // Mobile/tablet: full width
        "left-0 w-auto",
        // Desktop: shift right based on sidebar state so it's visually centered with content
        sidebarCollapsed ? "lg:left-16" : "lg:left-64",
      )}
    >
      {/* Inner container: constrain width and center horizontally to match page content width */}
      <div className="mx-auto flex h-12 w-full max-w-[1200px] items-center justify-between px-4 md:h-14 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="lg:hidden">
            <Button variant="ghost" size="icon" onClick={onMenuClick} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          {/* Brand title and Live badge are shown in the Sidebar header */}
        </div>

        <div className="flex flex-1 items-center justify-center px-2 md:px-4 lg:px-8">
          <div className="relative w-full max-w-sm md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search or jump to page - Press Enter or ⌘K to open"
              placeholder="Search…"
              className="w-full pl-9 pr-4 text-sm"
              onFocus={() => {
                // Lightly encourage the command menu for global actions
                // Prevent virtual keyboard pop on mobile; keep as input for desktop
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  setCommandMenuOpen(true)
                }
                if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                  e.preventDefault()
                  setCommandMenuOpen(true)
                }
              }}
              onClick={() => {
                // Also open on click for better discoverability
                setCommandMenuOpen(true)
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <Badge variant="secondary" className="hidden lg:flex items-center gap-1 rounded-full">
            <Building2 className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{activeWorkspace.name}</span>
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-pressed={!masked}
                  aria-label={maskLabel}
                  onClick={toggleMasked}
                  className="hidden sm:flex"
                >
                  <MaskIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{masked ? "Amounts hidden" : "Amounts visible"}</p>
                <p className="text-xs text-muted-foreground">Click to {masked ? "show" : "hide"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[7.5rem] md:w-36 rounded-full hidden sm:flex" title={`Date range: ${dateRange}`}>
              <Calendar className="mr-2 h-4 w-4 shrink-0" />
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

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={unreadCount ? `${unreadCount} unread notifications` : "Notifications"}
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 px-1 text-xs bg-primary text-primary-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open account menu">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={undefined} alt={activeMember.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
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
                <Link href="/settings">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/billing">
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
