"use client"

import { useState, useEffect, useMemo } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { SettingsGroup } from "@/components/settings-group"
import { AnimatedSwitch } from "@/components/animated-switch"
import { ThemeSelector } from "@/components/theme-selector"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { trackPreferenceToggle } from "@/lib/analytics/events"
import {
  Bell,
  Lock,
  Palette,
  Globe,
  Shield,
  Smartphone,
  Link2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Database,
  UserX,
  Trash2,
  Type,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type FontScale = "compact" | "default" | "comfort" | "focus"
const APPEARANCE_STORAGE_KEY = "fin-infra-appearance"
const appearanceDefaults: { fontScale: FontScale; dyslexia: boolean } = {
  fontScale: "default",
  dyslexia: false,
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const initialState = {
    emailNotifications: true,
    pushNotifications: true,
    priceAlerts: true,
    tradeConfirmations: true,
    twoFactor: false,
    analyticsConsent: true,
    marketingConsent: false,
    dataSharing: true,
  }

  const [emailNotifications, setEmailNotifications] = useState(initialState.emailNotifications)
  const [pushNotifications, setPushNotifications] = useState(initialState.pushNotifications)
  const [priceAlerts, setPriceAlerts] = useState(initialState.priceAlerts)
  const [tradeConfirmations, setTradeConfirmations] = useState(initialState.tradeConfirmations)
  const [twoFactor, setTwoFactor] = useState(initialState.twoFactor)
  const [analyticsConsent, setAnalyticsConsent] = useState(initialState.analyticsConsent)
  const [marketingConsent, setMarketingConsent] = useState(initialState.marketingConsent)
  const [dataSharing, setDataSharing] = useState(initialState.dataSharing)
  const [fontScale, setFontScale] = useState<FontScale>(appearanceDefaults.fontScale)
  const [dyslexiaMode, setDyslexiaMode] = useState<boolean>(appearanceDefaults.dyslexia)
  const [appearanceLoaded, setAppearanceLoaded] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleToggleChange = (
    preferenceId: string,
    label: string,
    section: string,
    setter: (value: boolean) => void,
  ) => {
    return (value: boolean) => {
      setter(value)
      trackPreferenceToggle({ preferenceId, label, section, value })
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    try {
      const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<{ fontScale: FontScale; dyslexia: boolean }>
        if (parsed.fontScale && ["compact", "default", "comfort", "focus"].includes(parsed.fontScale)) {
          setFontScale(parsed.fontScale)
        }
        if (typeof parsed.dyslexia === "boolean") {
          setDyslexiaMode(parsed.dyslexia)
        }
      }
    } catch {
      // noop – fall back to defaults
    } finally {
      setAppearanceLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (typeof document === "undefined" || !appearanceLoaded) {
      return
    }
    const root = document.documentElement
    if (fontScale === "default") {
      root.removeAttribute("data-font-scale")
    } else {
      root.setAttribute("data-font-scale", fontScale)
    }
    if (dyslexiaMode) {
      root.setAttribute("data-dyslexia", "true")
    } else {
      root.removeAttribute("data-dyslexia")
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        APPEARANCE_STORAGE_KEY,
        JSON.stringify({ fontScale, dyslexia: dyslexiaMode }),
      )
    }
  }, [appearanceLoaded, fontScale, dyslexiaMode])

  useEffect(() => {
    const changed =
      emailNotifications !== initialState.emailNotifications ||
      pushNotifications !== initialState.pushNotifications ||
      priceAlerts !== initialState.priceAlerts ||
      tradeConfirmations !== initialState.tradeConfirmations ||
      twoFactor !== initialState.twoFactor ||
      analyticsConsent !== initialState.analyticsConsent ||
      marketingConsent !== initialState.marketingConsent ||
      dataSharing !== initialState.dataSharing ||
      fontScale !== appearanceDefaults.fontScale ||
      dyslexiaMode !== appearanceDefaults.dyslexia ||
      (theme ?? "system") !== "system"
    setHasChanges(changed)
    // We intentionally compare to initialState (component-constant) here; adding it to deps is unnecessary
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    emailNotifications,
    pushNotifications,
    priceAlerts,
    tradeConfirmations,
    twoFactor,
    analyticsConsent,
    marketingConsent,
    dataSharing,
    fontScale,
    dyslexiaMode,
    theme,
  ])

  const handleReset = () => {
    setEmailNotifications(initialState.emailNotifications)
    setPushNotifications(initialState.pushNotifications)
    setPriceAlerts(initialState.priceAlerts)
    setTradeConfirmations(initialState.tradeConfirmations)
    setTwoFactor(initialState.twoFactor)
    setAnalyticsConsent(initialState.analyticsConsent)
    setMarketingConsent(initialState.marketingConsent)
    setDataSharing(initialState.dataSharing)
    setFontScale(appearanceDefaults.fontScale)
    setDyslexiaMode(appearanceDefaults.dyslexia)
    setTheme("system")
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(APPEARANCE_STORAGE_KEY)
    }
  }

  const connectedAccounts = [
    { name: "Coinbase", status: "connected", lastSync: "2 hours ago" },
    { name: "Binance", status: "connected", lastSync: "5 hours ago" },
    { name: "Plaid (Bank Link)", status: "error", lastSync: "Failed" },
  ]

  const notificationPreferences = useMemo(
    () => [
      {
        id: "email-notifications",
        label: "Email notifications",
        description: "Trade receipts, balance alerts, and weekly summaries.",
        value: emailNotifications,
        setter: setEmailNotifications,
      },
      {
        id: "push-notifications",
        label: "Push notifications",
        description: "Instant alerts on mobile and desktop apps.",
        value: pushNotifications,
        setter: setPushNotifications,
      },
      {
        id: "price-alerts",
        label: "Price alerts",
        description: "Notifies when equities cross your guardrails.",
        value: priceAlerts,
        setter: setPriceAlerts,
      },
      {
        id: "trade-confirmations",
        label: "Trade confirmations",
        description: "Require one-tap approval before orders execute.",
        value: tradeConfirmations,
        setter: setTradeConfirmations,
      },
    ],
    [emailNotifications, pushNotifications, priceAlerts, tradeConfirmations],
  )

  const privacyPreferences = useMemo(
    () => [
      {
        id: "analytics-consent",
        label: "Analytics & performance",
        description: "Share anonymized usage data to improve reliability.",
        value: analyticsConsent,
        setter: setAnalyticsConsent,
      },
      {
        id: "marketing-consent",
        label: "Product updates",
        description: "Receive curated product news and early feature access.",
        value: marketingConsent,
        setter: setMarketingConsent,
      },
      {
        id: "data-sharing",
        label: "Partner data sharing",
        description: "Allow trusted institutions to pull aggregated insights.",
        value: dataSharing,
        setter: setDataSharing,
      },
    ],
    [analyticsConsent, marketingConsent, dataSharing],
  )

  const fontScaleOptions: { value: FontScale; label: string; helper: string }[] = [
    { value: "compact", label: "Compact", helper: "Tight tables" },
    { value: "default", label: "Balanced", helper: "System default" },
    { value: "comfort", label: "Comfort", helper: "Reading focus" },
    { value: "focus", label: "Focus", helper: "Maximum legibility" },
  ]

  return (
    <div className="p-6">
      <div className="sticky top-16 z-20 bg-background/90 backdrop-blur-md border-b border-border/20 -mx-6 px-6 py-4 mb-8">
        <div className="mx-auto max-w-3xl flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your account preferences</p>
          </div>
          <Badge variant="outline" className="text-xs px-3">
            Account
          </Badge>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto max-w-3xl space-y-8 pb-24"
      >
        <SettingsGroup
          title="Notifications"
          description="Configure how you receive updates"
          icon={<Bell className="h-5 w-5" />}
        >
          {notificationPreferences.map((preference) => (
            <div key={preference.id} className="flex items-start justify-between gap-6 py-4">
              <div className="space-y-1">
                <Label htmlFor={preference.id} className="font-medium">
                  {preference.label}
                </Label>
                <p className="text-xs text-muted-foreground max-w-sm">{preference.description}</p>
              </div>
              <AnimatedSwitch
                id={preference.id}
                checked={preference.value}
                onCheckedChange={handleToggleChange(
                  preference.id,
                  preference.label,
                  "notifications",
                  preference.setter,
                )}
              />
            </div>
          ))}
        </SettingsGroup>

        <SettingsGroup
          title="Appearance"
          description="Customize the look and feel of your dashboard"
          icon={<Palette className="h-5 w-5" />}
        >
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="font-medium">Theme</Label>
              <ThemeSelector />
            </div>

            <div className="space-y-2">
              <Label className="font-medium flex items-center gap-2">
                Font scale
                <Badge variant="outline" className="text-[0.65rem]">
                  Applies instantly
                </Badge>
              </Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {fontScaleOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={fontScale === option.value ? "default" : "outline"}
                    className="h-full justify-between gap-1 rounded-xl border border-border/40 bg-background/90 px-4 py-3 text-left"
                    onClick={() => {
                      setFontScale(option.value)
                      trackPreferenceToggle({
                        preferenceId: `font-scale-${option.value}`,
                        label: `Font scale ${option.label}`,
                        section: "appearance",
                        value: option.value !== appearanceDefaults.fontScale,
                      })
                    }}
                    aria-pressed={fontScale === option.value}
                  >
                    <span className="text-sm font-semibold">{option.label}</span>
                    <span className="text-[0.7rem] text-muted-foreground">{option.helper}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-start justify-between gap-6 rounded-xl border border-border/40 bg-muted/10 px-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="dyslexia-mode" className="font-medium flex items-center gap-2">
                  Dyslexia-friendly mode <Type className="h-3.5 w-3.5" />
                </Label>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Switches to Atkinson Hyperlegible and slightly increases letter spacing for easier scanning.
                </p>
              </div>
              <AnimatedSwitch
                id="dyslexia-mode"
                checked={dyslexiaMode}
                onCheckedChange={(value) => {
                  setDyslexiaMode(value)
                  trackPreferenceToggle({
                    preferenceId: "dyslexia-mode",
                    label: "Dyslexia-friendly mode",
                    section: "appearance",
                    value,
                  })
                }}
              />
            </div>
          </div>
        </SettingsGroup>

        <SettingsGroup title="Security" description="Manage your security settings" icon={<Lock className="h-5 w-5" />}>
          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor" className="font-medium">
                Two-Factor Authentication
              </Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <AnimatedSwitch
              id="two-factor"
              checked={twoFactor}
              onCheckedChange={handleToggleChange(
                "two-factor",
                "Two-Factor Authentication",
                "security",
                setTwoFactor,
              )}
            />
          </div>

          <div className="space-y-3 py-4">
            <Button asChild variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Link href="/settings/security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Visit Security Center
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Smartphone className="h-4 w-4" />
              Manage Devices
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Lock className="h-4 w-4" />
              Change Password
            </Button>
          </div>
        </SettingsGroup>

        <SettingsGroup
          title="Regional Settings"
          description="Set your language and timezone preferences"
          icon={<Globe className="h-5 w-5" />}
        >
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label htmlFor="language" className="font-medium">
                Language
              </Label>
              <Select defaultValue="en">
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="timezone" className="font-medium">
                Timezone
              </Label>
              <Select defaultValue="est">
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="est">Eastern Time (ET)</SelectItem>
                  <SelectItem value="cst">Central Time (CT)</SelectItem>
                  <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                  <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SettingsGroup>

        {/* Accessibility & Privacy section */}
        <SettingsGroup
          title="Accessibility & Privacy"
          description="Manage your data sharing preferences and privacy settings"
          icon={<Eye className="h-5 w-5" />}
        >
          {privacyPreferences.map((preference) => (
            <div key={preference.id} className="flex items-start justify-between gap-6 py-4">
              <div className="space-y-1">
                <Label htmlFor={preference.id} className="font-medium capitalize">
                  {preference.label}
                </Label>
                <p className="text-xs text-muted-foreground max-w-sm">{preference.description}</p>
              </div>
              <AnimatedSwitch
                id={preference.id}
                checked={preference.value}
                onCheckedChange={handleToggleChange(
                  preference.id,
                  preference.label,
                  "privacy",
                  preference.setter,
                )}
              />
            </div>
          ))}

          <div className="space-y-3 py-4">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Database className="h-4 w-4" />
              Download My Data
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 bg-transparent text-red-600 hover:text-red-700"
            >
              <UserX className="h-4 w-4" />
              Delete My Account
            </Button>
          </div>
        </SettingsGroup>

        <SettingsGroup
          title="Connected Accounts"
          description="Manage your linked brokers and financial institutions"
          icon={<Link2 className="h-5 w-5" />}
        >
          <div className="space-y-4 py-4">
            {connectedAccounts.map((account) => (
              <div
                key={account.name}
                className="flex items-center justify-between p-4 rounded-lg border border-border/30 bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${account.status === "connected" ? "bg-emerald-500" : "bg-red-500"}`}
                  />
                  <div>
                    <p className="font-medium text-sm">{account.name}</p>
                    <p className="text-xs text-muted-foreground">Last synced: {account.lastSync}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {account.status === "connected" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <RefreshCw className="h-3 w-3" />
                    Refresh
                  </Button>
                  {/* Disconnect button */}
                  <Button variant="ghost" size="sm" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-3 w-3" />
                    Disconnect
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Link2 className="h-4 w-4" />
              Connect New Account
            </Button>
          </div>
        </SettingsGroup>

        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed bottom-0 left-0 right-0 lg:left-64 bg-background/95 backdrop-blur-md border-t border-border/20 px-6 py-4 flex justify-between items-center z-30 shadow-lg"
            >
              <Button variant="ghost" size="lg" onClick={handleReset}>
                Reset to Defaults
              </Button>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-xs">
                  Unsaved changes
                </Badge>
                <Button size="lg">Save All Settings</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
