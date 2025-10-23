import type { ComponentType } from "react"

export type IconComponent = ComponentType<{ className?: string }>

export type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"

export type AccountStatus = "active" | "needs_update" | "disconnected"

export type AccountType =
  | "Checking"
  | "Savings"
  | "Investment"
  | "Credit Card"
  | (string & {})

export interface Account {
  id: number
  name: string
  type: AccountType
  institution: string
  balance: number
  change: number
  lastSync: string
  status: AccountStatus
  nextBillDue: string | null
  nextBillAmount: number | null
}

export interface Transaction {
  id: number
  date: string
  merchant: string
  amount: number
  category: string
  icon: IconComponent
  account: string
  isNew?: boolean
  isRecurring?: boolean
  isFlagged?: boolean
  isTransfer?: boolean
  tags?: string[]
  notes?: string
}

export interface Holding {
  symbol: string
  name: string
  shares: number
  avgPrice: number
  currentPrice: number
  change: number
}

export interface Document {
  id: number
  name: string
  institution: string
  type: string
  account: string
  date: string
  dateValue: Date
  size: string
  sizeValue: number
  year: number
}

export interface DocumentInsight {
  icon: IconComponent
  text: string
  color: string
  bgColor: string
  action: string
  priority?: "low" | "medium" | "high"
}

export type InsightVariant = "spending" | "investment" | "goals" | "alert"

export interface InsightDataPoint {
  label: string
  value: string
  highlight?: boolean
}

export interface InsightFeedItem {
  id: number
  type: string
  icon: IconComponent
  title: string
  description: string
  category: string
  variant: InsightVariant
  trend?: number
  isPinned?: boolean
  dataPoints?: InsightDataPoint[]
  explanation?: string
}

export interface OverviewInsight {
  id: number
  type: string
  icon: IconComponent
  title: string
  description: string
  color: string
  bgColor: string
  borderColor: string
  progress: number
  isPinned: boolean
}

export interface TaxHarvestablePosition {
  asset: string
  loss: number
  selected?: boolean
}

export interface TaxHarvestingScenario {
  currentTaxLiability: number
  defaultTaxRate: number
  minTaxRate: number
  maxTaxRate: number
  step: number
  harvestablePositions: TaxHarvestablePosition[]
}

export type GoalStatus = "active" | "paused" | "completed"

export interface Goal {
  id: number
  name: string
  icon: IconComponent
  current: number
  target: number
  percent: number
  eta: string
  monthlyTarget: number
  fundingSource: string
  acceleration: number
  status: GoalStatus
  color: string
  bgColor: string
}

export type TrendDirection = "up" | "down" | "flat"

export interface KPI {
  label: string
  value: string
  change: string
  baselineValue: string
  trend: TrendDirection
  sparkline: number[]
  icon: IconComponent
  lastSynced: string
  source: string
  href: string
}

export type ActivityType = "transaction" | "sync" | "subscription" | (string & {})

export interface ActivityAction {
  label: string
  variant: ButtonVariant
}

export interface RecentActivity {
  id: number
  type: ActivityType
  category: string
  description: string
  amount: number | null
  date: string
  dateGroup: string
  icon: IconComponent
  color: string
  actions: ActivityAction[]
}

export type OnboardingStatus = "not_started" | "in_progress" | "completed" | "skipped"

export type OnboardingGoalFocus = "wealth_building" | "debt_paydown" | "financial_stability"

export type OnboardingRiskTolerance = "conservative" | "balanced" | "aggressive"

export type OnboardingBudgetingStyle = "hands_on" | "automated" | "hybrid"

export interface OnboardingPersona {
  goalsFocus: OnboardingGoalFocus
  riskTolerance: OnboardingRiskTolerance
  budgetingStyle: OnboardingBudgetingStyle
}

export type InstitutionConnectionStatus = "idle" | "linking" | "connected" | "error"

export interface LinkedInstitutionAccount {
  id: string
  name: string
  type: AccountType
  mask: string
  balance: number
}

export interface LinkedInstitution {
  id: string
  name: string
  status: InstitutionConnectionStatus
  lastLinkedAt?: string
  accounts: LinkedInstitutionAccount[]
  errorMessage?: string
}

export interface OnboardingState {
  status: OnboardingStatus
  completedSteps: string[]
  persona?: OnboardingPersona
  linkedInstitutions: LinkedInstitution[]
  lastUpdated: string
  skippedAt?: string
}

export interface MoneyGraphAccountNode {
  id: string
  accountId: number
  name: string
  institution: string
  type: AccountType
  balance: number
  intentTags: string[]
  supportsGoals: number[]
}

export type MoneyGraphTransactionDirection = "inflow" | "outflow"

export interface MoneyGraphTransactionNode {
  id: string
  transactionId: number
  accountId: number
  amount: number
  category: string
  cadence: "monthly" | "weekly" | "one_time"
  direction: MoneyGraphTransactionDirection
  goalIds: number[]
  notes?: string
}

export interface MoneyGraphGoalNode {
  id: string
  goalId: number
  priority: "primary" | "secondary"
  status: GoalStatus
  current: number
  target: number
  fundedByAccountIds: number[]
  personaTags: OnboardingGoalFocus[]
}

export interface MoneyGraphEdge {
  source: string
  target: string
  relationship: "funds" | "backs" | "influences"
  confidence: number
  annotations?: string[]
}

export interface MoneyGraph {
  accounts: MoneyGraphAccountNode[]
  transactions: MoneyGraphTransactionNode[]
  goals: MoneyGraphGoalNode[]
  edges: MoneyGraphEdge[]
  personaSignals: OnboardingPersona
  lastSynced: string
}
