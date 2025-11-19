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
  Folder,
  Lightbulb,
  Settings,
  Shield,
  BarChart3,
  User,
  CreditCard,
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
  comingSoon?: boolean
}

const BASE_DASHBOARD_NAVIGATION: NavigationItem[] = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  {
    name: "Banking",
    href: "/dashboard/banking",
    icon: Building2,
    badge: 2,
    badgeTooltip: "Two accounts need your review",
  },
  { name: "Portfolio", href: "/dashboard/portfolio", icon: Wallet, comingSoon: true },
  { name: "Crypto", href: "/dashboard/crypto", icon: Bitcoin, comingSoon: true },
  { name: "Cash Flow", href: "/dashboard/cash-flow", icon: TrendingUp, comingSoon: true },
  { name: "Transactions", href: "/dashboard/transactions", icon: ListTree },
  { name: "Budget", href: "/dashboard/budget", icon: Receipt, comingSoon: true },
  { name: "Goals", href: "/dashboard/goals", icon: Target, comingSoon: true },
  { name: "Taxes", href: "/dashboard/taxes", icon: FileText, comingSoon: true },
  { name: "Insights", href: "/dashboard/insights", icon: Lightbulb, comingSoon: true },
  { name: "Growth", href: "/dashboard/growth", icon: BarChart3, featureFlag: "growthDashboards", comingSoon: true },
  { name: "Documents", href: "/dashboard/documents", icon: Folder, comingSoon: true },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, exact: true },
  { name: "Security Center", href: "/dashboard/settings/security", icon: Shield },
]

export const DASHBOARD_NAVIGATION: NavigationItem[] = BASE_DASHBOARD_NAVIGATION.filter(
  (item) => !item.featureFlag || isFeatureEnabled(item.featureFlag),
)
