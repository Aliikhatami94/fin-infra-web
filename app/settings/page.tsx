"use client"

import { useState, useEffect } from "react"
import { SettingsGroup } from "@/components/settings-group"
import { AnimatedSwitch } from "@/components/animated-switch"
import { ThemeSelector } from "@/components/theme-selector"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function SettingsPage() {
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
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const changed =
      emailNotifications !== initialState.emailNotifications ||
      pushNotifications !== initialState.pushNotifications ||
      priceAlerts !== initialState.priceAlerts ||
      tradeConfirmations !== initialState.tradeConfirmations ||
      twoFactor !== initialState.twoFactor ||
      analyticsConsent !== initialState.analyticsConsent ||
      marketingConsent !== initialState.marketingConsent ||
      dataSharing !== initialState.dataSharing
    setHasChanges(changed)
  }, [
    emailNotifications,
    pushNotifications,
    priceAlerts,
    tradeConfirmations,
    twoFactor,
    analyticsConsent,
    marketingConsent,
    dataSharing,
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
  }

  const connectedAccounts = [
    { name: "Coinbase", status: "connected", lastSync: "2 hours ago" },
    { name: "Binance", status: "connected", lastSync: "5 hours ago" },
    { name: "Plaid (Bank Link)", status: "error", lastSync: "Failed" },
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
          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications" className="font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive email updates about your trades</p>
            </div>
            <AnimatedSwitch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications" className="font-medium">
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Get push notifications on your devices</p>
            </div>
            <AnimatedSwitch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <Label htmlFor="price-alerts" className="font-medium">
                Price Alerts
              </Label>
              <p className="text-sm text-muted-foreground">Notify when stocks reach target prices</p>
            </div>
            <AnimatedSwitch id="price-alerts" checked={priceAlerts} onCheckedChange={setPriceAlerts} />
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <Label htmlFor="trade-confirmations" className="font-medium">
                Trade Confirmations
              </Label>
              <p className="text-sm text-muted-foreground">Confirm all trades before execution</p>
            </div>
            <AnimatedSwitch
              id="trade-confirmations"
              checked={tradeConfirmations}
              onCheckedChange={setTradeConfirmations}
            />
          </div>
        </SettingsGroup>

        <SettingsGroup
          title="Appearance"
          description="Customize the look and feel of your dashboard"
          icon={<Palette className="h-5 w-5" />}
        >
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="font-medium">Theme</Label>
              <ThemeSelector />
            </div>

            <div className="space-y-3">
              <Label htmlFor="chart-style" className="font-medium">
                Chart Style
              </Label>
              <Select defaultValue="candlestick">
                <SelectTrigger id="chart-style">
                  <SelectValue placeholder="Select chart style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="candlestick">Candlestick</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                </SelectContent>
              </Select>
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
            <AnimatedSwitch id="two-factor" checked={twoFactor} onCheckedChange={setTwoFactor} />
          </div>

          <div className="space-y-3 py-4">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Shield className="h-4 w-4" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Smartphone className="h-4 w-4" />
              Manage Devices
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
          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <Label htmlFor="analytics-consent" className="font-medium">
                Analytics & Performance
              </Label>
              <p className="text-sm text-muted-foreground">Help us improve by sharing anonymous usage data</p>
            </div>
            <AnimatedSwitch id="analytics-consent" checked={analyticsConsent} onCheckedChange={setAnalyticsConsent} />
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-consent" className="font-medium">
                Marketing Communications
              </Label>
              <p className="text-sm text-muted-foreground">Receive product updates and offers</p>
            </div>
            <AnimatedSwitch id="marketing-consent" checked={marketingConsent} onCheckedChange={setMarketingConsent} />
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <Label htmlFor="data-sharing" className="font-medium">
                Data Sharing with Partners
              </Label>
              <p className="text-sm text-muted-foreground">Share aggregated data with financial service providers</p>
            </div>
            <AnimatedSwitch id="data-sharing" checked={dataSharing} onCheckedChange={setDataSharing} />
          </div>

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
