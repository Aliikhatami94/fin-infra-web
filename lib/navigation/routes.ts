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
  badgeTooltip?: string
  featureFlag?: FeatureFlagKey
  exact?: boolean
}

const BASE_DASHBOARD_NAVIGATION: NavigationItem[] = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  {
    name: "Accounts",
    href: "/dashboard/accounts",
    icon: Building2,
    badge: 2,
    badgeTooltip: "Two accounts need your review",
  },
  { name: "Portfolio", href: "/dashboard/portfolio", icon: Wallet },
  { name: "Crypto", href: "/dashboard/crypto", icon: Bitcoin },
  { name: "Cash Flow", href: "/dashboard/cash-flow", icon: TrendingUp },
  { name: "Transactions", href: "/dashboard/transactions", icon: ListTree },
  { name: "Budget", href: "/dashboard/budget", icon: Receipt },
  { name: "Goals", href: "/dashboard/goals", icon: Target },
  { name: "Taxes", href: "/dashboard/taxes", icon: FileText },
  { name: "Insights", href: "/dashboard/insights", icon: Lightbulb },
  { name: "Growth", href: "/dashboard/growth", icon: BarChart3, featureFlag: "growthDashboards" },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Profile", href: "/dashboard/profile", icon: Settings },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, exact: true },
  { name: "Security Center", href: "/dashboard/settings/security", icon: Shield },
]

export const DASHBOARD_NAVIGATION: NavigationItem[] = BASE_DASHBOARD_NAVIGATION.filter(
  (item) => !item.featureFlag || isFeatureEnabled(item.featureFlag),
)
