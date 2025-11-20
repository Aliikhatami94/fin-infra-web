import { kpis, recentActivities, personaKpiExtras, personaKpiPriorities } from "@/lib/mock"
import { dashboardKpisResponseSchema, recentActivitiesResponseSchema } from "@/lib/schemas"
import type { KPI, OnboardingPersona, RecentActivity, Account } from "@/types/domain"
import { isMarketingMode } from "@/lib/marketingMode"
import { DollarSign, Wallet, CreditCard, Activity, AlertCircle, AlertTriangle, Lightbulb } from "lucide-react"

/**
 * Calculate relative time from account lastSync timestamp
 */
function getRelativeTime(lastSync: string): string {
  try {
    const syncDate = new Date(lastSync)
    const now = new Date()
    const diffMs = now.getTime() - syncDate.getTime()
    const diffMinutes = Math.floor(diffMs / 60000)
    
    if (diffMinutes < 1) return "just now"
    if (diffMinutes < 60) return `${diffMinutes} min ago`
    
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  } catch {
    return "recently"
  }
}

/**
 * Calculate real KPIs from account data with financial health insights
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
  
  // Financial Health Analysis
  const isNetWorthNegative = netWorth < 0
  const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0
  const emergencyFundMonths = totalCash / 4000 // Assuming $4k/month expenses
  const investmentRate = totalAssets > 0 ? (totalInvestments / totalAssets) * 100 : 0
  
  // Calculate trends (mock for now - would need historical data)
  const netWorthChange = netWorth > 0 ? 5.2 : -2.3 // Negative net worth shows downward trend
  const cashChange = totalCash > 10000 ? -2.1 : -8.5 // Warn if cash is low
  const debtChange = totalLiabilities > 0 ? -3.4 : 0 // Negative = paying down debt (good!)
  const investmentsChange = totalInvestments > 0 ? 4.8 : 0
  
  // Helper to create sparkline
  const createSparkline = (value: number, trend: number) => {
    const points = 10
    const base = Math.abs(value) / (1 + Math.abs(trend) / 100)
    return Array.from({ length: points }, (_, i) => {
      const progress = i / (points - 1)
      const sparkValue = base + (base * trend / 100) * progress
      return value < 0 ? -sparkValue : sparkValue
    })
  }
  
  // Smart quick actions based on financial health
  const getNetWorthActions = () => {
    if (isNetWorthNegative) {
      return [
        { label: "Create debt plan", href: "/dashboard/accounts" },
        { label: "View breakdown", href: "/dashboard/accounts" },
      ]
    }
    return [
      { label: "View details", href: "/dashboard/accounts" },
    ]
  }
  
  const getCashActions = () => {
    if (emergencyFundMonths < 3) {
      return [
        { label: "Build emergency fund", href: "/cash-flow" },
      ]
    }
    return [
      { label: "View cash flow", href: "/cash-flow" },
    ]
  }
  
  const getDebtActions = () => {
    if (debtToAssetRatio > 50) {
      return [
        { label: "Create payoff plan", href: "/dashboard/accounts" },
      ]
    }
    return [
      { label: "View accounts", href: "/dashboard/accounts" },
    ]
  }
  
  const getInvestmentActions = () => {
    if (investmentRate < 20 && totalCash > 5000) {
      return [
        { label: "Grow investments", href: "/dashboard/portfolio" },
      ]
    }
    return [
      { label: "View portfolio", href: "/dashboard/portfolio" },
    ]
  }
  
  const realKpis: Partial<Record<string, KPI>> = {
    "Net Worth": {
      label: "Net Worth",
      value: `${netWorth < 0 ? '-' : ''}$${Math.abs(netWorth).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${netWorthChange >= 0 ? '+' : ''}${netWorthChange.toFixed(1)}%`,
      baselineValue: `$${Math.abs(netWorth / (1 + netWorthChange / 100)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: netWorthChange >= 0 ? "up" : "down",
      sparkline: createSparkline(netWorth, netWorthChange),
      icon: DollarSign,
      lastSynced: accounts.length > 0 ? getRelativeTime(accounts[0].lastSync) : "recently",
      source: "Plaid",
      href: "/dashboard/accounts",
      quickActions: getNetWorthActions(),
      ...(isNetWorthNegative && {
        badge: {
          label: "Action Needed",
          variant: "destructive" as const,
          icon: AlertCircle,
          tooltip: "Your liabilities exceed your assets. Focus on debt reduction and building savings."
        }
      }),
    },
    "Cash Available": {
      label: "Cash Available",
      value: `$${totalCash.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${cashChange >= 0 ? '+' : ''}${cashChange.toFixed(1)}%`,
      baselineValue: `$${(totalCash / (1 + cashChange / 100)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: cashChange >= 0 ? "up" : "down",
      sparkline: createSparkline(totalCash, cashChange),
      icon: DollarSign,
      lastSynced: cashAccounts.length > 0 ? getRelativeTime(cashAccounts[0].lastSync) : "recently",
      source: "Plaid",
      href: "/dashboard/accounts",
      quickActions: getCashActions(),
      ...(emergencyFundMonths < 3 && {
        badge: {
          label: emergencyFundMonths < 1 ? "Critical" : "Low Fund",
          variant: emergencyFundMonths < 1 ? "destructive" as const : "secondary" as const,
          icon: emergencyFundMonths < 1 ? AlertCircle : AlertTriangle,
          tooltip: `Emergency fund covers ~${emergencyFundMonths.toFixed(1)} months. Aim for 3-6 months of expenses.`
        }
      }),
    },
    "Debt Balance": {
      label: "Debt Balance",
      value: `$${totalLiabilities.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${debtChange >= 0 ? '+' : ''}${debtChange.toFixed(1)}%`,
      baselineValue: `$${(totalLiabilities / (1 + debtChange / 100)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: debtChange <= 0 ? "down" : "up", // Down is good for debt
      sparkline: createSparkline(totalLiabilities, debtChange),
      icon: CreditCard,
      lastSynced: creditAccounts.length > 0 ? getRelativeTime(creditAccounts[0].lastSync) : (loanAccounts.length > 0 ? getRelativeTime(loanAccounts[0].lastSync) : "recently"),
      source: "Plaid",
      href: "/dashboard/accounts",
      quickActions: getDebtActions(),
      ...(debtToAssetRatio > 50 && {
        badge: {
          label: debtToAssetRatio > 80 ? "High Debt" : "Monitor",
          variant: debtToAssetRatio > 80 ? "destructive" as const : "secondary" as const,
          icon: debtToAssetRatio > 80 ? AlertCircle : AlertTriangle,
          tooltip: `Debt is ${debtToAssetRatio.toFixed(0)}% of your assets. Aim to keep this below 50%.`
        }
      }),
    },
    "Investable Assets": {
      label: "Investable Assets",
      value: `$${totalInvestments.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${investmentsChange >= 0 ? '+' : ''}${investmentsChange.toFixed(1)}%`,
      baselineValue: `$${(totalInvestments / (1 + investmentsChange / 100)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: investmentsChange >= 0 ? "up" : "down",
      sparkline: createSparkline(totalInvestments, investmentsChange),
      icon: Wallet,
      lastSynced: investmentAccounts.length > 0 ? getRelativeTime(investmentAccounts[0].lastSync) : "recently",
      source: "Plaid",
      href: "/dashboard/portfolio",
      quickActions: getInvestmentActions(),
      ...(investmentRate < 20 && totalCash > 5000 && {
        badge: {
          label: "Opportunity",
          variant: "default" as const,
          icon: Lightbulb,
          tooltip: `Only ${investmentRate.toFixed(0)}% of assets are invested. Consider investing excess cash.`
        }
      }),
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
