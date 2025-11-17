"use client"

import { FormEvent, useId, useMemo, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ShieldCheck,
  History,
  Download,
  ExternalLink,
  Activity,
  BellRing,
  EyeOff,
  MapPin,
  ArrowUpDown,
  Info,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  LogOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AnimatedSwitch } from "@/components/animated-switch"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { showSuccessToast } from "@/lib/toast-utils"
import { trackPreferenceToggle } from "@/lib/analytics/events"
import { MaskedInput, maskEmail, maskPhone } from "@/components/ui/masked-input"

type SessionStatus = "Active" | "Signed out"
type StatusFilter = "all" | SessionStatus
type SortKey = "recent" | "device" | "status"
type SortDirection = "asc" | "desc"

const loginHistorySeed: Array<{
  id: string
  device: string
  location: string
  ip: string
  timeLabel: string
  timestamp: number
  status: SessionStatus
}> = [
  {
    id: "macbook-pro",
    device: "MacBook Pro · Safari",
    location: "New York, USA",
    ip: "198.51.100.48",
    timeLabel: "2 minutes ago",
    timestamp: new Date("2024-04-15T14:10:00Z").getTime(),
    status: "Active",
  },
  {
    id: "iphone-15",
    device: "iPhone 15 · Fin-Infra app",
    location: "Brooklyn, USA",
    ip: "198.51.100.124",
    timeLabel: "3 hours ago",
    timestamp: new Date("2024-04-15T11:12:00Z").getTime(),
    status: "Active",
  },
  {
    id: "windows-edge",
    device: "Windows · Edge",
    location: "Philadelphia, USA",
    ip: "198.51.100.212",
    timeLabel: "Yesterday · 21:14",
    timestamp: new Date("2024-04-14T21:14:00Z").getTime(),
    status: "Signed out",
  },
  {
    id: "ipad-safari",
    device: "iPad · Safari",
    location: "Boston, USA",
    ip: "198.51.100.87",
    timeLabel: "Apr 12 · 08:02",
    timestamp: new Date("2024-04-12T08:02:00Z").getTime(),
    status: "Signed out",
  },
]

const statusRank: Record<SessionStatus, number> = {
  Active: 0,
  "Signed out": 1,
}

const AUDIT_LOG_ESTIMATE_MB = 42

type HeroLevel = "strong" | "caution" | "critical"

const HERO_BACKGROUNDS: Record<HeroLevel, { base: string; overlay: string }> = {
  strong: {
    base:
      "linear-gradient(140deg, rgba(37, 99, 235, 0.45), rgba(76, 29, 149, 0.65)), var(--surface-security)",
    overlay:
      "radial-gradient(circle at top right, rgba(255, 255, 255, 0.22), transparent 55%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.35), transparent 60%)",
  },
  caution: {
    base: "linear-gradient(140deg, rgba(217, 119, 6, 0.82), rgba(245, 158, 11, 0.78))",
    overlay:
      "radial-gradient(circle at top right, rgba(255, 247, 237, 0.52), transparent 55%), radial-gradient(circle at 15% 85%, rgba(250, 204, 21, 0.32), transparent 60%)",
  },
  critical: {
    base: "linear-gradient(140deg, rgba(220, 38, 38, 0.88), rgba(127, 29, 29, 0.9))",
    overlay:
      "radial-gradient(circle at top right, rgba(255, 255, 255, 0.32), transparent 55%), radial-gradient(circle at 18% 82%, rgba(248, 113, 113, 0.4), transparent 65%)",
  },
}

type HighlightIntent = "neutral" | "positive" | "attention"

// Helper function to get device icon based on device string
const getDeviceIcon = (deviceStr: string) => {
  const lower = deviceStr.toLowerCase()
  if (lower.includes('iphone') || lower.includes('android') || lower.includes('mobile')) {
    return Smartphone
  }
  if (lower.includes('ipad') || lower.includes('tablet')) {
    return Tablet
  }
  if (lower.includes('macbook') || lower.includes('laptop')) {
    return Laptop
  }
  return Monitor // desktop/unknown
}

