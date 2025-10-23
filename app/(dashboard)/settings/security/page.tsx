"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ShieldCheck, History, Download, ExternalLink, Activity, BellRing, EyeOff } from "lucide-react"

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
import { AnimatedSwitch } from "@/components/animated-switch"
import { trackPreferenceToggle } from "@/lib/analytics/events"

const loginHistorySeed = [
  { device: "MacBook Pro · Safari", location: "New York, USA", time: "2 minutes ago", status: "Active" },
  { device: "iPhone 15 · Fin-Infra app", location: "Brooklyn, USA", time: "3 hours ago", status: "Active" },
  { device: "Windows · Edge", location: "Philadelphia, USA", time: "Yesterday 21:14", status: "Signed out" },
  { device: "iPad · Safari", location: "Boston, USA", time: "Apr 12 · 08:02", status: "Signed out" },
]

export default function SecurityCenterPage() {
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [maskSensitive, setMaskSensitive] = useState(true)

  const loginHistory = useMemo(() => loginHistorySeed, [])

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-8">
      <section className="overflow-hidden rounded-3xl bg-[var(--surface-security)] text-white shadow-[var(--shadow-bold)]">
        <div className="relative px-8 py-10 sm:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)] opacity-80" aria-hidden />
          <div className="relative z-10 space-y-6">
            <Badge variant="secondary" className="bg-white/15 text-white">
              Security Center
            </Badge>
            <div className="space-y-3 max-w-2xl">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Stay in control of your account safety</h1>
              <p className="text-sm sm:text-base text-white/80">
                Review recent sessions, configure alerting, and download audit logs. Every action here is recorded for your records.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-medium text-white/90">
              <span className="rounded-full bg-white/20 px-3 py-1">End-to-end encryption</span>
              <span className="rounded-full bg-white/20 px-3 py-1">SOC 2 Type II controls</span>
              <span className="rounded-full bg-white/20 px-3 py-1">Masked identifiers</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="cta" size="sm" className="rounded-full px-5">
                <History className="h-4 w-4" />
                Download full audit log
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Link href="/settings">
                  <ExternalLink className="h-4 w-4" /> Back to settings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="border-border/40">
          <CardHeader className="border-b border-border/30">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Recent sessions
            </CardTitle>
            <CardDescription>End sessions you do not recognize. Locations are approximated from IP address.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="divide-y divide-border/30" role="table" aria-label="Recent login history">
              <div className="hidden px-6 py-3 text-xs uppercase tracking-wide text-muted-foreground sm:grid sm:grid-cols-[2fr_1.5fr_1fr_5rem]">
                <span>Device</span>
                <span>Location</span>
                <span>Time</span>
                <span className="text-center">Status</span>
              </div>
              {loginHistory.map((entry) => (
                <div
                  key={`${entry.device}-${entry.time}`}
                  role="row"
                  className="grid gap-4 px-6 py-4 sm:grid-cols-[2fr_1.5fr_1fr_5rem]"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{entry.device}</p>
                    <p className="text-xs text-muted-foreground sm:hidden">{entry.location}</p>
                  </div>
                  <p className="hidden text-sm text-muted-foreground sm:block">{entry.location}</p>
                  <p className="text-sm text-muted-foreground">{entry.time}</p>
                  <div className="flex items-center justify-start sm:justify-center">
                    <Badge
                      variant="secondary"
                      className={entry.status === "Active" ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"}
                    >
                      {entry.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Need to revoke a device? Visit <span className="font-medium text-foreground">Settings → Security</span> to manage sessions.
            </p>
            <Button variant="outline" size="sm" className="gap-2">
              <Activity className="h-4 w-4" /> End all other sessions
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Alerting</CardTitle>
              <CardDescription>Stay informed when suspicious activity occurs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    <BellRing className="h-4 w-4 text-primary" /> Login alerts
                  </p>
                  <p className="text-xs text-muted-foreground">Email and push notifications for new device sign-ins.</p>
                </div>
                <AnimatedSwitch
                  id="login-alerts"
                  checked={loginAlerts}
                  onCheckedChange={(value) => {
                    setLoginAlerts(value)
                    trackPreferenceToggle({
                      preferenceId: "login-alerts",
                      label: "Login alerts",
                      section: "security",
                      value,
                    })
                  }}
                />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    <EyeOff className="h-4 w-4 text-primary" /> Mask sensitive data
                  </p>
                  <p className="text-xs text-muted-foreground">Require reveal tap for account numbers and personally identifiable data.</p>
                </div>
                <AnimatedSwitch
                  id="mask-sensitive"
                  checked={maskSensitive}
                  onCheckedChange={(value) => {
                    setMaskSensitive(value)
                    trackPreferenceToggle({
                      preferenceId: "mask-sensitive",
                      label: "Mask sensitive data",
                      section: "security",
                      value,
                    })
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Exports & backups</CardTitle>
              <CardDescription>Generate encrypted exports for compliance or record keeping.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <Download className="h-4 w-4" /> Export access log (CSV)
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <Download className="h-4 w-4" /> Download masking report (PDF)
              </Button>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Exports expire after 24 hours. For enterprise SSO controls, contact <Link className="underline" href="mailto:security@fin-infra.com">security@fin-infra.com</Link>.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
