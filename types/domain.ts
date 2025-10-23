import type { ComponentType } from "react"

export type IconComponent = ComponentType<{ className?: string }>

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
  date: string
  dateValue: Date
  size: string
  sizeValue: number
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