export default function SecurityCenterPage() {
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [maskSensitive, setMaskSensitive] = useState(true)
  const [deviceQuery, setDeviceQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sortKey, setSortKey] = useState<SortKey>("recent")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [alternateEmail, setAlternateEmail] = useState("security.backup@mail.com")
  const [alternatePhone, setAlternatePhone] = useState("+1 (917) 555-0199")
  const [sessions, setSessions] = useState(loginHistorySeed)
  const [isAuditDialogOpen, setIsAuditDialogOpen] = useState(false)
  const [isAuditScheduling, setIsAuditScheduling] = useState(false)
  const [sessionToEnd, setSessionToEnd] = useState<string | null>(null)
  const [confirmEndAll, setConfirmEndAll] = useState(false)
  const [showBackupPhone, setShowBackupPhone] = useState(false)
  const [phoneRevealTimer, setPhoneRevealTimer] = useState<number | null>(null)
  const [editEmailDialogOpen, setEditEmailDialogOpen] = useState(false)
  const [editPhoneDialogOpen, setEditPhoneDialogOpen] = useState(false)
  const [tempEmail, setTempEmail] = useState("")
  const [tempPhone, setTempPhone] = useState("")
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf" | null>(null)

  const loginAlertsLabelId = useId()
  const loginAlertsDescriptionId = useId()
  const maskSensitiveLabelId = useId()
  const maskSensitiveDescriptionId = useId()

  const currentSessionId = loginHistorySeed[0]?.id ?? null

  const filteredSessions = useMemo(() => {
    const direction = sortDirection === "asc" ? 1 : -1

    return [...sessions]
      .filter((session) => {
        const matchesDevice = session.device.toLowerCase().includes(deviceQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || session.status === statusFilter
        return matchesDevice && matchesStatus
      })
      .sort((a, b) => {
        switch (sortKey) {
          case "device":
            return a.device.localeCompare(b.device) * direction
          case "status":
            return (statusRank[a.status] - statusRank[b.status]) * direction
          default:
            return (a.timestamp - b.timestamp) * direction
        }
      })
  }, [deviceQuery, sessions, sortDirection, sortKey, statusFilter])

  const hasOtherActiveSessions = useMemo(() => {
    return sessions.some((session) => session.status === "Active" && session.id !== currentSessionId)
  }, [currentSessionId, sessions])

  const activeSessions = sessions.filter((session) => session.status === "Active").length
  const signedOutSessions = sessions.length - activeSessions

  const heroInsight = useMemo(() => {
    if (!loginAlerts) {
      return {
        level: "critical" as const,
        badge: "Action required",
        headline: "Turn login alerts back on",
        description:
          "Alerts are paused, so suspicious sign-ins may go unnoticed. Enable them to regain real-time coverage.",
      }
    }

    if (!maskSensitive) {
      return {
        level: "caution" as const,
        badge: "Security watch",
        headline: "Mask sensitive identifiers to reduce exposure",
        description:
          "Masked identifiers hide PII in exports and notifications. Toggle the control below to automatically redact data.",
      }
    }

    if (hasOtherActiveSessions) {
      return {
        level: "caution" as const,
        badge: "Review activity",
        headline: "End sessions you don’t recognize",
        description:
          "You have activity on other devices. Revoke access or download the audit log for more detail in seconds.",
      }
    }

    return {
      level: "strong" as const,
      badge: "Security Center",
      headline: "Account defenses look strong",
      description:
        "Alerts are active and identifiers are masked. Continue monitoring sessions and exports right from this hub.",
    }
  }, [hasOtherActiveSessions, loginAlerts, maskSensitive])

  const heroHighlights = useMemo(
    () =>
      [
        {
          label: `${activeSessions} active session${activeSessions === 1 ? "" : "s"}`,
          intent: hasOtherActiveSessions ? (activeSessions > 1 ? "attention" : "neutral") : "neutral",
        },
        signedOutSessions > 0
          ? {
              label: `${signedOutSessions} signed out recently`,
              intent: "neutral" as HighlightIntent,
            }
          : null,
        {
          label: loginAlerts ? "Login alerts enabled" : "Login alerts paused",
          intent: loginAlerts ? "positive" : "attention",
        },
        {
          label: maskSensitive ? "Masking on exports" : "Masking disabled",
          intent: maskSensitive ? "positive" : "attention",
        },
      ].filter(Boolean) as Array<{ label: string; intent: HighlightIntent }>,
    [activeSessions, hasOtherActiveSessions, loginAlerts, maskSensitive, signedOutSessions],
  )

  const heroBackground = HERO_BACKGROUNDS[heroInsight.level]

  const handleAlertingSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    toast("Alerting preferences updated", {
      description: "We\u2019ll use your alternate contacts if we can\u2019t reach your primary inbox.",
    })
  }

  const handleExportRequest = (format: "csv" | "pdf") => {
    setExportFormat(format)
  }

  const handleConfirmExport = () => {
    if (!exportFormat) return

    toast(`Preparing ${exportFormat.toUpperCase()} export`, {
      description: "We'll send an in-app notification as soon as your encrypted file is ready. Download link expires in 24 hours.",
    })
    setExportFormat(null)
  }

  const handleEndSessionRequest = (sessionId: string) => {
    setSessionToEnd(sessionId)
  }

  const handleConfirmEndSession = () => {
    if (!sessionToEnd) return
    
    handleEndSession(sessionToEnd)
    setSessionToEnd(null)
  }

  const handleEndSession = (sessionId: string) => {
    setSessions((previous) =>
      previous.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              status: "Signed out",
              timeLabel: "Just now",
              timestamp: Date.now(),
            }
          : session,
      ),
    )

    const endedSession = sessions.find((session) => session.id === sessionId)
    toast("Session ended", {
      description:
        endedSession?.device
          ? `${endedSession.device} was signed out remotely. We’ll alert you if it attempts to reconnect.`
          : "The session was signed out remotely. We’ll alert you if it attempts to reconnect.",
    })
  }

  const handleEndAllOtherSessions = () => {
    setConfirmEndAll(false)
    
    setSessions((previous) =>
      previous.map((session) =>
        session.id === currentSessionId
          ? session
          : {
              ...session,
              status: "Signed out",
              timeLabel: "Just now",
              timestamp: Date.now(),
            },
      ),
    )

    toast("Signed out of other devices", {
      description: "All other active sessions were ended. Keep an eye on your alerts for any new sign-ins.",
    })
  }

  const handleRevealPhone = () => {
    setShowBackupPhone(true)
    const timer = 30 // 30 seconds
    setPhoneRevealTimer(timer)
    
    const interval = setInterval(() => {
      setPhoneRevealTimer((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          setShowBackupPhone(false)
          setPhoneRevealTimer(null)
          return null
        }
        return prev - 1
      })
    }, 1000)
    
    toast("Phone number revealed temporarily", {
      description: "Number will be re-hidden after 30 seconds for security.",
    })
  }

  const handleAuditConfirm = () => {
    setIsAuditScheduling(true)
    globalThis.setTimeout(() => {
      toast("Audit log export scheduled", {
        description: `We’ll email an encrypted link to ${alternateEmail} and notify you in TradeHub when it’s ready.`,
      })
      setIsAuditScheduling(false)
      setIsAuditDialogOpen(false)
    }, 900)
  }

  return (
    <>
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-foreground">Security Center</h1>
              <p className="text-sm text-muted-foreground">{heroInsight.headline}</p>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="mx-auto w-full max-w-[1200px] space-y-8 px-4 sm:px-6 lg:px-10 py-6"
      >
      <section
        className="relative overflow-hidden rounded-3xl shadow-[var(--shadow-bold)]"
        style={{ backgroundImage: heroBackground.base }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{ backgroundImage: heroBackground.overlay }}
          aria-hidden
        />
        <div className="relative px-6 py-6 sm:px-12 sm:py-10">
          <div className="relative z-10 space-y-4 sm:space-y-6">
            <Badge variant="secondary" className="border-0 bg-white/30 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
              {heroInsight.badge}
            </Badge>
            <div className="max-w-2xl space-y-2 sm:space-y-3">
              <h1 className="text-2xl font-bold tracking-tight sm:text-4xl text-white drop-shadow-sm">{heroInsight.headline}</h1>
              <p className="text-sm sm:text-base text-white drop-shadow-sm leading-relaxed">{heroInsight.description}</p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-medium">
              {heroHighlights.map((highlight) => {
                const toneClass =
                  highlight.intent === "positive"
                    ? "bg-emerald-300/25 text-white"
                    : highlight.intent === "attention"
                      ? heroInsight.level === "critical"
                        ? "bg-red-300/30 text-white"
                        : "bg-amber-200/30 text-amber-900"
                      : "bg-white/15 text-white/90"

                return (
                  <span key={highlight.label} className={`rounded-full px-3 py-1 ${toneClass}`}>
                    {highlight.label}
                  </span>
                )
              })}
            </div>
            <div className="flex flex-wrap gap-3">
              <Dialog open={isAuditDialogOpen} onOpenChange={setIsAuditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="cta" size="sm" className="rounded-full px-5">
                    <History className="h-4 w-4" />
                    Download full audit log
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Download full audit log</DialogTitle>
                    <DialogDescription>
                      Export every authentication event from the last 12 months. Estimated file size: ~{AUDIT_LOG_ESTIMATE_MB} MB.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p>
                      Files larger than 25 MB are delivered via encrypted email to
                      <span className="font-medium text-foreground"> {maskEmail(alternateEmail)}</span>. We’ll also send an in-app
                      notification when the link is ready.
                    </p>
                    <p>The download link remains active for 24 hours and can be forwarded to your compliance partner.</p>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="ghost">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleAuditConfirm} disabled={isAuditScheduling} className="gap-2">
                      <Download className="h-4 w-4" />
                      {isAuditScheduling ? "Scheduling…" : "Confirm export"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Link href="/settings">
                  <ExternalLink className="h-4 w-4" /> Back to settings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-6">
        <Card className="card-standard gap-y-0">
          <CardHeader className="border-b border-border/30">
            <CardTitle className="flex flex-wrap items-center gap-2 text-base font-semibold">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Active Sessions
            </CardTitle>
            <CardDescription>
              Active sessions represent devices and browsers currently signed into your account. Each session maintains its own security token. 
              If you notice unfamiliar devices or locations, revoke access immediately to protect your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 pb-4 pt-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex w-full flex-col gap-2 sm:max-w-xs">
                <Label htmlFor="device-filter" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Filter by device
                </Label>
                <Input
                  id="device-filter"
                  placeholder="Search device or browser"
                  value={deviceQuery}
                  onChange={(event) => setDeviceQuery(event.target.value)}
                  className="h-9"
                />
              </div>
              <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="status-filter" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Status
                  </Label>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                    <SelectTrigger
                      id="status-filter"
                      size="sm"
                      className="min-w-[160px]"
                      aria-label={
                        statusFilter === "all"
                          ? "Showing all statuses"
                          : `Showing only ${statusFilter.toLowerCase()} sessions`
                      }
                    >
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Signed out">Signed out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="sort-by" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Sort
                  </Label>
                  <div className="flex items-center gap-2">
                    <Select value={sortKey} onValueChange={(value) => setSortKey(value as SortKey)}>
                      <SelectTrigger
                        id="sort-by"
                        size="sm"
                        className="min-w-[160px]"
                        aria-label={`Sorting by ${
                          sortKey === "recent" ? "most recent" : sortKey === "device" ? "device" : "status"
                        }`}
                      >
                        <SelectValue placeholder="Most recent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most recent</SelectItem>
                        <SelectItem value="device">Device name</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
                    >
                      <ArrowUpDown className="h-4 w-4" />
                      <span className="sr-only">Toggle sort direction</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <TooltipProvider delayDuration={100}>
              <div className="divide-y divide-border/30" role="table" aria-label="Recent login history">
                <div className="hidden py-3 text-xs uppercase tracking-wide text-muted-foreground md:grid md:grid-cols-[2fr_1.5fr_1fr_auto_auto] md:gap-4">
                  <span>Device</span>
                  <span>Location</span>
                  <span>Time</span>
                  <span className="text-center">Status</span>
                  <span className="text-right">Action</span>
                </div>
                {filteredSessions.length === 0 ? (
                  <div className="py-8 text-sm text-muted-foreground" role="row">
                    {sessions.length === 0
                      ? "All clear — we’ll show new sign-ins here once they occur."
                      : "No sessions match your filters. Adjust filters to review more activity."}
                  </div>
                ) : (
                  filteredSessions.map((entry) => {
                    const DeviceIcon = getDeviceIcon(entry.device)
                    return (
                    <div
                      key={entry.id}
                      role="row"
                      className="grid gap-4 py-4 md:grid-cols-[2fr_1.5fr_1fr_auto_auto] md:items-center"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <DeviceIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">{entry.device}</p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            {entry.timeLabel} • {entry.status}
                          </p>
                          <p className="text-xs text-muted-foreground md:hidden">{entry.location}</p>
                        </div>
                      </div>
                      <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1.5 text-left">
                              <MapPin className="h-4 w-4 text-primary" aria-hidden />
                              <span>{entry.location}</span>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            Last known IP: {entry.ip.replace(/(\.\d+)$/, ".xxx")} (masked)
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="hidden text-sm text-muted-foreground md:block">{entry.timeLabel}</p>
                      <div className="hidden md:flex md:justify-center">
                        <Badge
                          variant="secondary"
                          className={
                            entry.status === "Active"
                              ? "bg-emerald-500/15 text-emerald-600"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {entry.status}
                        </Badge>
                      </div>
                      <div className="hidden md:flex md:justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => handleEndSessionRequest(entry.id)}
                          disabled={entry.status !== "Active"}
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Revoke
                          <span className="sr-only"> session for {entry.device}</span>
                        </Button>
                      </div>
                      <div className="flex items-center justify-between gap-2 md:hidden">
                        <Badge
                          variant="secondary"
                          className={
                            entry.status === "Active"
                              ? "bg-emerald-500/15 text-emerald-600"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {entry.status}
                        </Badge>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => handleEndSessionRequest(entry.id)}
                          disabled={entry.status !== "Active"}
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Revoke
                          <span className="sr-only"> session for {entry.device}</span>
                        </Button>
                      </div>
                    </div>
                    )
                  })
                )}
              </div>
            </TooltipProvider>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 items-start">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setConfirmEndAll(true)}
              disabled={!hasOtherActiveSessions}
            >
              <Activity className="h-4 w-4" /> End all other sessions
            </Button>
            <p className="text-xs text-muted-foreground">
              Need to revoke a device? Visit <span className="font-medium text-foreground">Settings → Security</span> to manage sessions.
            </p>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="card-standard">
            <form onSubmit={handleAlertingSubmit} className="flex h-full flex-col">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Alerting</CardTitle>
                <CardDescription>Stay informed when suspicious activity occurs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <TooltipProvider delayDuration={100}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p id={loginAlertsLabelId} className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <BellRing className="h-4 w-4 text-primary" />
                        <span>Login alerts</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="rounded-full border border-transparent p-1 text-muted-foreground transition-colors hover:border-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                              <Info aria-hidden className="h-3.5 w-3.5" />
                              <span className="sr-only">Learn about login alerts</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-xs leading-relaxed">
                            We’ll alert you when a new device, unusual location, or blocked attempt hits your account.
                          </TooltipContent>
                        </Tooltip>
                      </p>
                      <p id={loginAlertsDescriptionId} className="text-xs text-muted-foreground">
                        Email and push notifications for new device sign-ins.
                      </p>
                    </div>
                    <AnimatedSwitch
                      aria-labelledby={loginAlertsLabelId}
                      aria-describedby={loginAlertsDescriptionId}
                      checked={loginAlerts}
                      onCheckedChange={(value) => {
                        setLoginAlerts(value)
                        trackPreferenceToggle({
                          preferenceId: "login-alerts",
                          label: "Login alerts",
                          section: "security",
                          value,
                        })
                        toast(value ? "Login alerts enabled" : "Login alerts disabled", {
                          description: value
                            ? "You'll receive notifications for new device sign-ins."
                            : "You won't receive notifications for new sign-ins. Consider re-enabling for better security.",
                        })
                      }}
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p id={maskSensitiveLabelId} className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <EyeOff className="h-4 w-4 text-primary" />
                        <span>Mask sensitive data</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="rounded-full border border-transparent p-1 text-muted-foreground transition-colors hover:border-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                              <Info aria-hidden className="h-3.5 w-3.5" />
                              <span className="sr-only">Learn about masking</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-xs leading-relaxed">
                            Hide account numbers and identifiers until you tap reveal. We’ll re-mask automatically after inactivity.
                          </TooltipContent>
                        </Tooltip>
                      </p>
                      <p id={maskSensitiveDescriptionId} className="text-xs text-muted-foreground">
                        Require reveal tap for account numbers and personally identifiable data.
                      </p>
                    </div>
                    <AnimatedSwitch
                      aria-labelledby={maskSensitiveLabelId}
                      aria-describedby={maskSensitiveDescriptionId}
                      checked={maskSensitive}
                      onCheckedChange={(value) => {
                        setMaskSensitive(value)
                        trackPreferenceToggle({
                          preferenceId: "mask-sensitive",
                          label: "Mask sensitive data",
                          section: "security",
                          value,
                        })
                        toast(value ? "Masking enabled" : "Masking disabled", {
                          description: value
                            ? "Sensitive identifiers will be masked in exports and notifications."
                            : "Sensitive data will be visible. Consider re-enabling for privacy protection.",
                        })
                      }}
                    />
                  </div>
                  
                  {/* Masked Data Preview */}
                  <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                      Preview: {maskSensitive ? "Masked" : "Unmasked"} Data
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Account Number:</span>
                        <span className="font-mono">{maskSensitive ? "****-****-0199" : "9876-5432-0199"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Phone Number:</span>
                        <span className="font-mono">{maskSensitive ? "****-0199" : "+1 (917) 555-0199"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-mono text-xs">{maskSensitive ? "s***@mail.com" : "security@mail.com"}</span>
                      </div>
                    </div>
                  </div>
                </TooltipProvider>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="alternate-email">Alternate email</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="alternate-email"
                        type="text"
                        value={maskEmail(alternateEmail)}
                        disabled
                        className="flex-1"
                        aria-describedby="alternate-email-help"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTempEmail(alternateEmail)
                          setEditEmailDialogOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                    <p id="alternate-email-help" className="text-xs text-muted-foreground">
                      Used when we can't reach your primary inbox. We'll mask this address in notifications.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alternate-phone">Backup phone</Label>
                    {!showBackupPhone ? (
                      <div className="flex items-center gap-2">
                        <Input
                          id="alternate-phone"
                          type="text"
                          value={`••••${alternatePhone.slice(-4)}`}
                          disabled
                          className="flex-1"
                          aria-describedby="alternate-phone-help"
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleRevealPhone}
                              >
                                <EyeOff className="h-4 w-4" />
                                <span className="sr-only">Reveal phone number</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Temporarily reveal phone number</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            id="alternate-phone"
                            type="text"
                            value={maskPhone(alternatePhone)}
                            disabled
                            className="flex-1"
                            aria-describedby="alternate-phone-help"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setTempPhone(alternatePhone)
                              setEditPhoneDialogOpen(true)
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    )}
                    <p id="alternate-phone-help" className="text-xs text-muted-foreground">
                      SMS alerts are only sent for high-risk events. {!showBackupPhone && `We display your number as ••••${alternatePhone.slice(-4)}.`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </form>
          </Card>

          <Card className="card-standard">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Exports & backups</CardTitle>
              <CardDescription>Generate encrypted exports for compliance or record keeping.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Access Logs
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto justify-start gap-2"
                  onClick={() => handleExportRequest("csv")}
                >
                  <Download className="h-4 w-4" /> Export access log (CSV)
                </Button>
                <p className="text-xs text-muted-foreground">
                  Download a complete CSV file of all login activity, including timestamps, devices, and locations.
                </p>
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Security Reports
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto justify-start gap-2"
                  onClick={() => handleExportRequest("pdf")}
                >
                  <Download className="h-4 w-4" /> Download masking report (PDF)
                </Button>
                <p className="text-xs text-muted-foreground">
                  Generate a PDF summary of data masking settings and privacy configurations.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2">
              <div className="flex items-start gap-2 rounded-md bg-amber-500/10 border border-amber-500/20 p-3 w-full">
                <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-amber-900 dark:text-amber-100">
                    Sensitive data export
                  </p>
                  <p className="text-xs text-amber-800 dark:text-amber-200/90">
                    Export links expire after 24 hours for security. Files are encrypted and can only be accessed once.
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                For enterprise SSO controls, contact <Link className="underline" href="mailto:security@fin-infra.com">security@fin-infra.com</Link>.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      </motion.div>

      {/* Confirmation dialog for ending individual session */}
      <ConfirmDialog
        open={sessionToEnd !== null}
        onOpenChange={(open) => !open && setSessionToEnd(null)}
        title="End this session?"
        description={
          sessionToEnd
            ? `Device: ${sessions.find((s) => s.id === sessionToEnd)?.device}\nLocation: ${sessions.find((s) => s.id === sessionToEnd)?.location}\n\nThis device will be signed out immediately and must re-authenticate to access your account.`
            : ""
        }
        confirmLabel="End session"
        confirmVariant="destructive"
        onConfirm={handleConfirmEndSession}
      />

      {/* Confirmation dialog for ending all other sessions */}
      <ConfirmDialog
        open={confirmEndAll}
        onOpenChange={setConfirmEndAll}
        title="End all other sessions?"
        description={`This will sign out ${sessions.filter((s) => s.status === "Active" && s.id !== currentSessionId).length} active session(s) on other devices. They will need to re-authenticate to access your account.`}
        confirmLabel="End all sessions"
        confirmVariant="destructive"
        onConfirm={handleEndAllOtherSessions}
      />

      {/* Edit alternate email dialog */}
      <Dialog open={editEmailDialogOpen} onOpenChange={setEditEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Alternate Email</DialogTitle>
            <DialogDescription>
              Update your alternate email address for security notifications.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email address</Label>
              <Input
                id="edit-email"
                type="email"
                autoComplete="email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                placeholder="alternate@example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditEmailDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setAlternateEmail(tempEmail)
                setEditEmailDialogOpen(false)
                showSuccessToast("Alternate email updated")
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit backup phone dialog */}
      <Dialog open={editPhoneDialogOpen} onOpenChange={setEditPhoneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Backup Phone</DialogTitle>
            <DialogDescription>
              Update your backup phone number for SMS security alerts.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone number</Label>
              <Input
                id="edit-phone"
                type="tel"
                autoComplete="tel"
                value={tempPhone}
                onChange={(e) => setTempPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditPhoneDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setAlternatePhone(tempPhone)
                setEditPhoneDialogOpen(false)
                showSuccessToast("Backup phone updated")
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog for exports */}
      <ConfirmDialog
        open={exportFormat !== null}
        onOpenChange={(open) => !open && setExportFormat(null)}
        title={`Export ${exportFormat === "csv" ? "access log" : "masking report"}?`}
        description={
          exportFormat === "csv"
            ? "This will generate a CSV file containing all login activity with timestamps, devices, locations, and IP addresses. The download link will expire after 24 hours and can only be accessed once."
            : "This will generate a PDF report of your data masking settings and privacy configurations. The download link will expire after 24 hours and can only be accessed once."
        }
        confirmLabel={`Export ${exportFormat?.toUpperCase()}`}
        confirmVariant="default"
        onConfirm={handleConfirmExport}
      />
    </>
  )
}
