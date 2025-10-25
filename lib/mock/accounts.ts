import {
  AlertCircle,
  ArrowDownRight,
  Building2,
  Calendar,
  Coffee,
  CreditCard,
  Landmark,
  MoreHorizontal,
  Plus,
  RefreshCw,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Zap,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Filter,
  ArrowUpDown,
} from "lucide-react"
import type { ComponentType } from "react"
import type { Account, Transaction } from "@/types/domain"

export const defaultBankIcon = Building2

export const bankLogos: Record<string, ComponentType<{ className?: string }>> = {
  Chase: Building2,
  Fidelity: Landmark,
  "American Express": CreditCard,
  "Capital One": Building2,
}

export const typeColors: Record<string, string> = {
  Checking: "border-blue-500/50 text-blue-700 dark:text-blue-300 bg-blue-500/10",
  Savings: "border-green-500/50 text-green-700 dark:text-green-300 bg-green-500/10",
  Investment: "border-purple-500/50 text-purple-700 dark:text-purple-300 bg-purple-500/10",
  "Credit Card": "border-red-500/50 text-red-700 dark:text-red-300 bg-red-500/10",
}

function createBalanceHistory(currentBalance: number, changePercent: number): number[] {
  const points = 30
  const changeRatio = changePercent / 100
  const startingBalance = changeRatio === -1 ? currentBalance : currentBalance / (1 + changeRatio || 1)
  const amplitude = Math.abs(currentBalance - startingBalance) * 0.2

  return Array.from({ length: points }, (_, index) => {
    const progress = index / (points - 1)
    const base = startingBalance + (currentBalance - startingBalance) * progress
    const wave = Math.sin(progress * Math.PI * 2) * amplitude * 0.25
    const value = base + wave
    return Number(value.toFixed(2))
  })
}

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: "2024-01-20",
    merchant: "Amazon",
    amount: -89.99,
    category: "Shopping",
    icon: ShoppingCart,
    account: "Sapphire Reserve",
    isNew: true,
    tags: ["Household"],
  },
  {
    id: 2,
    date: "2024-01-19",
    merchant: "Starbucks",
    amount: -5.75,
    category: "Food & Drink",
    icon: Coffee,
    account: "Chase Total Checking",
    isRecurring: true,
    tags: ["Coffee"],
  },
  {
    id: 3,
    date: "2024-01-18",
    merchant: "Salary Deposit",
    amount: 3500.0,
    category: "Income",
    icon: ArrowDownRight,
    account: "Chase Total Checking",
    tags: ["Payroll"],
  },
  {
    id: 4,
    date: "2024-01-17",
    merchant: "Electric Bill",
    amount: -125.43,
    category: "Utilities",
    icon: Zap,
    account: "Chase Total Checking",
    isRecurring: true,
  },
  {
    id: 5,
    date: "2024-01-16",
    merchant: "Target",
    amount: -42.18,
    category: "Shopping",
    icon: ShoppingCart,
    account: "Sapphire Reserve",
    tags: ["Family"],
  },
]

export const accountsData: Account[] = [
  {
    id: 1,
    name: "Chase Total Checking",
    type: "Checking",
    institution: "Chase",
    balance: 12450.32,
    change: 2.3,
    balanceHistory: createBalanceHistory(12450.32, 2.3),
    lastSync: "2 hours ago",
    status: "active",
    nextBillDue: "Jan 25, 2024",
    nextBillAmount: 125.43,
  },
  {
    id: 2,
    name: "Chase Savings",
    type: "Savings",
    institution: "Chase",
    balance: 45230.0,
    change: 1.2,
    balanceHistory: createBalanceHistory(45230.0, 1.2),
    lastSync: "2 hours ago",
    status: "active",
    nextBillDue: null,
    nextBillAmount: null,
  },
  {
    id: 3,
    name: "Fidelity Brokerage",
    type: "Investment",
    institution: "Fidelity",
    balance: 187650.45,
    change: 5.7,
    balanceHistory: createBalanceHistory(187650.45, 5.7),
    lastSync: "1 hour ago",
    status: "active",
    nextBillDue: null,
    nextBillAmount: null,
  },
  {
    id: 4,
    name: "Sapphire Reserve",
    type: "Credit Card",
    institution: "Chase",
    balance: -2340.12,
    change: -15.2,
    balanceHistory: createBalanceHistory(-2340.12, -15.2),
    lastSync: "5 hours ago",
    status: "active",
    nextBillDue: "Feb 1, 2024",
    nextBillAmount: 2340.12,
  },
  {
    id: 5,
    name: "Amex Gold Card",
    type: "Credit Card",
    institution: "American Express",
    balance: -1234.56,
    change: -8.5,
    balanceHistory: createBalanceHistory(-1234.56, -8.5),
    lastSync: "1 day ago",
    status: "needs_update",
    nextBillDue: "Jan 28, 2024",
    nextBillAmount: 1234.56,
  },
  {
    id: 6,
    name: "Capital One 360",
    type: "Savings",
    institution: "Capital One",
    balance: 0.0,
    change: 0.0,
    balanceHistory: createBalanceHistory(0, 0),
    lastSync: "5 hours ago",
    status: "active",
    nextBillDue: null,
    nextBillAmount: null,
  },
]

export const sharedIcons = {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Filter,
  MoreHorizontal,
  Plus,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  ArrowUpDown,
}

// Additional updates can be added here if needed
