"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { SettingsGroup } from "@/components/settings-group"
import { AnimatedSwitch } from "@/components/animated-switch"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ThemeSelector } from "@/components/theme-selector"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/sonner"
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
  Info,
} from "lucide-react"
import { motion } from "framer-motion"

type ThemeSetting = "light" | "dark" | "system"

type FontScale = "compact" | "default" | "comfort" | "focus"
const APPEARANCE_STORAGE_KEY = "fin-infra-appearance"
const appearanceDefaults: { fontScale: FontScale; dyslexia: boolean; highContrast: boolean } = {
  fontScale: "default",
  dyslexia: false,
  highContrast: false,
}

type SettingsSnapshot = {
  emailNotifications: boolean
  pushNotifications: boolean
  priceAlerts: boolean
  tradeConfirmations: boolean
  twoFactor: boolean
  analyticsConsent: boolean
  marketingConsent: boolean
  dataSharing: boolean
  fontScale: FontScale
  dyslexiaMode: boolean
  highContrastMode: boolean
  theme: ThemeSetting
  language: string
  timezone: string
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
  const [highContrastMode, setHighContrastMode] = useState<boolean>(appearanceDefaults.highContrast)
  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("est")
  const [appearanceLoaded, setAppearanceLoaded] = useState(false)
  const [baseline, setBaseline] = useState<SettingsSnapshot | null>(null)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [resetDialogOpen, setResetDialogOpen] = useState(false)

  const activeTheme = (theme ?? "system") as ThemeSetting

  const currentSnapshot = useMemo<SettingsSnapshot>(
    () => ({
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
      highContrastMode,
      theme: activeTheme,
      language,
      timezone,
    }),
    [
      activeTheme,
      analyticsConsent,
      dataSharing,
      dyslexiaMode,
      emailNotifications,
      fontScale,
      highContrastMode,
      language,
      marketingConsent,
      priceAlerts,
      pushNotifications,
      timezone,
      tradeConfirmations,
      twoFactor,
    ],
  )

  const computeSnapshot = useCallback(
    (overrides: Partial<SettingsSnapshot> = {}) => ({
      ...currentSnapshot,
      ...overrides,
    }),
    [currentSnapshot],
  )

  const handlePreferenceAutosave = useCallback(
    (preferenceId: string, label: string, nextSnapshot: SettingsSnapshot) => {
      setSaveStatus("saving")
      const savePromise = new Promise<void>((resolve) => {
        setTimeout(() => {
          setBaseline(nextSnapshot)
          setSaveStatus("saved")
          resolve()
        }, 500)
      })

      toast.promise(savePromise, {
        loading: "Saving…",
        success: `${label} saved`,
        error: `Couldn't save ${label}`,
      })

      return savePromise
    },
    [setBaseline],
  )

  const handleToggleChange = (
    preferenceId: string,
    label: string,
    section: string,
    setter: (value: boolean) => void,
    snapshotKey: keyof SettingsSnapshot,
  ) => {
    return (value: boolean) => {
      setter(value)
      trackPreferenceToggle({ preferenceId, label, section, value })
      const nextSnapshot = computeSnapshot({ [snapshotKey]: value } as Partial<SettingsSnapshot>)
      handlePreferenceAutosave(preferenceId, label, nextSnapshot)
    }
  }

  useEffect(() => {
    if (saveStatus !== "saved") {
      return
    }

    const timeout = setTimeout(() => setSaveStatus("idle"), 2000)

    return () => clearTimeout(timeout)
  }, [saveStatus])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    try {
      const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<{ fontScale: FontScale; dyslexia: boolean; highContrast: boolean }>
        if (parsed.fontScale && ["compact", "default", "comfort", "focus"].includes(parsed.fontScale)) {
          setFontScale(parsed.fontScale)
        }
        if (typeof parsed.dyslexia === "boolean") {
          setDyslexiaMode(parsed.dyslexia)
        }
        if (typeof parsed.highContrast === "boolean") {
          setHighContrastMode(parsed.highContrast)
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
    if (highContrastMode) {
      root.setAttribute("data-contrast", "high")
    } else {
      root.removeAttribute("data-contrast")
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        APPEARANCE_STORAGE_KEY,
        JSON.stringify({ fontScale, dyslexia: dyslexiaMode, highContrast: highContrastMode }),
      )
    }
  }, [appearanceLoaded, fontScale, dyslexiaMode, highContrastMode])

  useEffect(() => {
    if (!appearanceLoaded || baseline || typeof theme === "undefined") {
      return
    }

    setBaseline(currentSnapshot)
  }, [appearanceLoaded, baseline, currentSnapshot, theme])

  const hasChanges = useMemo(() => {
    if (!baseline) {
      return false
    }
    return (
      currentSnapshot.emailNotifications !== baseline.emailNotifications ||
      currentSnapshot.pushNotifications !== baseline.pushNotifications ||
      currentSnapshot.priceAlerts !== baseline.priceAlerts ||
      currentSnapshot.tradeConfirmations !== baseline.tradeConfirmations ||
      currentSnapshot.twoFactor !== baseline.twoFactor ||
      currentSnapshot.analyticsConsent !== baseline.analyticsConsent ||
      currentSnapshot.marketingConsent !== baseline.marketingConsent ||
      currentSnapshot.dataSharing !== baseline.dataSharing ||
      currentSnapshot.fontScale !== baseline.fontScale ||
      currentSnapshot.dyslexiaMode !== baseline.dyslexiaMode ||
      currentSnapshot.highContrastMode !== baseline.highContrastMode ||
      currentSnapshot.theme !== baseline.theme ||
      currentSnapshot.language !== baseline.language ||
      currentSnapshot.timezone !== baseline.timezone
    )
  }, [baseline, currentSnapshot])

  const handleReset = () => {
    setSaveStatus("saving")
    const resetSnapshot: SettingsSnapshot = {
      emailNotifications: initialState.emailNotifications,
      pushNotifications: initialState.pushNotifications,
      priceAlerts: initialState.priceAlerts,
      tradeConfirmations: initialState.tradeConfirmations,
      twoFactor: initialState.twoFactor,
      analyticsConsent: initialState.analyticsConsent,
      marketingConsent: initialState.marketingConsent,
      dataSharing: initialState.dataSharing,
      fontScale: appearanceDefaults.fontScale,
      dyslexiaMode: appearanceDefaults.dyslexia,
      highContrastMode: appearanceDefaults.highContrast,
      theme: "system",
      language: "en",
      timezone: "est",
    }

    setEmailNotifications(resetSnapshot.emailNotifications)
    setPushNotifications(resetSnapshot.pushNotifications)
    setPriceAlerts(resetSnapshot.priceAlerts)
    setTradeConfirmations(resetSnapshot.tradeConfirmations)
    setTwoFactor(resetSnapshot.twoFactor)
    setAnalyticsConsent(resetSnapshot.analyticsConsent)
    setMarketingConsent(resetSnapshot.marketingConsent)
    setDataSharing(resetSnapshot.dataSharing)
    setFontScale(resetSnapshot.fontScale)
    setDyslexiaMode(resetSnapshot.dyslexiaMode)
    setHighContrastMode(resetSnapshot.highContrastMode)
    setLanguage(resetSnapshot.language)
    setTimezone(resetSnapshot.timezone)
    setTheme(resetSnapshot.theme)
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(APPEARANCE_STORAGE_KEY)
    }

    const resetPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        setBaseline(resetSnapshot)
        setSaveStatus("saved")
        resolve()
      }, 500)
    })

    toast.promise(resetPromise, {
      loading: "Restoring defaults…",
      success: "Defaults restored",
      error: "Couldn't reset settings",
    })
  }

  const handleSave = () => {
    setSaveStatus("saving")
    const snapshot = currentSnapshot
    const savePromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        setBaseline(snapshot)
        setSaveStatus("saved")
        resolve()
      }, 500)
    })

    toast.promise(savePromise, {
      loading: "Saving…",
      success: "Settings saved",
      error: "Couldn't save settings",
    })
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
        tooltip: "Receive notifications via email to your registered address. Useful for non-urgent updates and record-keeping.",
        value: emailNotifications,
        setter: setEmailNotifications,
        snapshotKey: "emailNotifications" as const,
      },
      {
        id: "push-notifications",
        label: "Push notifications",
        description: "Instant alerts on mobile and desktop apps.",
        tooltip: "Real-time notifications delivered directly to your device. Requires app installation and permission.",
        value: pushNotifications,
        setter: setPushNotifications,
        snapshotKey: "pushNotifications" as const,
      },
      {
        id: "price-alerts",
        label: "Price alerts",
        description: "Notifies when equities cross your guardrails.",
        tooltip: "Set custom price thresholds for your watchlist. You'll be notified when stocks hit your target prices.",
        value: priceAlerts,
        setter: setPriceAlerts,
        snapshotKey: "priceAlerts" as const,
      },
      {
        id: "trade-confirmations",
        label: "Trade confirmations",
        description: "Require one-tap approval before orders execute.",
        tooltip: "Adds a final confirmation step before executing trades, preventing accidental orders.",
        value: tradeConfirmations,
        setter: setTradeConfirmations,
        snapshotKey: "tradeConfirmations" as const,
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
        tooltip: "Helps us understand how you use the platform to fix bugs and improve features. All data is anonymized and aggregated.",
        value: analyticsConsent,
        setter: setAnalyticsConsent,
        snapshotKey: "analyticsConsent" as const,
      },
      {
        id: "marketing-consent",
        label: "Product updates",
        description: "Receive curated product news and early feature access.",
        tooltip: "Occasional emails about new features, platform updates, and exclusive beta program invitations.",
        value: marketingConsent,
        setter: setMarketingConsent,
        snapshotKey: "marketingConsent" as const,
      },
      {
        id: "data-sharing",
        label: "Partner data sharing",
        description: "Allow trusted institutions to pull aggregated insights.",
        tooltip: "Share anonymized portfolio data with verified financial institutions for market research. Your identity remains private.",
        value: dataSharing,
        setter: setDataSharing,
        snapshotKey: "dataSharing" as const,
      },
    ],
    [analyticsConsent, marketingConsent, dataSharing],
  )

  const notificationHelperId = "notification-helper"

  const fontScaleOptions: { value: FontScale; label: string; helper: string }[] = [
    { value: "compact", label: "Compact", helper: "Tight tables" },
    { value: "default", label: "Balanced", helper: "System default" },
    { value: "comfort", label: "Comfort", helper: "Reading focus" },
    { value: "focus", label: "Focus", helper: "Maximum legibility" },
  ]

  const previewCopy = {
    heading: "Preview",
    body: "Market updates and insights adapt instantly to your preferences.",
  }

  const previewTypography =
    fontScale === "compact"
      ? "text-xs"
      : fontScale === "comfort"
        ? "text-sm"
        : fontScale === "focus"
          ? "text-base"
          : "text-[0.8rem]"

  const statusLabel =
    saveStatus === "saving"
      ? "Saving…"
      : saveStatus === "saved"
        ? "Saved"
        : hasChanges
          ? "Unsaved changes"
          : "All settings saved"

  const statusVariant =
    saveStatus === "saving" || hasChanges
      ? "secondary"
      : saveStatus === "saved"
        ? "default"
        : "outline"

  return (
    <TooltipProvider delayDuration={300}>
    <div className="">
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto p-4 flex justify-between items-center max-w-[1200px] px-4 sm:px-6 lg:px-10 z-[99]">
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
      >
  <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-6 space-y-6" >
          <SettingsGroup
            title="Notifications"
            description="Configure how you receive updates"
            icon={<Bell className="h-5 w-5" />}
          >
            <p id={notificationHelperId} className="text-xs text-muted-foreground">
              Choose how TradeHub keeps you in the loop. Each option announces its state to screen readers.
            </p>
            <fieldset className="mt-4 space-y-4" aria-describedby={notificationHelperId}>
              {notificationPreferences.map((preference) => {
                const labelId = `${preference.id}-label`
                const descriptionId = `${preference.id}-description`
                return (
                  <div key={preference.id} className="flex items-start justify-between gap-6 rounded-xl border border-border/30 bg-muted/5 px-4 py-4">
                    <div className="space-y-1">
                      <Label id={labelId} htmlFor={preference.id} className="font-medium flex items-center gap-1.5">
                        {preference.label}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="text-xs">{preference.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <p id={descriptionId} className="text-xs text-muted-foreground max-w-sm">
                        {preference.description}
                      </p>
                    </div>
                    <AnimatedSwitch
                      id={preference.id}
                      aria-labelledby={labelId}
                      aria-describedby={descriptionId}
                      checked={preference.value}
                      onCheckedChange={handleToggleChange(
                        preference.id,
                        preference.label,
                        "notifications",
                        preference.setter,
                        preference.snapshotKey,
                      )}
                    />
                  </div>
                )
              })}
            </fieldset>
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
                      variant="outline"
                      className={cn(
                        "h-full justify-between gap-1 rounded-xl border border-border/40 bg-card/90 px-4 py-3 text-left",
                        fontScale === option.value &&
                          // Keep selected (brand) styles stable on hover/focus/active
                          "border-primary/60 bg-primary/5 text-foreground hover:border-primary/60 hover:bg-primary/5 hover:text-foreground focus-visible:ring-primary/30 active:bg-primary/5",
                      )}
                      onClick={() => {
                        setFontScale(option.value)
                        trackPreferenceToggle({
                          preferenceId: `font-scale-${option.value}`,
                          label: `Font scale ${option.label}`,
                          section: "appearance",
                          value: option.value !== appearanceDefaults.fontScale,
                        })
                        const nextSnapshot = computeSnapshot({ fontScale: option.value })
                        handlePreferenceAutosave(`font-scale-${option.value}`, `Font scale ${option.label}`, nextSnapshot)
                      }}
                      aria-pressed={fontScale === option.value}
                    >
                      <span className="text-sm font-semibold">{option.label}</span>
                      <span className="text-[0.7rem] text-muted-foreground">{option.helper}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex h-full flex-col justify-between gap-6 rounded-xl border border-border/40 bg-muted/10 px-4 py-4">
                  <div className="space-y-1">
                    <Label
                      id="dyslexia-mode-label"
                      htmlFor="dyslexia-mode"
                      className="flex items-center gap-2 font-medium"
                    >
                      Dyslexia-friendly mode <Type className="h-3.5 w-3.5" />
                    </Label>
                    <p id="dyslexia-mode-description" className="text-xs text-muted-foreground max-w-sm">
                      Switches to Atkinson Hyperlegible and slightly increases letter spacing for easier scanning.
                    </p>
                  </div>
                  <AnimatedSwitch
                    id="dyslexia-mode"
                    aria-labelledby="dyslexia-mode-label"
                    aria-describedby="dyslexia-mode-description"
                    checked={dyslexiaMode}
                    onCheckedChange={(value) => {
                      setDyslexiaMode(value)
                      trackPreferenceToggle({
                        preferenceId: "dyslexia-mode",
                        label: "Dyslexia-friendly mode",
                        section: "appearance",
                        value,
                      })
                      const nextSnapshot = computeSnapshot({ dyslexiaMode: value })
                      handlePreferenceAutosave("dyslexia-mode", "Dyslexia-friendly mode", nextSnapshot)
                    }}
                  />
                </div>
                <div className="flex h-full flex-col justify-between gap-6 rounded-xl border border-border/40 bg-muted/10 px-4 py-4">
                  <div className="space-y-1">
                    <Label id="high-contrast-mode-label" htmlFor="high-contrast-mode" className="font-medium">
                      High contrast preview
                    </Label>
                    <p id="high-contrast-mode-description" className="text-xs text-muted-foreground max-w-sm">
                      Adds stronger borders and color separation for low-vision scenarios.
                    </p>
                  </div>
                  <AnimatedSwitch
                    id="high-contrast-mode"
                    aria-labelledby="high-contrast-mode-label"
                    aria-describedby="high-contrast-mode-description"
                    checked={highContrastMode}
                    onCheckedChange={(value) => {
                      setHighContrastMode(value)
                      trackPreferenceToggle({
                        preferenceId: "high-contrast-mode",
                        label: "High contrast preview",
                        section: "appearance",
                        value,
                      })
                      const nextSnapshot = computeSnapshot({ highContrastMode: value })
                      handlePreferenceAutosave("high-contrast-mode", "High contrast preview", nextSnapshot)
                    }}
                  />
                </div>
              </div>

              <div
                aria-live="polite"
                className={cn(
                  "rounded-xl border bg-gradient-to-br from-card to-muted/20 p-4 sm:p-5 transition-all duration-300",
                  highContrastMode ? "border-primary ring-2 ring-primary/40" : "border-dashed border-border/50",
                  dyslexiaMode && "font-['Atkinson_Hyperlegible',sans-serif] tracking-wide"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[0.65rem] uppercase tracking-wide text-muted-foreground font-semibold">
                    Live Preview
                  </p>
                  <Badge variant="secondary" className="text-[0.6rem] px-2 py-0">
                    {fontScale === "compact" ? "Compact" : fontScale === "comfort" ? "Comfort" : fontScale === "focus" ? "Focus" : "Balanced"}
                  </Badge>
                </div>
                <p className={`font-medium leading-relaxed transition-all duration-200 ${previewTypography}`}>
                  {previewCopy.body}
                </p>
                <p className={`mt-2 text-muted-foreground transition-all duration-200 ${previewTypography === "text-xs" ? "text-[0.65rem]" : previewTypography === "text-sm" ? "text-xs" : previewTypography === "text-base" ? "text-sm" : "text-[0.7rem]"}`}>
                  Your changes are saved automatically as you adjust settings.
                </p>
              </div>
            </div>
          </SettingsGroup>

          <SettingsGroup title="Security" description="Manage your security settings" icon={<Lock className="h-5 w-5" />}> 
            <div className="flex items-center justify-between py-4">
              <div className="space-y-0.5">
                <Label id="two-factor-label" htmlFor="two-factor" className="font-medium flex items-center gap-1.5">
                  Two-Factor Authentication
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">Requires a verification code from your phone or authenticator app in addition to your password when signing in.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <p id="two-factor-description" className="text-sm text-muted-foreground">
                  Add an extra layer of security before approving logins.
                </p>
              </div>
              <AnimatedSwitch
                id="two-factor"
                aria-labelledby="two-factor-label"
                aria-describedby="two-factor-description"
                checked={twoFactor}
                onCheckedChange={handleToggleChange(
                  "two-factor",
                  "Two-Factor Authentication",
                  "security",
                  setTwoFactor,
                  "twoFactor",
                )}
              />
            </div>

            <div className="space-y-3 py-4">
              <Button asChild variant="outline" className="w-full justify-start gap-2">
                <Link href="/settings/security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Visit Security Center
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Smartphone className="h-4 w-4" />
                Manage Devices
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
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
                <Select value={language} onValueChange={setLanguage}>
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
                <Select value={timezone} onValueChange={setTimezone}>
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
            {privacyPreferences.map((preference) => {
              const labelId = `${preference.id}-label`
              const descriptionId = `${preference.id}-description`
              return (
                <div key={preference.id} className="flex items-start justify-between gap-6 rounded-xl border border-border/30 bg-muted/5 px-4 py-4">
                  <div className="space-y-1">
                    <Label id={labelId} htmlFor={preference.id} className="font-medium capitalize flex items-center gap-1.5">
                      {preference.label}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="text-xs">{preference.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <p id={descriptionId} className="text-xs text-muted-foreground max-w-sm">
                      {preference.description}
                    </p>
                  </div>
                  <AnimatedSwitch
                    id={preference.id}
                    aria-labelledby={labelId}
                    aria-describedby={descriptionId}
                    checked={preference.value}
                    onCheckedChange={handleToggleChange(
                      preference.id,
                      preference.label,
                      "privacy",
                      preference.setter,
                      preference.snapshotKey,
                    )}
                  />
                </div>
              )
            })}

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
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 hidden sm:block" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500 hidden sm:block" />
                    )}
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <RefreshCw className="h-3 w-3" />
                      <span className="hidden sm:inline">Refresh</span>
                    </Button>
                    {/* Disconnect button */}
                    <Button variant="ghost" size="sm" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-3 w-3" />
                      <span className="hidden sm:inline">Disconnect</span>
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full justify-start sm:justify-start justify-center gap-2 bg-transparent">
                <Link2 className="h-4 w-4" />
                <span className="inline">Connect New Account</span>
              </Button>
            </div>
          </SettingsGroup>
        </div>
      </motion.div>

      {/* Fixed footer aligned with content - auto-save enabled */}
      <div className="sticky bottom-0 border-t bg-card py-3 z-10">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 flex items-center justify-start">
          <Button 
            variant="outline" 
            size="default" 
            onClick={() => setResetDialogOpen(true)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="Reset settings to defaults?"
        description="We'll restore the recommended notification and accessibility defaults. This won't disconnect linked accounts."
        confirmLabel="Restore defaults"
        confirmVariant="destructive"
        onConfirm={() => {
          setResetDialogOpen(false)
          handleReset()
        }}
      >
        <ul className="list-disc space-y-1 pl-4">
          <li>Email, push, price alert, and trade confirmation toggles</li>
          <li>Appearance preferences including font scale, dyslexia mode, and contrast</li>
          <li>Theme, language, and timezone selections</li>
        </ul>
      </ConfirmDialog>
    </div>
    </TooltipProvider>
  )
}
