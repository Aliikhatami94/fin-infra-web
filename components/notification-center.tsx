"use client"

import { Fragment, useMemo, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Inbox, Bell, Mail, Smartphone } from "lucide-react"

import { useWorkspace } from "@/components/workspace-provider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NotificationCenterProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CHANNEL_ICONS = {
  "in-app": Bell,
  email: Mail,
  push: Smartphone,
} as const

export function NotificationCenter({ open, onOpenChange }: NotificationCenterProps) {
  const { workspaces, activeWorkspace, notifications, markNotificationRead, markChannelAsRead } = useWorkspace()
  const pathname = usePathname()

  // Auto-dismiss on navigation
  useEffect(() => {
    if (open) {
      onOpenChange(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const channelTabs = [
    { id: "all", label: "All" },
    { id: "in-app", label: "In-app" },
    { id: "email", label: "Email" },
    { id: "push", label: "Push" },
  ] as const

  const groupedNotifications = useMemo(() => {
    return workspaces.map((workspace) => ({
      workspace,
      items: notifications.filter((notification) => notification.workspaceId === workspace.id),
    }))
  }, [notifications, workspaces])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(95vw,42rem)] max-h-[85vh] h-[85vh] overflow-hidden p-0 sm:max-w-2xl">
        <div className="flex h-full min-h-0 flex-col">
          <DialogHeader className="px-4 py-3 border-b border-border/20 bg-card/80 backdrop-blur-sm">
            <DialogTitle className="flex items-center gap-2 text-left">
              <Inbox className="h-4 w-4 text-primary" />
              Notifications
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="all" className="flex min-h-0 flex-1 flex-col">
            <div className="px-4 py-2 border-b border-border/20 bg-muted/10">
              <TabsList className="grid grid-cols-4">
                {channelTabs.map((tab) => {
                  const unread =
                    tab.id === "all"
                      ? notifications.filter((notification) => notification.unread).length
                      : notifications.filter((notification) => notification.channel === tab.id && notification.unread).length
                  return (
                    <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                      {tab.label}
                      {unread > 0 && <Badge className="ml-1 h-5 min-w-5 px-1 text-xs">{unread}</Badge>}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>

            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 space-y-6">
                {channelTabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                    {groupedNotifications.map(({ workspace, items }) => {
                      const filteredItems =
                        tab.id === "all" ? items : items.filter((notification) => notification.channel === tab.id)
                      if (filteredItems.length === 0) {
                        return null
                      }

                      const ChannelIcon =
                        tab.id === "all" ? CHANNEL_ICONS[filteredItems[0].channel] : CHANNEL_ICONS[tab.id]

                      return (
                        <div key={`${tab.id}-${workspace.id}`} className="rounded-xl border border-border/40">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 bg-muted/20 px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Badge variant={workspace.id === activeWorkspace.id ? "default" : "secondary"} className="rounded-full">
                                {workspace.name}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{workspace.relationship}</span>
                            </div>
                            {tab.id !== "all" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => markChannelAsRead(tab.id, workspace.id)}
                              >
                                Mark {tab.label.toLowerCase()} read
                              </Button>
                            )}
                          </div>
                          <div className="divide-y divide-border/40">
                            {filteredItems.map((notification, index) => {
                              const Icon = ChannelIcon
                              return (
                                <Fragment key={notification.id}>
                                  <div className="flex gap-3 px-4 py-3">
                                    <div className="mt-1">
                                      <Icon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between gap-3">
                                        <div>
                                          <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                                          <p className="text-xs text-muted-foreground">{notification.description}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                                      </div>
                                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                        <Badge variant="outline" className="rounded-full border-dashed px-2">
                                          {notification.category}
                                        </Badge>
                                        <Badge variant={notification.unread ? "default" : "secondary"} className="rounded-full px-2">
                                          {notification.channel}
                                        </Badge>
                                        {notification.link && (
                                          <Button asChild variant="link" size="sm" className="h-auto px-0 text-xs">
                                            <Link href={notification.link}>Open</Link>
                                          </Button>
                                        )}
                                        {notification.unread && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 text-xs"
                                            onClick={() => markNotificationRead(notification.id)}
                                          >
                                            Mark read
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {index !== filteredItems.length - 1 && (
                                    <div className="border-t border-border/30" role="presentation" />
                                  )}
                                </Fragment>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}

                    {groupedNotifications.every(({ items }) => {
                      const filtered = tab.id === "all" ? items : items.filter((item) => item.channel === tab.id)
                      return filtered.length === 0
                    }) && (
                      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/40 bg-muted/10 py-10 text-center">
                        <Bell className="mb-2 h-6 w-6 text-muted-foreground" />
                        <p className="text-sm font-medium">You’re caught up</p>
                        <p className="text-xs text-muted-foreground">No {tab.label.toLowerCase()} alerts right now.</p>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </div>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
