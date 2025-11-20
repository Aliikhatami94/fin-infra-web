import { kpis, recentActivities, personaKpiExtras, personaKpiPriorities } from "@/lib/mock"
import { dashboardKpisResponseSchema, recentActivitiesResponseSchema } from "@/lib/schemas"
import type { KPI, OnboardingPersona, RecentActivity, Account } from "@/types/domain"
import { isMarketingMode } from "@/lib/marketingMode"
import { DollarSign, Wallet, CreditCard, Activity } from "lucide-react"

/**
 * Calculate real KPIs from account data
 */
function calculateRealKpis(accounts: Account[]): Partial<Record<string, KPI>> {
  // Calculate totals from accounts
  const cashAccounts = accounts.filter(acc => 
    acc.type === "Checking" || acc.type === "Savings"
  )
  const totalCash = cashAccounts.reduce((sum, acc) => sum + acc.balance, 0)
  
  const creditAccounts = accounts.filter(acc => acc.type === "Credit Card")
  const totalCreditDebt = creditAccounts.reduce((sum, acc) => sum + Math.abs(acc.balance), 0)
  
  const investmentAccounts = accounts.filter(acc => acc.type === "Investment")
  const totalInvestments = investmentAccounts.reduce((sum, acc) => sum + acc.balance, 0)
  
  const loanAccounts = accounts.filter(acc => acc.type === "loan")
  const totalLoans = loanAccounts.reduce((sum, acc) => sum + acc.balance, 0)
  
  // Net Worth = Assets - Liabilities
  const totalAssets = totalCash + totalInvestments
  const totalLiabilities = totalCreditDebt + totalLoans
  const netWorth = totalAssets - totalLiabilities
  
  // Calculate trends (mock for now - would need historical data)
  const netWorthChange = netWorth > 0 ? 5.2 : 0
  const cashChange = -2.1 // Slightly down (spent some)
  const debtChange = totalCreditDebt + totalLoans > 0 ? -3.4 : 0 // Negative = paying down debt
  const investmentsChange = totalInvestments > 0 ? 4.8 : 0
  
  // Helper to create sparkline
  const createSparkline = (value: number, trend: number) => {
    const points = 10
    const base = value / (1 + trend / 100)
    return Array.from({ length: points }, (_, i) => {
      const progress = i / (points - 1)
      return base + (base * trend / 100) * progress
    })
  }
  
  const realKpis: Partial<Record<string, KPI>> = {
    "Net Worth": {
      label: "Net Worth",
      value: `$${netWorth.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${netWorthChange >= 0 ? '+' : ''}${netWorthChange.toFixed(1)}%`,
      baselineValue: `$${(netWorth / (1 + netWorthChange / 100)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: netWorthChange >= 0 ? "up" : "down",
      sparkline: createSparkline(netWorth, netWorthChange),
      icon: DollarSign,
      lastSynced: "2 minutes ago",
      source: "Plaid",
      href: "/dashboard/accounts",
      quickActions: [
        { label: "See details", href: "/dashboard/accounts" },
        { label: "Share summary", href: "/documents" },
      ],
    },
    "Cash Available": {
      label: "Cash Available",
      value: `$${totalCash.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${cashChange >= 0 ? '+' : ''}${cashChange.toFixed(1)}%`,
      baselineValue: `$${(totalCash / (1 + cashChange / 100)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: cashChange >= 0 ? "up" : "down",
      sparkline: createSparkline(totalCash, cashChange),
      icon: DollarSign,
      lastSynced: "2 minutes ago",
      source: "Plaid",
      href: "/dashboard/accounts",
      quickActions: [
        { label: "Move funds", href: "/cash-flow" },
        { label: "Set savings rule", href: "/cash-flow" },
      ],
    },
    "Debt Balance": {
      label: "Debt Balance",
      value: `$${totalLiabilities.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${debtChange >= 0 ? '+' : ''}${debtChange.toFixed(1)}%`,
      baselineValue: `$${(totalLiabilities / (1 + debtChange / 100)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: debtChange <= 0 ? "down" : "up", // Down is good for debt
      sparkline: createSparkline(totalLiabilities, debtChange),
      icon: CreditCard,
      lastSynced: "2 minutes ago",
      source: "Plaid",
      href: "/dashboard/accounts",
      quickActions: [
        { label: "Plan payoff", href: "/dashboard/accounts" },
      ],
    },
    "Investable Assets": {
      label: "Investable Assets",
      value: `$${totalInvestments.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${investmentsChange >= 0 ? '+' : ''}${investmentsChange.toFixed(1)}%`,
      baselineValue: `$${(totalInvestments / (1 + investmentsChange / 100)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: investmentsChange >= 0 ? "up" : "down",
      sparkline: createSparkline(totalInvestments, investmentsChange),
      icon: Wallet,
      lastSynced: "2 minutes ago",
      source: "Plaid",
      href: "/dashboard/portfolio",
      quickActions: [
        { label: "Allocate cash", href: "/dashboard/portfolio" },
        { label: "Automate transfers", href: "/cash-flow" },
      ],
    },
  }
  
  return realKpis
}

export async function getDashboardKpis(persona?: OnboardingPersona): Promise<KPI[]> {
  let base = dashboardKpisResponseSchema.parse(kpis)
  
  // If not in marketing mode, fetch real account data and calculate real KPIs
  if (!isMarketingMode()) {
    try {
      // Dynamic import to avoid circular dependencies
      const { getAccounts } = await import("@/lib/services/accounts")
      const accounts = await getAccounts()
      
      if (accounts.length > 0) {
        const realKpis = calculateRealKpis(accounts)
        
        // Replace mock KPIs with real ones where available
        base = base.map(kpi => {
          const realKpi = realKpis[kpi.label]
          return realKpi || kpi
        })
      }
    } catch (error) {
      console.warn("Failed to load real KPIs, using mock data:", error)
    }
  }
  
  if (!persona) return base

  const priorities = personaKpiPriorities[persona.goalsFocus] ?? []
  const prioritized = base.filter((kpi) => priorities.includes(kpi.label))
  const remainder = base.filter((kpi) => !priorities.includes(kpi.label))
  const extras = personaKpiExtras[persona.goalsFocus] ?? []

  const ordered = [...prioritized, ...extras, ...remainder]
  const limit = Math.max(base.length, ordered.length)
  return ordered.slice(0, limit)
}

export function getRecentActivities(): RecentActivity[] {
  return recentActivitiesResponseSchema.parse(recentActivities)
}
