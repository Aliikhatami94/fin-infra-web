"use client"

import { Bell, Search, Calendar, Menu, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun, UserCircle, SettingsIcon, CreditCard, LogOut } from "lucide-react"
import { useMaskToggleDetails } from "@/components/privacy-provider"
import { CommandMenu } from "@/components/command-menu"
import { useEffect, useState } from "react"
import { useDateRange } from "@/components/date-range-provider"
// Brand title lives in the Sidebar header now; TopBar is embedded inside the content area.
import { useWorkspace } from "@/components/workspace-provider"
import { NotificationCenter } from "@/components/notification-center"

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { setTheme, theme } = useTheme()
  const { masked, toggleMasked, label: maskLabel, Icon: MaskIcon } = useMaskToggleDetails()
  const { dateRange, setDateRange } = useDateRange()
  const [mounted, setMounted] = useState(false)
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
  <div className="fixed inset-x-0 mx-0 top-0 z-40 w-full bg-card">
      <div className="flex items-center justify-between px-4 md:px-6">
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
              aria-label="Search or jump"
              placeholder="Search…"
              className="w-full pl-9 pr-4 text-sm"
              onFocus={() => {
                // Lightly encourage the command menu for global actions
                // Prevent virtual keyboard pop on mobile; keep as input for desktop
              }}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                  e.preventDefault()
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <Badge variant="secondary" className="hidden lg:flex items-center gap-1 rounded-full">
            <Building2 className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{activeWorkspace.name}</span>
          </Badge>
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

          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-24 md:w-32 rounded-full hidden sm:flex">
              <Calendar className="mr-2 h-4 w-4" />
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
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>{activeMember.avatarFallback}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{activeMember.name}</p>
                  <p className="text-xs text-muted-foreground">{activeMember.email}</p>
                </div>
              </DropdownMenuLabel>
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
              <div className="flex items-center justify-between px-2 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <Sun className="h-4 w-4" />
                  <span>Theme</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={mounted && theme === "dark"}
                    onCheckedChange={toggleTheme}
                    aria-label="Toggle theme"
                  />
                  <Moon className="h-4 w-4" />
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CommandMenu />
      <NotificationCenter open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </div>
  )
}
