import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  Building2,
  Wallet,
  Bitcoin,
  TrendingUp,
  ListTree,
  Receipt,
  Target,
  FileText,
  Lightbulb,
  Settings,
  Shield,
  BarChart3,
} from "lucide-react"
import { isFeatureEnabled, type FeatureFlagKey } from "@/lib/analytics/experiments"

type NavigationBadge = number | string | undefined

export interface NavigationItem {
  name: string
  href: string
  icon: LucideIcon
  badge?: NavigationBadge
  featureFlag?: FeatureFlagKey
}

const BASE_DASHBOARD_NAVIGATION: NavigationItem[] = [
  { name: "Overview", href: "/overview", icon: LayoutDashboard },
  { name: "Accounts", href: "/accounts", icon: Building2, badge: 2 },
  { name: "Portfolio", href: "/portfolio", icon: Wallet },
  { name: "Crypto", href: "/crypto", icon: Bitcoin },
  { name: "Cash Flow", href: "/cash-flow", icon: TrendingUp },
  { name: "Transactions", href: "/transactions", icon: ListTree },
  { name: "Budget", href: "/budget", icon: Receipt },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Taxes", href: "/taxes", icon: FileText },
  { name: "Insights", href: "/insights", icon: Lightbulb },
  { name: "Growth", href: "/growth", icon: BarChart3, featureFlag: "growthDashboards" },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Security Center", href: "/settings/security", icon: Shield },
]

export const DASHBOARD_NAVIGATION: NavigationItem[] = BASE_DASHBOARD_NAVIGATION.filter(
  (item) => !item.featureFlag || isFeatureEnabled(item.featureFlag),
)
